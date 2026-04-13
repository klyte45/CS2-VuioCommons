import { VanillaComponentResolver } from "../VanillaComponentResolver";
import { PropsDropdownField, VanillaWidgets } from "../VanillaWidgets";
import { Portal } from "cs2/ui";
import { useState } from "react";
import "./BaseStringInputDialog.scss";

type DropwdownDialogProps<T> = {
    isActive: boolean,
    setIsActive: (x: boolean) => any,
    callback: (valueSet?: T) => any
    title: string
    promptText: string,
    translate: (key: string, fallback?: string) => string,
} & Omit<PropsDropdownField<T>, 'style' | 'onChange' | 'translate'>

export const DropdownDialog = <T,>(props: DropwdownDialogProps<T>) => {
    const { callback, title, promptText, value: initialValue, setIsActive, isActive, translate, ...restProps } = props;
    const Dialog = VanillaComponentResolver.instance.Dialog;
    const DropdownField = VanillaWidgets.instance.DropdownField<T>();
    const [value, setValue] = useState(initialValue as T | undefined)
    const onConfirm = (x?: T) => {
        setIsActive(false);
        callback(x);
    };
    return <>
        {isActive && <Portal>
            <Dialog
                onClose={() => callback()}
                wide={true}
                title={title}
                buttons={<div className="k45_dialogBtns">
                    <button className="positiveBtn" onClick={() => onConfirm(value)}>{translate("loadBtn")}</button>
                    <button className="negativeBtn" onClick={() => onConfirm()}>{translate("cancelBtn")}</button>
                </div>}>
                <div className="k45_dialogMessage">
                    <p>{promptText}</p>
                    <DropdownField
                        {...restProps}
                        value={value}
                        onChange={(x) => setValue(x)}
                        style={{ flexGrow: 1, width: "inherit" }}
                    />
                </div>
            </Dialog>
        </Portal>}
        </>
};
