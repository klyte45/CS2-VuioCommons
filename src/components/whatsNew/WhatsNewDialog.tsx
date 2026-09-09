import { VanillaComponentResolver } from "../../VanillaComponentResolver";
import { VanillaWidgets } from "../../VanillaWidgets";
import { replaceArgs } from "../../utils/name.utils";
import { VANILLA_SCROLLABLE_RESERVE_PROPS } from "../../utils/vanillaScrollable";
import { trigger } from "cs2/api";
import { FormattedParagraphs, MarkdownRenderer, Panel, Portal, Scrollable } from "cs2/ui";
import { useMemo } from "react";
import { WhatsNewService } from "./whatsNewService";
import { translateCommons, whatsNewDialogClass } from "./whatsNewI18n";
import { FocusDisabled } from "cs2/input";

const markdownRenderer = new MarkdownRenderer();

const EXTERNAL_LINK_PATTERN = /^https?:\/\//i;

function openWhatsNewLink(data: string) {
    if (EXTERNAL_LINK_PATTERN.test(data)) trigger("paradox", "showLink", data);
}

type Props = {
    acronym: string;
    version: string;
    modName: string;
    changelogMarkdown: string;
    thumbnailUrl: string | null;
    showOnNewVersion: boolean;
    onShowOnNewVersionChange: (value: boolean) => void;
    onClose: () => void;
    service: WhatsNewService;
};

export function WhatsNewDialog({
    acronym,
    version,
    modName,
    changelogMarkdown,
    thumbnailUrl,
    showOnNewVersion,
    onShowOnNewVersionChange,
    onClose,
    service,
}: Props) {
    const PanelTitleBar = VanillaComponentResolver.instance.PanelTitleBar;
    const Checkbox = VanillaWidgets.instance.Checkbox;
    const cls = (part: string) => whatsNewDialogClass(acronym, part);

    const title = replaceArgs(translateCommons(acronym, "whatsNew.title"), { version, modName });

    const renderer = useMemo(() => markdownRenderer, []);

    const onCheckboxChange = (checked: boolean) => {
        onShowOnNewVersionChange(checked);
        void service.setShowOnNewVersion(checked);
    };

    const onReadLater = () => onClose();

    const onOk = () => {
        void service.acknowledgeWhatsNew().finally(onClose);
    };

    return (
        <Portal>
            <div className={cls("anchor")}>
                <FocusDisabled>
                    <Panel
                        className={cls("panel")}
                        contentClassName={cls("content")}
                        header={
                            <PanelTitleBar
                                className={cls("titleBar")}
                                onCloseOverride={onReadLater}
                            >
                                {title}
                            </PanelTitleBar>
                        }
                    >
                        <div className={cls("content")}>
                            <div className={cls("scrollRow")}>
                                {thumbnailUrl ? (
                                    <img
                                        className={cls("thumbnail")}
                                        src={thumbnailUrl}
                                        alt=""
                                    />
                                ) : null}
                                <div className={cls("body")}>
                                    <Scrollable
                                        className={cls("scrollable")}
                                        {...VANILLA_SCROLLABLE_RESERVE_PROPS}
                                    >
                                        <FormattedParagraphs
                                            renderer={renderer}
                                            text={changelogMarkdown}
                                            onLinkSelect={openWhatsNewLink}
                                        />
                                    </Scrollable>
                                </div>
                            </div>
                            <div className={cls("footer")}>
                                <div className={cls("checkboxRow")}>
                                    <Checkbox
                                        checked={showOnNewVersion}
                                        onChange={onCheckboxChange}
                                    />
                                    <span className={cls("checkboxLabel")}>
                                        {translateCommons(acronym, "whatsNew.showOnFuture")}
                                    </span>
                                </div>
                                <div className={`k45_dialogBtns ${cls("actions")}`}>
                                    <button type="button" className="negativeBtn" onClick={onReadLater}>
                                        {translateCommons(acronym, "whatsNew.readLater")}
                                    </button>
                                    <button type="button" className="positiveBtn" onClick={onOk}>
                                        {translateCommons(acronym, "whatsNew.ok")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </FocusDisabled>
            </div>
        </Portal>
    );
}
