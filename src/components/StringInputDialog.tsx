import { Portal } from "cs2/ui";
import { BaseStringInputDialog } from "./BaseStringInputDialog";

type StringInputDialogProps = {
    isActive: boolean,
    setIsActive: (x: boolean) => any,
    dialogTitle: string,
    dialogPromptText: string,
    initialValue?: string,
    actionOnSuccess: (x?: string) => any,
    validationFn?: (val: string) => boolean
    maxLength?: number,
    translate: (key: string, fallback?: string) => string
}

/**
 * A Portal-wrapped modal dialog that prompts the user to type a string value.
 * The dialog is only rendered while `isActive` is true. On confirm the entered value is passed to
 * `actionOnSuccess`; on dismiss (cancel or close) it is called without arguments.
 *
 * @example
 * <StringInputDialog
 *   isActive={isRenaming}
 *   setIsActive={setIsRenaming}
 *   dialogTitle="Rename layout"
 *   dialogPromptText="Enter the new name:"
 *   initialValue={currentName}
 *   maxLength={30}
 *   validationFn={v => v.trim().length > 0}
 *   translate={translate}
 *   actionOnSuccess={(newName) => newName && doRename(newName)}
 * />
 */
export const StringInputDialog = ({
    isActive, setIsActive, dialogTitle, dialogPromptText, initialValue, actionOnSuccess, validationFn, maxLength, translate
}: StringInputDialogProps) => {
    const onConfirm = (x?: string) => {
        setIsActive(false);
        actionOnSuccess(x);
    };
    return <Portal>
        {isActive && <BaseStringInputDialog onConfirm={onConfirm} dialogTitle={dialogTitle} dialogPromptText={dialogPromptText} initialValue={initialValue} validationFn={validationFn} maxLength={maxLength} translate={translate} />}
    </Portal>;
};
