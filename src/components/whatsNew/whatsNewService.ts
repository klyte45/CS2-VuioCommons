import engine from "cohtml/cohtml";

export type WhatsNewShowPayload = {
    version: string;
    changelogMarkdown: string;
    showOnNewVersion: boolean;
    thumbnailUrl: string | null;
    modName: string;
};

function normalizeAcronym(acronym: string): string {
    return acronym.toLowerCase();
}

function callPrefix(acronym: string): string {
    return `k45::${normalizeAcronym(acronym)}.whatsNew`;
}

function parseShowPayload(raw: unknown): WhatsNewShowPayload | null {
    if (!Array.isArray(raw) || raw.length < 3) {
        return null;
    }
    const [version, changelogMarkdown, showOnNewVersion, thumbnailUrl, modName] = raw;
    if (typeof version !== "string" || typeof changelogMarkdown !== "string") {
        return null;
    }
    return {
        version,
        changelogMarkdown,
        showOnNewVersion: !!showOnNewVersion,
        thumbnailUrl: typeof thumbnailUrl === "string" ? thumbnailUrl : null,
        modName: typeof modName === "string" ? modName : "",
    };
}

export function createWhatsNewService(acronym: string) {
    const prefix = callPrefix(acronym);
    const showEvent = `${prefix}.show`;

    async function canPresentWhatsNew(): Promise<boolean> {
        return !!(await engine.call(`${prefix}.canPresent`));
    }

    async function shouldShowWhatsNew(): Promise<boolean> {
        return !!(await engine.call(`${prefix}.shouldShow`));
    }

    async function pullPendingWhatsNew(): Promise<WhatsNewShowPayload | null> {
        const raw = await engine.call(`${prefix}.pullPending`);
        return parseShowPayload(raw);
    }

    function subscribeWhatsNewShow(listener: (payload: WhatsNewShowPayload) => void): () => void {
        // Backend already gated presentation before firing; do not re-check canPresent here —
        // force-show clears its flag before the UI async handler runs, which would drop the event.
        const handler = (
            version: string,
            changelogMarkdown: string,
            showOnNewVersion: boolean,
            thumbnailUrl?: string,
            modName?: string,
        ) => {
            listener({
                version,
                changelogMarkdown,
                showOnNewVersion: !!showOnNewVersion,
                thumbnailUrl: thumbnailUrl ?? null,
                modName: modName ?? "",
            });
        };
        engine.on(showEvent, handler);
        return () => engine.off(showEvent, handler);
    }

    const PENDING_POLL_MS = 250;

    async function waitForPendingWhatsNew(
        isCancelled: () => boolean,
    ): Promise<WhatsNewShowPayload | null> {
        while (!isCancelled()) {
            if (!(await shouldShowWhatsNew())) {
                return null;
            }

            if (await canPresentWhatsNew()) {
                const pending = await pullPendingWhatsNew();
                if (pending) {
                    return pending;
                }
            }

            await new Promise((resolve) => setTimeout(resolve, PENDING_POLL_MS));
        }

        return null;
    }

    async function setShowOnNewVersion(value: boolean): Promise<void> {
        await engine.call(`${prefix}.setShowOnNewVersion`, value);
    }

    async function acknowledgeWhatsNew(): Promise<void> {
        await engine.call(`${prefix}.acknowledge`);
    }

    return {
        subscribeWhatsNewShow,
        waitForPendingWhatsNew,
        pullPendingWhatsNew,
        setShowOnNewVersion,
        acknowledgeWhatsNew,
    };
}

export type WhatsNewService = ReturnType<typeof createWhatsNewService>;
