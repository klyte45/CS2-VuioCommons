import { PropsToolButton, VanillaComponentResolver } from "../VanillaComponentResolver";
import { VanillaWidgets } from "../VanillaWidgets";
import classNames from "classnames";
import { Portal } from "cs2/ui";
import { CSSProperties, Dispatch, MutableRefObject, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import "./ContextMenuButton.scss"

export type ContextButtonMenuItemArray = ({
    label: ReactNode,
    action: () => any,
    disabled?: boolean
} | null)[]

export enum ContextMenuExpansion {
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    TOP_RIGHT,
    TOP_LEFT
}

export type ContextMenuButtonProps = {
    menuTitle?: ReactNode,
    menuItems: ContextButtonMenuItemArray,
    menuDirection?: ContextMenuExpansion,
    maxHeight?: number
} & Omit<PropsToolButton, "onClick" | "onSelect" | "selected">
/**
 * A vanilla `ToolButton` that opens a floating context menu (rendered via a Portal) when clicked.
 * The menu can contain labelled action items, disabled items, or separator nulls. Automatically
 * repositions itself to stay within the screen (bottom-right, bottom-left, top-right, or top-left)
 * unless a direction is forced via `menuDirection`. Closes on outside click.
 *
 * Used throughout the hierarchy view toolbar to group related actions (add node, export, import, paste)
 * behind a single button, preventing toolbar clutter.
 *
 * @example
 * <ContextMenuButton
 *   src=\"coui://uil/Standard/Plus.svg\"
 *   tooltip=\"Add item\"
 *   focusKey={FocusDisabled}
 *   className={toolButtonTheme.button}
 *   menuTitle=\"Add\"
 *   menuItems={[
 *     { label: \"Add root\",    action: () => addRoot() },
 *     { label: \"Add child\",   action: () => addChild(), disabled: !hasSelection },
 *     null,
 *     { label: \"Add sibling\", action: () => addSibling() },
 *   ]}
 * />
 */
export const ContextMenuButton = (props: ContextMenuButtonProps) => {
    const btnRef = useRef(null as any as HTMLDivElement);
    const menuRef = useRef(null as any as HTMLDivElement);
    const Button = VanillaComponentResolver.instance.ToolButton;
    const ScrollPanel = VanillaWidgets.instance.EditorScrollable;

    const findFixedPosition = calculateElementPosition;
    const menuPosition = findFixedPosition(btnRef.current)
    const [menuOpen, setMenuOpen] = useState(false);

    const [menuCss, setMenuCss] = useState({} as CSSProperties)
    const menuDirection = props.menuDirection;

    useEffect(() => {
        setMenuCss(onRecalculateContextMenuPosition(btnRef, menuPosition, menuDirection));
    }, [menuOpen])



    const handleClickOutside = (event: MouseEvent) => {
        if (!btnRef.current) return;
        if (isOnArea(event, btnRef)) return;
        if (!menuRef.current) return;
        if (isOnArea(event, menuRef)) return;
        setMenuOpen(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, []);


    return <>
        <div ref={btnRef}>
            <Button {...props} selected={menuOpen} onSelect={() => { setMenuOpen(!menuOpen) }} />
        </div>
        {menuOpen && <Portal>
            <div className="k45_comm_contextMenu" style={menuCss} ref={menuRef}>
                {props.menuTitle && <div className="k45_comm_contextMenu_title">{props.menuTitle}</div>}
                <ScrollPanel style={{ maxHeight: props.maxHeight ?? "300rem" }}>
                    {props.menuItems.map(x => x ? <button className={classNames("k45_comm_contextMenu_item", x.disabled ? "disabled" : "")} onClick={() => { setMenuOpen(false); x.action() }} disabled={x.disabled}>{x.label}</button> : <div className="k45_comm_contextMenu_separator" />)}
                </ScrollPanel>
            </div>
        </Portal>
        }
    </>
}

export function onRecalculateContextMenuPosition(btnRef: MutableRefObject<HTMLDivElement>, menuPosition: { left: number; top: number; }, menuDirection?: ContextMenuExpansion | undefined): CSSProperties {
    const effectiveMenuDirection = menuDirection ?? findBetterDirectionContextMenu(btnRef, menuPosition);
    switch (effectiveMenuDirection) {
        case ContextMenuExpansion.BOTTOM_LEFT:
            return ({ top: menuPosition.top + btnRef.current?.offsetHeight + 3, right: window.innerWidth - menuPosition.left - btnRef.current?.offsetWidth, borderTopLeftRadius: 0 } as CSSProperties);
        case ContextMenuExpansion.TOP_RIGHT:
            return ({ bottom: window.innerHeight - menuPosition.top + 3, left: menuPosition.left, borderBottomLeftRadius: 0 } as CSSProperties);
        case ContextMenuExpansion.TOP_LEFT:
            return ({ bottom: window.innerHeight - menuPosition.top + 3, right: window.innerWidth - menuPosition.left - btnRef.current?.offsetWidth, borderBottomRightRadius: 0 } as CSSProperties);
        case ContextMenuExpansion.BOTTOM_RIGHT:
        default:
            return ({ top: menuPosition.top + btnRef.current?.offsetHeight + 3, left: menuPosition.left, borderTopRightRadius: 0 } as CSSProperties);
    }
}

export function calculateElementPosition(el: HTMLElement) {
    const result = { left: 0, top: 0 };
    if (el) {
        let nextParent = el;
        do {
            result.left += nextParent.offsetLeft;
            result.top += nextParent.offsetTop;
        } while (nextParent = nextParent.offsetParent as HTMLElement);
    }
    return result;
};


function findBetterDirectionContextMenu(btnRef: MutableRefObject<HTMLDivElement>, menuPosition: { left: number; top: number; }) {
    if (!btnRef.current) return;
    const btnCenterX = menuPosition.left + btnRef.current.offsetWidth / 2;
    const btnCenterY = menuPosition.top + btnRef.current.offsetHeight / 2;
    if (btnCenterX > window.innerWidth / 2) { //right - expand left
        if (btnCenterY > window.innerHeight / 2) { //bottom - expand top
            return ContextMenuExpansion.TOP_LEFT;
        } else {
            return ContextMenuExpansion.BOTTOM_LEFT;
        }
    } else {
        if (btnCenterY > window.innerHeight / 2) { //bottom - expand top
            return ContextMenuExpansion.TOP_RIGHT;
        } else {
            return ContextMenuExpansion.BOTTOM_RIGHT;
        }
    }
}


export const isOnArea = (event: MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return false;
    const rect = calculateElementPosition(el);
    return event.clientX >= rect.left && event.clientX <= rect.left + el.offsetWidth && event.clientY >= rect.top && event.clientY <= rect.top + el.offsetHeight;
}