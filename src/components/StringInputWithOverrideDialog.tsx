import { Portal, ConfirmationDialog } from "cs2/ui"
import { useState } from "react"
import { BaseStringInputDialog } from "./BaseStringInputDialog"

type StringInputWithOverrideDialogProps = {
    isActive: boolean,
    setIsActive: (x: boolean) => any,
    dialogTitle: string,
    dialogPromptText: string,
    dialogOverrideText: string,
    initialValue?: string,
    isShortCircuitCheckFn: (x?: string) => boolean,
    checkIfExistsFn: (x?: string) => Promise<boolean>,
    actionOnSuccess: (x: string) => any,
    validationFn?: (val: string) => boolean
    maxLength?: number,
    translate: (key: string, fallback?: string) => string
}
/**
 * Like `StringInputDialog` but adds an override-confirmation step. After the user confirms a name,
 * `checkIfExistsFn` is awaited: if it returns `true` a second `ConfirmationDialog` is shown asking
 * whether to overwrite. `isShortCircuitCheckFn` can short-circuit the whole flow early (e.g. the
 * name is unchanged), in which case `actionOnSuccess` is never called.
 *
 * Used for rename/duplicate operations where the target name may already be taken.
 *
 * @example
 * <StringInputWithOverrideDialog
 *   isActive={isRenaming}
 *   setIsActive={setIsRenaming}
 *   dialogTitle="Rename font"
 *   dialogPromptText="Enter the new font name:"
 *   dialogOverrideText="A font with that name already exists. Overwrite?"
 *   initialValue={selectedFont}
 *   maxLength={30}
 *   validationFn={v => /^[\w-]+$/.test(v)}
 *   isShortCircuitCheckFn={(v) => !v || v === selectedFont}
 *   checkIfExistsFn={FontService.checkFontExists}
 *   actionOnSuccess={(newName) => doRename(newName)}
 *   translate={translate}
 * />
 */
export const StringInputWithOverrideDialog = ({
    isActive,
    setIsActive,
    dialogTitle,
    dialogPromptText,
    dialogOverrideText,
    initialValue,
    isShortCircuitCheckFn,
    checkIfExistsFn,
    actionOnSuccess,
    validationFn,
    maxLength,
    translate
}: StringInputWithOverrideDialogProps) => {
    const [confirmingOverride, setConfirmingOverride] = useState(false)
    const [actionOnConfirmOverride, setActionOnConfirmOverride] = useState(() => () => { })
    const callback = getOverrideCheckFn(
        setIsActive,
        isShortCircuitCheckFn,
        checkIfExistsFn,
        setActionOnConfirmOverride,
        setConfirmingOverride,
        actionOnSuccess as any
    );

    return <Portal>
        {isActive && <BaseStringInputDialog onConfirm={callback} dialogTitle={dialogTitle} dialogPromptText={dialogPromptText} initialValue={initialValue} validationFn={validationFn} maxLength={maxLength} translate={translate} />}
        {confirmingOverride && <ConfirmationDialog onConfirm={() => { actionOnConfirmOverride(); }} title={dialogTitle} onCancel={() => setConfirmingOverride(false)} message={dialogOverrideText} />}
    </Portal>
}

export const getOverrideCheckFn = (
    unsetStateFn: (x: boolean) => any,
    isShortCircuitCheckFn: (x?: string) => boolean,
    checkIfExistsFn: (x?: string) => Promise<boolean>,
    confirmationOverrideFnSetter: (fn: () => any) => any,
    confirmationOverrideEnablerSetter: (newVal: boolean) => any,
    actionOnSuccess: (x?: string) => any
) => async (newName?: string) => {
    unsetStateFn(false);
    newName = newName?.trim();
    if (isShortCircuitCheckFn(newName)) return;
    if (await checkIfExistsFn(newName)) {
        confirmationOverrideFnSetter(() => () => {
            actionOnSuccess(newName);
            confirmationOverrideEnablerSetter(false)
        });
        confirmationOverrideEnablerSetter(true);
    } else {
        actionOnSuccess(newName);
    }
};
