import { PropsToolButton } from "../VanillaComponentResolver";
import { ReactNode } from "react";
import "./ListWithPreviewTab.scss";
import { ContextMenuButtonProps } from "./ContextMenuButton";
import { ListWithContentTab } from "./ListWithContentTab";

export type ListActionTypeArray = (({ isContext: false } & PropsToolButton) | ({ isContext: true } & ContextMenuButtonProps) | null)[];

type Props = {
    listItems: (string | { section?: string, emptyPlaceholder?: string, displayName?: undefined } | { displayName: string, value: string })[],
    detailsFields?: {
        key: ReactNode,
        value: ReactNode
    }[],
    listActions?: ListActionTypeArray,
    itemActions: ({
        className: string,
        action: () => any,
        text: string
    } | null)[]
    children: ReactNode,
    onChangeSelection: (x: string) => any,
    selectedKey: string | null,
    emptyListMsg?: ReactNode,
    noneSelectedMsg?: ReactNode,
}

/**
 * Extends `ListWithContentTab` with a structured right-hand panel composed of three zones:
 * a preview area (children), a key–value details grid, and a row of action buttons at the bottom.
 * When nothing is selected, a placeholder message fills the content area.
 *
 * Used for resource management tabs (fonts, atlases, city layouts, prefab templates) where clicking
 * a list entry shows its preview along with metadata and contextual actions.
 *
 * @example
 * <ListWithPreviewTab
 *   listItems={fontNames}
 *   selectedKey={selectedFont}
 *   onChangeSelection={setSelectedFont}
 *   detailsFields={[
 *     { key: "GUID",   value: fontDetail?.guid },
 *     { key: "Source", value: fontDetail?.source },
 *   ]}
 *   itemActions={[
 *     { className: "negativeBtn", text: "Delete", action: onDelete },
 *     { className: "positiveBtn", text: "Rename", action: onRename },
 *   ]}
 *   listActions={[
 *     { isContext: false, src: addIcon, onSelect: openAddDialog, focusKey: FocusDisabled, className: btnClass }
 *   ]}
 *   emptyListMsg="No fonts installed"
 *   noneSelectedMsg="Select a font to preview it"
 * >
 *   <FontPreview fontName={selectedFont} />
 * </ListWithPreviewTab>
 */
export const ListWithPreviewTab = ({ listItems, detailsFields, listActions, itemActions, onChangeSelection, selectedKey, children, emptyListMsg, noneSelectedMsg }: Props) => {

    return <ListWithContentTab listItems={listItems} listActions={listActions} onChangeSelection={onChangeSelection} selectedKey={selectedKey} emptyListMsg={emptyListMsg} >
        {selectedKey ? <>
            <div className="k45_tabWithPreview_preview">
                {children}
            </div>
            <div className="k45_tabWithPreview_details">
                {selectedKey && detailsFields &&
                    detailsFields.map(x =>
                        <div className="k45_keyValueContent">
                            <div className="key">{x.key}</div>
                            <div className="value">{x.value}</div>
                        </div>)
                }
            </div>
            <div className="k45_tabWithPreview_actions">
                {selectedKey &&
                    itemActions.map(x => x == null ? <div style={{ flexGrow: 1 }} /> : <button className={x.className} onClick={x.action}>{x.text}</button>)
                }
            </div>
        </> : <div className="k45_tabWithPreview_noneSelectedMsg">{noneSelectedMsg ?? "No item selected"}</div>}
    </ListWithContentTab>
};
