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
