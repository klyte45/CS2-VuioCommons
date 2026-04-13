import { VanillaComponentResolver } from "../VanillaComponentResolver";
import { VanillaWidgets } from "../VanillaWidgets";
import { Portal } from "cs2/ui";
import { useEffect, useRef, useState } from "react";
import "./FilePickerDialog.scss";
import classNames from "classnames";
import { ContextMenuButton } from "./ContextMenuButton";
import engine from "cohtml/cohtml";
import { FocusDisabled } from "cs2/input";

export type DataProvider = { displayName: string, directory: boolean, fullPath: string }[]

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
}

/**
 * A Portal-wrapped modal file-browser dialog. Shows the contents of a directory fetched via
 * `generateDataProvider`, lets the user navigate folders, click a file to select it, and confirm.
 * Supports bookmarks (shortcuts to common directories) displayed as a context menu.
 * The current folder path is shown in a clickable breadcrumb that turns into a text field for
 * manual path entry.
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
    isActive, setIsActive, dialogTitle, dialogPromptText, allowedExtensions, actionOnSuccess, initialFolder, bookmarks, bookmarksTitle, bookmarksIcon, translate, generateDataProvider
}: FilePickerDialogProps) => {
    const onConfirm = (x?: string) => {
        setIsActive(false);
        actionOnSuccess(x);
    };
    return <Portal>
        {isActive &&
            <BaseFilePickerDialog onConfirm={onConfirm} dialogTitle={dialogTitle} allowedExtensions={allowedExtensions}
                dialogPromptText={dialogPromptText} initialFolder={initialFolder} bookmarks={bookmarks} bookmarksTitle={bookmarksTitle}
                bookmarksIcon={bookmarksIcon} translate={translate} generateDataProvider={generateDataProvider} />
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
}
const BaseFilePickerDialog = ({ onConfirm: callback, dialogTitle: title, dialogPromptText: promptText,
    allowedExtensions, initialFolder, bookmarks, bookmarksTitle, bookmarksIcon, translate, generateDataProvider }: BaseFilePickerDialogProps) => {
    const T_parentFolder = "Parent folder"
    const T_initialFolder = "Initial folder"
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

    const refInput = useRef(null as any as HTMLDivElement);

    useEffect(() => {
        generateDataProvider(currentFolder, allowedExtensions).then(setCurrentData);
        setIsEditingPath(false);
    }, [allowedExtensions, currentFolder])

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
        if (selectedItem.directory) setCurrentFolder(selectedItem.fullPath);
        else setValue(i);
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
    return <Dialog
        onClose={() => callback()}
        wide={true}
        title={title}
        buttons={<div className="k45_dialogBtns">
            <button className="positiveBtn" disabled={value < 0} onClick={() => callback(currentData[value].fullPath)}>{engine.translate("Common.OK")}</button>
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
                {currentData?.map((x, i) => <Tooltip tooltip={x.displayName}>
                    <div className={classNames("k45_fileItemsListing_item", value == i ? "selected" : null)} key={i} onClick={() => onItemSet(i)}><img className="k45_fileItemIcon" src={x.directory ? i_dirIcon : i_fileIcon} />{x.displayName}</div>
                </Tooltip>)}
            </Scrollable>
        </div>
    </Dialog>
};
