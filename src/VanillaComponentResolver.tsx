
import { DropdownItem, FocusKey, LocalizedBounds, LocalizedFraction, LocalizedNumber, LocalizedString, LocElement, LocElementType, Theme, UniqueFocusKey } from "cs2/bindings";
import { LocComponent } from "cs2/l10n";
import { getModule } from "cs2/modding";
import { ButtonProps, DropdownProps, DropdownToggleProps, IconButtonProps, InfoRowProps, InfoSectionProps } from "cs2/ui";
import { HTMLAttributes, InputHTMLAttributes } from "react";

export type UIColorRGBA = {
    r: number
    g: number
    b: number
    a: number
}

type PropsToggleField = {
    "value": any,
    "disabled"?: boolean,
    "onChange"?: (x: any) => any
}

type PropsRadioToggle = {
    focusKey?: UniqueFocusKey | null
    checked: boolean
    disabled?: boolean
    theme?: Theme | any
    style?: CSSStyleRule
    className?: string
} & HTMLAttributes<any>

type PropsRadioGroupToggleField = {
    value: any,
    groupValue: any,
    disabled?: boolean,
    onChange?: (x: any) => any,
    onToggleSelected?: (x: any) => any,
} & HTMLAttributes<any>

type PropsTooltipRow = {

}
type PropsTooltip = {
    tooltip: string | JSX.Element | JSX.Element[]
    disabled?: boolean
    theme?: Theme & any
    direction?: "up" | "down" | "left" | "right"
    alignment?: "left" | "right" | "center"
    className?: string
    children: string | JSX.Element | JSX.Element[]
}

export type PropsEllipsesTextInput = {
    "value"?: string,
    "maxLength"?: number,
    "theme"?: Theme,
    "className"?: string
} & InputHTMLAttributes<PropsEllipsesTextInput>

type PropsToolButton = {
    focusKey?: UniqueFocusKey | null
    src: string
    selected?: boolean
    multiSelect?: boolean
    disabled?: boolean
    tooltip?: string | JSX.Element | null
    selectSound?: any
    uiTag?: string
    className?: string
    children?: string | JSX.Element | JSX.Element[]
    onSelect?: (x: any) => any,
} & HTMLAttributes<any>

type PropsStepToolButton = {
    focusKey?: UniqueFocusKey | null
    selectedValue: number
    values: number[]
    tooltip?: string | null
    uiTag?: string
    onSelect?: (x: any) => any,
} & HTMLAttributes<any>

type PropsSection = {
    title?: string | null | JSX.Element
    uiTag?: string
    children: string | JSX.Element | JSX.Element[]
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

type PropsDescriptionTooltip = {
    title: string | JSX.Element
    description: string | JSX.Element
    content?: string | JSX.Element | JSX.Element[],
    children: JSX.Element
}

type PropsDropdownField<T> = {
    items: DropdownItem<T>[],
    value: T,
    onChange?: (newVal: T) => any
    disabled?: boolean
} & Omit<HTMLAttributes<any>, "onChange">

type PropsEditorItemControl = { label: string, children?: JSX.Element | JSX.Element[] | string, styleContent?: React.CSSProperties }
type PropsFocusableEditorItem = { disabled?: boolean, centered?: boolean, className?: string, focusKey?: UniqueFocusKey, onFocusChange?: () => any, children?: JSX.Element | JSX.Element[] | string }
type PropsDirectoryPickerButton = { label: string, value: string, disabled?: boolean, className?: string, theme?: Theme, onOpenDirectoryBrowser: () => any }
type PropsStringInputField = { value: string, disabled?: boolean, onChange: (s: string) => any, className?: string, maxLength?: number } & ({
    onChangeStart?: HTMLTextAreaElement['onfocus'], onChangeEnd?: HTMLTextAreaElement['onblur'], multiline: true,
} | {
    onChangeStart?: HTMLInputElement['onfocus'], onChangeEnd?: HTMLInputElement['onblur'], multiline?: false | undefined,
})

const registryIndex = {
    RadioToggle: ["game-ui/common/input/toggle/radio-toggle/radio-toggle.tsx", "RadioToggle"],
    ToggleField: ["game-ui/menu/components/shared/game-options/toggle-field/toggle-field.tsx", "ToggleField"],
    RadioGroupToggleField: ["game-ui/menu/components/shared/game-options/toggle-field/toggle-field.tsx", "RadioGroupToggleField"],
    InfoSection: ["game-ui/game/components/selected-info-panel/shared-components/info-section/info-section.tsx", "InfoSection"],
    InfoRow: ["game-ui/game/components/selected-info-panel/shared-components/info-row/info-row.tsx", "InfoRow"],
    TooltipRow: ["game-ui/game/components/selected-info-panel/shared-components/info-row/info-row.tsx", "TooltipRow"],
    ActiveFocusDiv: ["game-ui/common/focus/focus-div.tsx", "ActiveFocusDiv"],
    PassiveFocusDiv: ["game-ui/common/focus/focus-div.tsx", "PassiveFocusDiv"],
    themeToggleLine: ["game-ui/game/components/selected-info-panel/selected-info-sections/lines-section/lines-section.module.scss", "classes"],
    FOCUS_DISABLED: ["game-ui/common/focus/focus-key.ts", "FOCUS_DISABLED"],
    FOCUS_AUTO: ["game-ui/common/focus/focus-key.ts", "FOCUS_AUTO"],
    useUniqueFocusKey: ["game-ui/common/focus/focus-key.ts", "useUniqueFocusKey"],
    Dropdown: ["game-ui/common/input/dropdown/dropdown.tsx", "Dropdown"],
    themeDropdown: ["game-ui/menu/widgets/dropdown-field/dropdown-field.module.scss", "classes"],
    DropdownItem: ["game-ui/common/input/dropdown/items/dropdown-item.tsx", "DropdownItem"],
    DropdownToggle: ["game-ui/common/input/dropdown/dropdown-toggle.tsx", "DropdownToggle"],
    IconButton: ["game-ui/common/input/button/icon-button.tsx", "IconButton"],
    themeGamepadToolOptions: ["game-ui/game/components/tool-options/tool-button/tool-button.module.scss", "classes"],
    Tooltip: ["game-ui/common/tooltip/tooltip.tsx", "Tooltip"],
    EllipsisTextInput: ['game-ui/common/input/text/ellipsis-text-input/ellipsis-text-input.tsx', "EllipsisTextInput"],
    Section: ["game-ui/game/components/tool-options/mouse-tool-options/mouse-tool-options.tsx", "Section"],
    ToolButton: ["game-ui/game/components/tool-options/tool-button/tool-button.tsx", "ToolButton"],
    StepToolButton: ["game-ui/game/components/tool-options/tool-button/tool-button.tsx", "StepToolButton"],
    toolButtonTheme: ["game-ui/game/components/tool-options/tool-button/tool-button.module.scss", "classes"],
    mouseToolOptionsTheme: ["game-ui/game/components/tool-options/mouse-tool-options/mouse-tool-options.module.scss", "classes"],
    assetGridTheme: ["game-ui/game/components/asset-menu/asset-grid/asset-grid.module.scss", "classes"],
    inputField: ["game-ui/debug/widgets/fields/input-field/input-field.module.scss", "classes"],
    ellipsisInput: ["game-ui/common/input/text/ellipsis-text-input/themes/default.module.scss", "classes"],
    ellipsisInputAlt: ["game-ui/common/input/text/ellipsis-text-input/ellipsis-text-input.module.scss", "classes"],
    ColorPicker: ["game-ui/editor/widgets/fields/color-field.tsx", "ColorField"],
    IntSlider: ["game-ui/editor/widgets/fields/number-slider-field.tsx", "IntSliderField"],
    FloatSlider: ["game-ui/editor/widgets/fields/number-slider-field.tsx", "FloatSliderField"],
    actionsSectionTheme: ["game-ui/game/components/selected-info-panel/selected-info-sections/shared-sections/actions-section/actions-section.module.scss", "classes"],
    DescriptionTooltip: ["game-ui/common/tooltip/description-tooltip/description-tooltip.tsx", "DescriptionTooltip"],
    actionButtonTheme: ["game-ui/game/components/selected-info-panel/selected-info-sections/shared-sections/actions-section/action-button.module.scss", "classes"],
    DropdownField: ["game-ui/editor/widgets/fields/dropdown-field.tsx", "DropdownField"],
    FocusableEditorItem: ["game-ui/editor/widgets/item/editor-item.tsx", "FocusableEditorItem"],
    editorItemModule: ["game-ui/editor/widgets/item/editor-item.module.scss", "classes"],
    DirectoryPickerButton: ["game-ui/editor/widgets/fields/directory-picker-button.tsx", "DirectoryPickerButton"],
    CommonButton: ["game-ui/common/input/button/button.tsx", "Button"],
    StringInputField: ["game-ui/editor/widgets/fields/string-input-field.tsx", "StringInputField"],
}



export class VanillaComponentResolver {
    public static get instance(): VanillaComponentResolver { return this._instance ??= new VanillaComponentResolver() }
    private static _instance?: VanillaComponentResolver



    private cachedData: Partial<Record<keyof typeof registryIndex, any>> = {}
    private updateCache(entry: keyof typeof registryIndex) {
        const entryData = registryIndex[entry];
        return this.cachedData[entry] = getModule(entryData[0], entryData[1])
    }

    public get RadioToggle(): (props: PropsRadioToggle) => JSX.Element { return this.cachedData["RadioToggle"] ?? this.updateCache("RadioToggle") }
    public get ToggleField(): (props: PropsToggleField) => JSX.Element { return this.cachedData["ToggleField"] ?? this.updateCache("ToggleField") }
    public get RadioGroupToggleField(): (props: PropsRadioGroupToggleField) => JSX.Element { return this.cachedData["RadioGroupToggleField"] ?? this.updateCache("RadioGroupToggleField") }
    public get InfoSection(): (props: InfoSectionProps & { children: JSX.Element | JSX.Element[] }) => JSX.Element { return this.cachedData["InfoSection"] ?? this.updateCache("InfoSection") }
    public get InfoRow(): (props: InfoRowProps) => JSX.Element { return this.cachedData["InfoRow"] ?? this.updateCache("InfoRow") }
    public get TooltipRow(): (props: PropsTooltipRow) => JSX.Element { return this.cachedData["TooltipRow"] ?? this.updateCache("TooltipRow") }
    public get ActiveFocusDiv(): (props: any) => JSX.Element { return this.cachedData["ActiveFocusDiv"] ?? this.updateCache("ActiveFocusDiv") }
    public get PassiveFocusDiv(): (props: any) => JSX.Element { return this.cachedData["PassiveFocusDiv"] ?? this.updateCache("PassiveFocusDiv") }
    public get Dropdown(): (props: DropdownProps) => JSX.Element { return this.cachedData["Dropdown"] ?? this.updateCache("Dropdown") }
    //public get DropdownItem(): (props: DropdownItemProps<T>) => JSX.Element { return this.cachedData["DropdownItem"] ?? this.updateCache("DropdownItem") }
    public get DropdownToggle(): (props: DropdownToggleProps) => JSX.Element { return this.cachedData["DropdownToggle"] ?? this.updateCache("DropdownToggle") }
    public get IconButton(): (props: IconButtonProps) => JSX.Element { return this.cachedData["IconButton"] ?? this.updateCache("IconButton") }
    public get Tooltip(): (props: PropsTooltip) => JSX.Element { return this.cachedData["Tooltip"] ?? this.updateCache("Tooltip") }
    public get EllipsisTextInput(): (props: PropsEllipsesTextInput) => JSX.Element { return this.cachedData["EllipsisTextInput"] ?? this.updateCache("EllipsisTextInput") }


    public get themeToggleLine(): Theme | any { return this.cachedData["themeToggleLine"] ?? this.updateCache("themeToggleLine") }
    public get themeDropdown(): Theme | any { return this.cachedData["themeDropdown"] ?? this.updateCache("themeDropdown") }
    public get themeGamepadToolOptions(): Theme | any { return this.cachedData["themeGamepadToolOptions"] ?? this.updateCache("themeGamepadToolOptions") }


    public get FOCUS_DISABLED(): UniqueFocusKey { return this.cachedData["FOCUS_DISABLED"] ?? this.updateCache("FOCUS_DISABLED") }
    public get FOCUS_AUTO(): UniqueFocusKey { return this.cachedData["FOCUS_AUTO"] ?? this.updateCache("FOCUS_AUTO") }
    public get useUniqueFocusKey(): (focusKey: FocusKey, debugName: string) => UniqueFocusKey | null { return this.cachedData["useUniqueFocusKey"] ?? this.updateCache("useUniqueFocusKey") }


    public get Section(): (props: PropsSection) => JSX.Element { return this.cachedData["Section"] ?? this.updateCache("Section") }
    public get ToolButton(): (props: PropsToolButton) => JSX.Element { return this.cachedData["ToolButton"] ?? this.updateCache("ToolButton") }
    public get StepToolButton(): (props: PropsStepToolButton) => JSX.Element { return this.cachedData["StepToolButton"] ?? this.updateCache("StepToolButton") }

    public get toolButtonTheme(): Theme | any { return this.cachedData["toolButtonTheme"] ?? this.updateCache("toolButtonTheme") }
    public get mouseToolOptionsTheme(): Theme | any { return this.cachedData["mouseToolOptionsTheme"] ?? this.updateCache("mouseToolOptionsTheme") }
    public get assetGridTheme(): Theme | any { return this.cachedData["assetGridTheme"] ?? this.updateCache("assetGridTheme") }
    public get inputField(): Theme | any { return this.cachedData["inputField"] ?? this.updateCache("inputField") }
    public get ellipsisInput(): Theme | any { return this.cachedData["ellipsisInput"] ?? this.updateCache("ellipsisInput") }
    public get ellipsisInputAlt(): Theme | any { return this.cachedData["ellipsisInputAlt"] ?? this.updateCache("ellipsisInputAlt") }
    public get ColorPicker(): (props: PropsColorPicker) => JSX.Element { return this.cachedData["ColorPicker"] ?? this.updateCache("ColorPicker") }
    public get IntSlider(): (props: PropsIntSlider) => JSX.Element { return this.cachedData["IntSlider"] ?? this.updateCache("IntSlider") }
    public get FloatSlider(): (props: PropsFloatSlider) => JSX.Element { return this.cachedData["FloatSlider"] ?? this.updateCache("FloatSlider") }
    public get actionsSectionTheme(): Theme | any { return this.cachedData["actionsSectionTheme"] ?? this.updateCache("actionsSectionTheme") }
    public get DescriptionTooltip(): (props: PropsDescriptionTooltip) => JSX.Element { return this.cachedData["DescriptionTooltip"] ?? this.updateCache("DescriptionTooltip") }
    public get actionButtonTheme(): Theme | any { return this.cachedData["actionButtonTheme"] ?? this.updateCache("actionButtonTheme") }
    public DropdownField<T>(): (props: PropsDropdownField<T>) => JSX.Element { return this.cachedData["DropdownField"] ?? this.updateCache("DropdownField") }
    public get FocusableEditorItem(): (props: PropsFocusableEditorItem) => JSX.Element { return this.cachedData["FocusableEditorItem"] ?? this.updateCache("FocusableEditorItem") }
    public get editorItemModule(): Theme | any { return this.cachedData["editorItemModule"] ?? this.updateCache("editorItemModule") }
    public EditorItemRow = ({ label, children, styleContent }: PropsEditorItemControl) => <VanillaComponentResolver.instance.FocusableEditorItem focusKey={this.FOCUS_DISABLED}>
        <div className={this.editorItemModule.row}>
            <div className={this.editorItemModule.label}>{label}</div>
            <div className={this.editorItemModule.control} style={styleContent} >{children}</div>
        </div>
    </VanillaComponentResolver.instance.FocusableEditorItem>
    public get DirectoryPickerButton(): (props: PropsDirectoryPickerButton) => JSX.Element { return this.cachedData["DirectoryPickerButton"] ?? this.updateCache("DirectoryPickerButton") }
    public get CommonButton(): (props: ButtonProps) => JSX.Element { return this.cachedData["CommonButton"] ?? this.updateCache("CommonButton") }
    public get StringInputField(): (props: PropsStringInputField) => JSX.Element { return this.cachedData["StringInputField"] ?? this.updateCache("StringInputField") }

}
