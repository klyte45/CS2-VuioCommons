import { useEffect, useMemo, useRef, useState } from "react";
import { WhatsNewDialog } from "./WhatsNewDialog";
import {
    createWhatsNewService,
    WhatsNewShowPayload,
} from "./whatsNewService";

type HostState = {
    engineUnsubscribe: (() => void) | null;
    showListeners: Set<(payload: WhatsNewShowPayload) => void>;
    activeHostId: number | null;
    nextHostId: number;
};

const hostStateByAcronym = new Map<string, HostState>();

function getHostState(acronym: string): HostState {
    const key = acronym.toLowerCase();
    let state = hostStateByAcronym.get(key);
    if (!state) {
        state = {
            engineUnsubscribe: null,
            showListeners: new Set(),
            activeHostId: null,
            nextHostId: 0,
        };
        hostStateByAcronym.set(key, state);
    }
    return state;
}

type Props = {
    acronym: string;
};

export function WhatsNewHost({ acronym }: Props) {
    const service = useMemo(() => createWhatsNewService(acronym), [acronym]);
    const hostState = useMemo(() => getHostState(acronym), [acronym]);

    const hostIdRef = useRef(0);
    if (hostIdRef.current === 0) {
        hostIdRef.current = ++hostState.nextHostId;
    }
    const hostId = hostIdRef.current;

    const [payload, setPayload] = useState<WhatsNewShowPayload | null>(null);
    const [showOnNewVersion, setShowOnNewVersionLocal] = useState(true);

    const claimActiveHost = () => {
        if (hostState.activeHostId === null) {
            hostState.activeHostId = hostId;
        }
        return hostState.activeHostId === hostId;
    };

    useEffect(() => {
        if (!hostState.engineUnsubscribe) {
            hostState.engineUnsubscribe = service.subscribeWhatsNewShow((next) => {
                for (const listener of hostState.showListeners) {
                    listener(next);
                }
            });
        }

        claimActiveHost();

        let cancelled = false;
        const isCancelled = () => cancelled;

        const onShow = (next: WhatsNewShowPayload) => {
            if (!claimActiveHost()) {
                return;
            }
            // Consume backend force/auto pending so polls do not re-open after a push event.
            void service.pullPendingWhatsNew();
            setShowOnNewVersionLocal(next.showOnNewVersion);
            setPayload(next);
        };

        hostState.showListeners.add(onShow);

        void (async () => {
            const pending = await service.waitForPendingWhatsNew(isCancelled);
            if (pending && !isCancelled()) {
                onShow(pending);
            }
        })();

        return () => {
            cancelled = true;
            hostState.showListeners.delete(onShow);
            if (hostState.activeHostId === hostId) {
                hostState.activeHostId = null;
            }
            if (hostState.showListeners.size === 0 && hostState.engineUnsubscribe) {
                hostState.engineUnsubscribe();
                hostState.engineUnsubscribe = null;
            }
        };
    }, [acronym, hostId, hostState, service]);

    if (!claimActiveHost() || !payload) {
        return null;
    }

    return (
        <WhatsNewDialog
            acronym={acronym}
            version={payload.version}
            modName={payload.modName}
            changelogMarkdown={payload.changelogMarkdown}
            thumbnailUrl={payload.thumbnailUrl}
            showOnNewVersion={showOnNewVersion}
            onShowOnNewVersionChange={setShowOnNewVersionLocal}
            onClose={() => setPayload(null)}
            service={service}
        />
    );
}
