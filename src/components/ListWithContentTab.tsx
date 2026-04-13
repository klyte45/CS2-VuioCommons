import { VanillaComponentResolver } from "../VanillaComponentResolver";
import { VanillaWidgets } from "../VanillaWidgets";
import classNames from "classnames";
import { ContextMenuButton } from "./ContextMenuButton";
import { ReactNode } from "react";
import { ListActionTypeArray } from "./ListWithPreviewTab";

type Props = {
    listItems: (string | { section?: string, emptyPlaceholder?: string, displayName?: undefined } | { displayName: string, value: string })[],
    listActions?: ListActionTypeArray,
    children: ReactNode,
    onChangeSelection: (x: string) => any,
    selectedKey: string | null,
    emptyListMsg?: ReactNode,
    bodyClasses?: string
}


/**
 * A two-panel layout: a fixed-width scrollable list on the left, and an arbitrary content area on
 * the right. The list supports section headers, empty-placeholder rows, or selectable items.
 * Optional action buttons (plain `ToolButton` or `ContextMenuButton`) are shown above the list.
 *
 * `selectedKey` drives the highlighted state of list items. Selecting an item calls
 * `onChangeSelection` with its value string.
 *
 * This is the building block used by `ListWithPreviewTab`.
 *
 * @example
 * <ListWithContentTab
 *   listItems={fontNames.map(n => ({ displayName: n, value: n }))}
 *   selectedKey={selectedFont}
 *   onChangeSelection={setSelectedFont}
 *   listActions={[
 *     { isContext: false, src: addIcon, onSelect: openAddDialog, focusKey: FocusDisabled, className: btnClass }
 *   ]}
 * >
 *   <FontPreview fontName={selectedFont} />
 * </ListWithContentTab>
 */
export const ListWithContentTab = ({ listItems, listActions, onChangeSelection, selectedKey, children, emptyListMsg, bodyClasses }: Props) => {

    const Button = VanillaComponentResolver.instance.ToolButton;

    return <div className="k45_tabWithContent_content">
        <div className="k45_tabWithPreview_list">
            {!!listActions?.length && <div className="k45_tabWithPreview_listActions">
                {listActions?.map(x =>
                    x == null ? <div style={{ flexGrow: 1 }} />
                        : x.isContext ? <ContextMenuButton {...x} />
                            : <Button {...x} />
                )}
            </div>}
            {listItems.length ? <VanillaWidgets.instance.EditorScrollable className="k45_tabWithPreview_listContent">
                {listItems.map(x => {
                    if (typeof x == "string") {
                        return <button onClick={() => onChangeSelection(x)} className={classNames(x == selectedKey ? "selected" : "")}>{x}</button>
                    } else if (typeof x.displayName == "string") {
                        return <button onClick={() => onChangeSelection(x.value)} className={classNames(x.value == selectedKey ? "selected" : "")}>{x.displayName}</button>
                    } else {
                        if (x.section) {
                            return <div className="k45_listSection">{x.section}</div>
                        }
                        if (x.emptyPlaceholder) {
                            return <div className="k45_emptyPlaceholder">{x.emptyPlaceholder}</div>
                        }
                    }
                })}
            </VanillaWidgets.instance.EditorScrollable> : <div className="k45_tabWithPreview_emptyListMsg">{emptyListMsg ?? "List is empty"}</div>}
        </div>
        <div className={classNames("k45_tabWithContent_body", bodyClasses)}>
            {children}
        </div>
    </div >;
};
