import { VanillaComponentResolver } from "../VanillaComponentResolver";
import { VanillaWidgets } from "../VanillaWidgets";
import { Portal } from "cs2/ui";
import { ReactNode, useEffect, useRef, useState } from "react";
import "./FilePickerDialog.scss";
import classNames from "classnames";
import { ContextMenuButton } from "./ContextMenuButton";
import engine from "cohtml/cohtml";
import { FocusDisabled } from "cs2/input";

export type DataProviderItem = { displayName: string, directory: boolean, fullPath: string }
export type DataProvider = DataProviderItem[]

export type FileItemPresentation = {
    /** Content rendered under the display name (e.g. preview strip). */
    extra?: ReactNode;
    /**
     * When false, item is treated as invalid (styled + not selectable).
     * Omit / true = selectable. Future fields can extend this object.
     */
    valid?: boolean;
    /**
     * Optional tooltip override for this row.
     * When omitted, keep default tooltip = displayName.
     */
    tooltip?: string;
};

export type ResolveFileItemPresentation = (
    item: DataProviderItem,
) => FileItemPresentation | Promise<FileItemPresentation | null | undefined> | null | undefined;

function sortFilePickerItems(items: DataProvider): DataProvider {
    return [...items].sort((a, b) => {
        if (a.directory !== b.directory) return a.directory ? -1 : 1;
        return a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" });
    });
}

type FilePickerDialogProps = {
    isActive: boolean,
    setIsActive: (x: boolean) => any,
    dialogTitle: string,
    dialogPromptText: string,
    allowedExtensions: string,
    actionOnSuccess: (x?: string) => any,
    initialFolder: string,
    bookmarks?: { name: string, targetPath: string }[]
    bookmarksTitle?: string,
    bookmarksIcon?: string,
    translate: (key: string, fallback?: string) => string,
    generateDataProvider(folder: string, allowedExtension: string): Promise<DataProvider>
    resolveFileItemPresentation?: ResolveFileItemPresentation
}

/**
 * A Portal-wrapped modal file-browser dialog. Shows the contents of a directory fetched via
 * `generateDataProvider`, lets the user navigate folders, click a file to select it, and confirm.
 * Supports bookmarks (shortcuts to common directories) displayed as a context menu.
 * The current folder path is shown in a clickable breadcrumb that turns into a text field for
 * manual path entry.
 *
 * Optional `resolveFileItemPresentation` enriches each row with extra content under the name,
 * validity (invalid rows are not selectable), and a tooltip override. Sync or Promise results
 * are supported without blocking the listing.
 *
 * `allowedExtensions` is passed through to `generateDataProvider` (e.g. `"*.ttf"`).
 *
 * @example
 * <FilePickerDialog
 *   isActive={isPickingFile}
 *   setIsActive={setIsPickingFile}
 *   dialogTitle="Add font"
 *   dialogPromptText="Select a .ttf font file:"
 *   allowedExtensions="*.ttf"
 *   initialFolder={fontsFolder}
 *   generateDataProvider={FileService.generateDataProvider}
 *   translate={translate}
 *   bookmarksTitle="Mod folders"
 *   bookmarks={modFolders.map(m => ({ name: m.ModName, targetPath: m.Location }))}
 *   actionOnSuccess={(path) => path && installFont(path)}
 * />
 */
export const FilePickerDialog = ({
    isActive, setIsActive, dialogTitle, dialogPromptText, allowedExtensions, actionOnSuccess, initialFolder, bookmarks, bookmarksTitle, bookmarksIcon, translate, generateDataProvider, resolveFileItemPresentation
}: FilePickerDialogProps) => {
    const onConfirm = (x?: string) => {
        setIsActive(false);
        actionOnSuccess(x);
    };
    return <Portal>
        {isActive &&
            <BaseFilePickerDialog onConfirm={onConfirm} dialogTitle={dialogTitle} allowedExtensions={allowedExtensions}
                dialogPromptText={dialogPromptText} initialFolder={initialFolder} bookmarks={bookmarks} bookmarksTitle={bookmarksTitle}
                bookmarksIcon={bookmarksIcon} translate={translate} generateDataProvider={generateDataProvider}
                resolveFileItemPresentation={resolveFileItemPresentation} />
        }
    </Portal>;
};

type BaseFilePickerDialogProps = {
    onConfirm: (nameSet?: string) => any
    dialogTitle: string
    dialogPromptText: string
    initialFolder: string
    allowedExtensions: string,
    bookmarks?: { name: string, targetPath: string }[]
    bookmarksTitle?: string,
    bookmarksIcon?: string
    translate: (key: string, fallback?: string) => string,
    generateDataProvider(folder: string, allowedExtension: string): Promise<DataProvider>
    resolveFileItemPresentation?: ResolveFileItemPresentation
}

const BaseFilePickerDialog = ({ onConfirm: callback, dialogTitle: title, dialogPromptText: promptText,
    allowedExtensions, initialFolder, bookmarks, bookmarksTitle, bookmarksIcon, translate, generateDataProvider, resolveFileItemPresentation }: BaseFilePickerDialogProps) => {
    const T_parentFolder = translate("picker.parentFolder", "Parent folder");
    const T_initialFolder = translate("picker.initialFolder", "Initial folder");
    const i_dirIcon = "coui://uil/Standard/Folder.svg";
    const i_fileIcon = "coui://uil/Standard/PaperWithArrow.svg";
    const i_parentDirIcon = "coui://uil/Standard/ArrowUp.svg";
    const i_bookmarks = "coui://uil/Standard/StarFilledSmall.svg";
    const i_homeIcon = "coui://uil/Standard/Home.svg";

    const Dialog = VanillaComponentResolver.instance.Dialog;
    const Tooltip = VanillaComponentResolver.instance.Tooltip;
    const Scrollable = VanillaWidgets.instance.EditorScrollable;
    const StringInputField = VanillaWidgets.instance.StringInputField;
    const toolButtonTheme = VanillaComponentResolver.instance.toolButtonTheme;
    const [value, setValue] = useState(-1)
    const [currentFolder, setCurrentFolder] = useState(initialFolder);
    const [currentFolderTyping, setCurrentFolderTyping] = useState(initialFolder);
    const [currentData, setCurrentData] = useState([] as DataProvider);
    const [isEditingPath, setIsEditingPath] = useState(false);
    const [itemValidity, setItemValidity] = useState<Record<string, boolean>>({});

    const refInput = useRef(null as any as HTMLDivElement);

    useEffect(() => {
        setValue(-1);
        setItemValidity({});
        generateDataProvider(currentFolder, allowedExtensions).then((items) => {
            setCurrentData(sortFilePickerItems(items ?? []));
        });
        setIsEditingPath(false);
    }, [allowedExtensions, currentFolder])

    useEffect(() => {
        if (value < 0) return;
        const selected = currentData[value];
        if (!selected) {
            setValue(-1);
            return;
        }
        if (itemValidity[selected.fullPath] === false) {
            setValue(-1);
        }
    }, [itemValidity, value, currentData])

    useEffect(() => {
        if (isEditingPath && refInput.current) {
            const input = [...(refInput.current?.children ?? [])].find(x => x.tagName == "INPUT") as HTMLInputElement;
            if (input) {
                setCurrentFolderTyping(currentFolder)
                input.focus()
                input.setSelectionRange(currentFolder.length, currentFolder.length)
            }
        }
    }, [isEditingPath])

    const onItemSet = (i: number) => {
        const selectedItem = currentData[i];
        if (!selectedItem) return;
        if (selectedItem.directory) {
            setCurrentFolder(selectedItem.fullPath);
            return;
        }
        if (itemValidity[selectedItem.fullPath] === false) return;
        setValue(i);
    }

    const onPresentationResolved = (fullPath: string, presentation: FileItemPresentation | null | undefined) => {
        if (presentation?.valid === false) {
            setItemValidity((prev) => (prev[fullPath] === false ? prev : { ...prev, [fullPath]: false }));
        } else if (presentation?.valid === true) {
            setItemValidity((prev) => (prev[fullPath] === true ? prev : { ...prev, [fullPath]: true }));
        }
    }

    const navigateFolderUp = () => {
        setCurrentFolder(currentFolder.replaceAll("\\", "/").split("/").slice(0, currentFolder.endsWith("/") ? -2 : -1).join("/") + "/")
    }

    const menuItems: Parameters<typeof ContextMenuButton>[0]['menuItems'] | null = bookmarks ? bookmarks.map(x => {
        return {
            label: x.name,
            action: () => setCurrentFolder(x.targetPath)
        }
    }) : null;

    const getCurrentFolderTitle = () => {
        const bookmarkName = bookmarks?.find(x => x.targetPath == currentFolder);
        const folderName = currentFolder.split(/[\\\/]/).filter(x => x).slice(-1)[0] || "/";
        return bookmarkName ? <><b className="bookmark">{bookmarkName.name}</b> ({folderName})</> : folderName;
    }

    const selectedPath = value >= 0 ? currentData[value]?.fullPath : undefined;
    const okDisabled = value < 0 || (selectedPath != null && itemValidity[selectedPath] === false);

    return <Dialog
        onClose={() => callback()}
        wide={true}
        title={title}
        buttons={<div className="k45_dialogBtns">
            <button className="positiveBtn" disabled={okDisabled} onClick={() => callback(currentData[value].fullPath)}>{engine.translate("Common.OK")}</button>
            <button className="negativeBtn" onClick={() => callback()}>{translate("cancelBtn")}</button>
        </div>}>
        <div className="k45_dialogMessage">
            <p>{promptText}</p>
            <div ref={refInput} className="k45_currentFolder">
                <FocusDisabled>
                    <VanillaComponentResolver.instance.ToolButton onSelect={() => setCurrentFolder(initialFolder)} src={i_homeIcon} focusKey={VanillaComponentResolver.instance.FOCUS_DISABLED} className={classNames(toolButtonTheme.button, "home")} tooltip={T_initialFolder} />
                    {menuItems ? <Tooltip tooltip={bookmarksTitle}><ContextMenuButton menuTitle={bookmarksTitle} className="bookmarks" menuItems={menuItems} src={bookmarksIcon ?? i_bookmarks} /></Tooltip> : <div style={{ marginLeft: "5rem" }} />}
                    <StringInputField className={isEditingPath ? "" : "hidden"} value={currentFolderTyping} onChange={setCurrentFolderTyping} onChangeEnd={() => { setIsEditingPath(false); setCurrentFolder(currentFolderTyping + (currentFolderTyping.endsWith("/") ? "" : "/")); }} />
                    <div className={classNames("k45_currentPath", isEditingPath ? "hidden" : "")} onClick={() => setIsEditingPath(true)}>{getCurrentFolderTitle()}</div>
                    <VanillaComponentResolver.instance.ToolButton onSelect={navigateFolderUp} src={i_parentDirIcon} focusKey={VanillaComponentResolver.instance.FOCUS_DISABLED} className={classNames(toolButtonTheme.button, "above")} tooltip={T_parentFolder} />
                </FocusDisabled>
            </div>
            <Scrollable className="k45_fileItemsListing">
                {currentData?.map((x, i) => (
                    <FilePickerItemRow
                        key={x.fullPath}
                        item={x}
                        selected={value == i}
                        dirIcon={i_dirIcon}
                        fileIcon={i_fileIcon}
                        resolveFileItemPresentation={resolveFileItemPresentation}
                        onSelect={() => onItemSet(i)}
                        onPresentationResolved={onPresentationResolved}
                    />
                ))}
            </Scrollable>
        </div>
    </Dialog>
};

function FilePickerItemRow({
    item,
    selected,
    dirIcon,
    fileIcon,
    resolveFileItemPresentation,
    onSelect,
    onPresentationResolved,
}: {
    item: DataProviderItem;
    selected: boolean;
    dirIcon: string;
    fileIcon: string;
    resolveFileItemPresentation?: ResolveFileItemPresentation;
    onSelect: () => void;
    onPresentationResolved: (fullPath: string, presentation: FileItemPresentation | null | undefined) => void;
}) {
    const Tooltip = VanillaComponentResolver.instance.Tooltip;
    const [presentation, setPresentation] = useState<FileItemPresentation | null | undefined>(undefined);
    const resolveRef = useRef(resolveFileItemPresentation);
    resolveRef.current = resolveFileItemPresentation;
    const onResolvedRef = useRef(onPresentationResolved);
    onResolvedRef.current = onPresentationResolved;

    useEffect(() => {
        let cancelled = false;
        setPresentation(undefined);
        const resolve = resolveRef.current;
        if (!resolve) {
            onResolvedRef.current(item.fullPath, null);
            return;
        }
        const result = resolve(item);
        if (result && typeof (result as Promise<FileItemPresentation>).then === "function") {
            (result as Promise<FileItemPresentation | null | undefined>).then((resolved) => {
                if (cancelled) return;
                setPresentation(resolved ?? null);
                onResolvedRef.current(item.fullPath, resolved);
            }).catch(() => {
                if (cancelled) return;
                setPresentation(null);
                onResolvedRef.current(item.fullPath, null);
            });
        } else {
            const sync = (result as FileItemPresentation | null | undefined) ?? null;
            setPresentation(sync);
            onResolvedRef.current(item.fullPath, sync);
        }
        return () => { cancelled = true; };
    }, [item.fullPath, item.directory, item.displayName]);

    const invalid = presentation?.valid === false;

    return (
        <Tooltip tooltip={presentation?.tooltip ?? item.displayName}>
            <div
                className={classNames(
                    "k45_fileItemsListing_item",
                    selected && "selected",
                    invalid && "invalid",
                )}
                onClick={onSelect}
            >
                <img className="k45_fileItemIcon" src={item.directory ? dirIcon : fileIcon} />
                <div className="k45_fileItemsListing_itemBody">
                    <div className="k45_fileItemsListing_itemName">{item.displayName}</div>
                    {presentation?.extra || <></>}
                </div>
            </div>
        </Tooltip>
    );
}
