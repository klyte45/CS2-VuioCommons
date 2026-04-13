import { VanillaComponentResolver } from "../VanillaComponentResolver";
import { VanillaWidgets } from "../VanillaWidgets";
import { useState } from "react";
import "./BaseStringInputDialog.scss";

type BaseStringInputDialogProps = {
    onConfirm: (nameSet?: string) => any
    dialogTitle: string
    dialogPromptText: string
    initialValue?: string
    validationFn?: (val: string) => boolean
    maxLength?: number
    translate: (key: string, fallback?: string) => string
}

/**
 * The inner dialog body for a string-input prompt. Renders a vanilla `Dialog` with a text field,
 * a confirm button (disabled until the value is non-empty or passes `validationFn`), and a cancel
 * button. Does **not** manage its own Portal or visibility — wrap with `StringInputDialog` for that.
 *
 * Both button labels are obtained through the `translate` prop; use keys `"saveBtn"` and `"cancelBtn"`.
 *
 * @example
 * // Used internally by StringInputDialog and StringInputWithOverrideDialog:
 * <BaseStringInputDialog
 *   dialogTitle="Rename font"
 *   dialogPromptText="Enter the new font name:"
 *   initialValue={selectedFont}
 *   maxLength={30}
 *   validationFn={name => /^[a-zA-Z0-9_-]+$/.test(name)}
 *   translate={(key) => translations[key]}
 *   onConfirm={(value) => value ? doRename(value) : cancelRename()}
 * />
 */
export const BaseStringInputDialog = ({ onConfirm: callback, dialogTitle: title, dialogPromptText: promptText, initialValue, validationFn, maxLength, translate }: BaseStringInputDialogProps) => {
    const Dialog = VanillaComponentResolver.instance.Dialog;
    const StringInputField = VanillaWidgets.instance.StringInputField;
    const [name, setName] = useState(initialValue ?? "")

    return <Dialog
        onClose={() => callback()}
        wide={true}
        title={title}
        buttons={<div className="k45_dialogBtns">
            {<button className="positiveBtn" onClick={() => callback(name)} disabled={validationFn ? !validationFn(name) : !name.trim()}>{translate("saveBtn")}</button>}
            <button className="negativeBtn" onClick={() => callback()}>{translate("cancelBtn")}</button>
        </div>}>
        <div className="k45_dialogMessage">
            <p>{promptText}</p>
            <StringInputField onChange={setName} value={name} maxLength={maxLength} />
        </div>
    </Dialog>
};
