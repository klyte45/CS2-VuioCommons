
import { DropdownItem, LocalizedString, LocElement, Theme, UniqueFocusKey } from "cs2/bindings";
import { getModule } from "cs2/modding";
import { CSSProperties, HTMLAttributes } from "react";
import { VanillaComponentResolver } from "./VanillaComponentResolver";

export type UIColorRGBA = {
    r: number
    g: number
    b: number
    a: number
}
export enum LocElementType {
    Bounds = "Game.UI.Localization.LocalizedBounds",
    Fraction = "Game.UI.Localization.LocalizedFraction",
    Number = "Game.UI.Localization.LocalizedNumber",
    String = "Game.UI.Localization.LocalizedString"
}

type PropsColorPicker = {
    label?: string | JSX.Element | JSX.Element[]
    value: UIColorRGBA
    showAlpha?: boolean
    disabled?: boolean
    onChange: (newVal: UIColorRGBA) => any
} & Omit<HTMLAttributes<any>, "onChange">

type PropsIntSlider = {
    label?: string | JSX.Element | JSX.Element[]
    value: number
    min: number
    max: number
    disabled?: boolean
    onChange?: (newVal: number) => any
    onChangeStart?: (newVal: number) => any
    onChangeEnd?: (newVal: number) => any
} & Omit<HTMLAttributes<any>, "onChange">

type PropsFloatSlider = {
    label?: string | JSX.Element | JSX.Element[]
    value: number
    min: number
    max: number
    fractionDigits?: number
    disabled?: boolean
    onChange?: (newVal: number) => any
    onChangeStart?: (newVal: number) => any
    onChangeEnd?: (newVal: number) => any
} & Omit<HTMLAttributes<any>, "onChange">


type PropsDropdownField<T> = {
    items: DropdownItem<T>[],
    value: T,
    onChange?: (newVal: T) => any
    disabled?: boolean
} & Omit<HTMLAttributes<any>, "onChange">

type PropsEditorItemControl = { label?: string, children?: JSX.Element | JSX.Element[] | string, styleContent?: React.CSSProperties }
type PropsFocusableEditorItem = { disabled?: boolean, centered?: boolean, className?: string, focusKey?: UniqueFocusKey, onFocusChange?: () => any, children?: JSX.Element | JSX.Element[] | string }
type PropsDirectoryPickerButton = { label: string, value: string, disabled?: boolean, className?: string, theme?: Theme, onOpenDirectoryBrowser: () => any }
type PropsStringInputField = { value: string, disabled?: boolean, onChange: (s: string) => any, className?: string, maxLength?: number } & ({
    onChangeStart?: HTMLTextAreaElement['onfocus'], onChangeEnd?: HTMLTextAreaElement['onblur'], multiline: true,
} | {
    onChangeStart?: HTMLInputElement['onfocus'], onChangeEnd?: HTMLInputElement['onblur'], multiline?: false | undefined,
})
type PropsToggleField = { label: string, value: boolean, disabled?: boolean, onChange: (x: boolean) => any }
type PropsFloatInputField = { label: string, value: number, min?: number, max?: number, fractionDigits?: number, disabled?: boolean, onChange: (s: number) => any, className?: string, maxLength?: number } & ({
    onChangeStart?: HTMLTextAreaElement['onfocus'], onChangeEnd?: HTMLTextAreaElement['onblur'], multiline: true,
} | {
    onChangeStart?: HTMLInputElement['onfocus'], onChangeEnd?: HTMLInputElement['onblur'], multiline?: false | undefined,
})

export type HierarchyViewport = {
    displayName: LocElement,
    icon?: string,
    tooltip?: LocElement,
    level: number,
    selectable?: boolean,
    selected?: boolean,
    expandable?: boolean,
    expanded?: boolean
}

type PropsHierarchyMenu = {
    viewport: HierarchyViewport[],
    flex: { grow: CSSProperties['flexGrow'], shrink: CSSProperties['flexShrink'], basis: CSSProperties['flexBasis'] },
    visibleCount: number,
    onSelect?: (viewportIndex: number, selected: boolean) => any,
    onSetExpanded?: (viewportIndex: number, expanded: boolean) => any,
    singleSelection?: boolean,
    onRenderedRangeChange?: (startIndex: number, endIndex: number) => any
}

const registryIndex = {
    themeDropdown: ["game-ui/menu/widgets/dropdown-field/dropdown-field.module.scss", "classes"],
    inputField: ["game-ui/debug/widgets/fields/input-field/input-field.module.scss", "classes"],
    ColorPicker: ["game-ui/editor/widgets/fields/color-field.tsx", "ColorField"],
    IntSlider: ["game-ui/editor/widgets/fields/number-slider-field.tsx", "IntSliderField"],
    FloatSlider: ["game-ui/editor/widgets/fields/number-slider-field.tsx", "FloatSliderField"],
    DropdownField: ["game-ui/editor/widgets/fields/dropdown-field.tsx", "DropdownField"],
    FocusableEditorItem: ["game-ui/editor/widgets/item/editor-item.tsx", "FocusableEditorItem"],
    editorItemModule: ["game-ui/editor/widgets/item/editor-item.module.scss", "classes"],
    DirectoryPickerButton: ["game-ui/editor/widgets/fields/directory-picker-button.tsx", "DirectoryPickerButton"],
    StringInputField: ["game-ui/editor/widgets/fields/string-input-field.tsx", "StringInputField"],
    ToggleField: ["game-ui/editor/widgets/fields/toggle-field.tsx", "ToggleField"],
    FloatInputField: ["game-ui/editor/widgets/fields/float-input-field.tsx", "FloatInputField"],
    HierarchyMenu: ["game-ui/editor/widgets/hierarchy-menu/hierarchy-menu.tsx", "HierarchyMenu"],
}



export class VanillaWidgets {
    public static get instance(): VanillaWidgets { return this._instance ??= new VanillaWidgets() }
    private static _instance?: VanillaWidgets



    private cachedData: Partial<Record<keyof typeof registryIndex, any>> = {}
    private updateCache(entry: keyof typeof registryIndex) {
        const entryData = registryIndex[entry];
        return this.cachedData[entry] = getModule(entryData[0], entryData[1])
    }



    public get themeDropdown(): Theme | any { return this.cachedData["themeDropdown"] ?? this.updateCache("themeDropdown") }
    public get inputField(): Theme | any { return this.cachedData["inputField"] ?? this.updateCache("inputField") }

    public get ColorPicker(): (props: PropsColorPicker) => JSX.Element { return this.cachedData["ColorPicker"] ?? this.updateCache("ColorPicker") }
    public get IntSlider(): (props: PropsIntSlider) => JSX.Element { return this.cachedData["IntSlider"] ?? this.updateCache("IntSlider") }
    public get FloatSlider(): (props: PropsFloatSlider) => JSX.Element { return this.cachedData["FloatSlider"] ?? this.updateCache("FloatSlider") }
    public DropdownField<T>(): (props: PropsDropdownField<T>) => JSX.Element { return this.cachedData["DropdownField"] ?? this.updateCache("DropdownField") }
    public get FocusableEditorItem(): (props: PropsFocusableEditorItem) => JSX.Element { return this.cachedData["FocusableEditorItem"] ?? this.updateCache("FocusableEditorItem") }
    public get editorItemModule(): Theme | any { return this.cachedData["editorItemModule"] ?? this.updateCache("editorItemModule") }
    public EditorItemRow = ({ label, children, styleContent }: PropsEditorItemControl) => <VanillaWidgets.instance.FocusableEditorItem focusKey={VanillaComponentResolver.instance.FOCUS_DISABLED}>
        <div className={this.editorItemModule.row} style={label ? {} : styleContent}>
            {label ? <><div className={this.editorItemModule.label}>{label}</div><div className={this.editorItemModule.control} style={styleContent}>{children}</div></> : children}
        </div>
    </VanillaWidgets.instance.FocusableEditorItem>
    public get DirectoryPickerButton(): (props: PropsDirectoryPickerButton) => JSX.Element { return this.cachedData["DirectoryPickerButton"] ?? this.updateCache("DirectoryPickerButton") }
    public get StringInputField(): (props: PropsStringInputField) => JSX.Element { return this.cachedData["StringInputField"] ?? this.updateCache("StringInputField") }
    public get ToggleField(): (props: PropsToggleField) => JSX.Element { return this.cachedData["ToggleField"] ?? this.updateCache("ToggleField") }
    public get FloatInputField(): (props: PropsFloatInputField) => JSX.Element { return this.cachedData["FloatInputField"] ?? this.updateCache("FloatInputField") }
    public get HierarchyMenu(): (props: PropsHierarchyMenu) => JSX.Element { return this.cachedData["HierarchyMenu"] ?? this.updateCache("HierarchyMenu") }

}
