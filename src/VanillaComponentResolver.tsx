
import { FocusKey, Theme, UniqueFocusKey } from "cs2/bindings";
import { getModule } from "cs2/modding";
import { ButtonProps, DropdownProps, DropdownToggleProps, IconButtonProps, InfoRowProps, InfoSectionProps } from "cs2/ui";
import { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
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

type PropsTooltip = {
    tooltip: ReactNode
    disabled?: boolean
    theme?: Theme & any
    direction?: "up" | "down" | "left" | "right"
    alignment?: "left" | "right" | "center"
    className?: string
    children: ReactNode
    forceVisible?: boolean
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
    children?: ReactNode
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
    children: ReactNode
}

type PropsDescriptionTooltip = {
    title: string | JSX.Element
    description: string | JSX.Element
    content?: ReactNode,
    children: JSX.Element
}

type DialogProps = {
    wide?: boolean,
    title?: ReactNode,
    content?: ReactNode,
    buttons?: ReactNode,
    theme?: any,
    zIndex?: number,
    onClose?: () => any,
    initialFocus?: any,
    children: ReactNode
}

type TabNavProps = {
    tabs: string[],
    selectedTab: string | null,
    children: ReactNode,
    onSelect?: (newIdx: number) => any
}
type TabBarProps = {
    className?: string,
    children: ReactNode
}

type TabProps = {
    id: any,
    selectedId: any,
    disabled?: boolean,
    locked?: boolean,
    className?: string,
    children: ReactNode,
    onSelect: (id: string) => any
}

type PanelTitleBarProps = {
    icon?: string,
    theme?: Theme,
    className?: string,
    children?: ReactNode,
    onCloseOverride?: (() => any) | null,
} & HTMLAttributes<any>

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
    ellipsisInput: ["game-ui/common/input/text/ellipsis-text-input/themes/default.module.scss", "classes"],
    ellipsisInputAlt: ["game-ui/common/input/text/ellipsis-text-input/ellipsis-text-input.module.scss", "classes"],
    actionsSectionTheme: ["game-ui/game/components/selected-info-panel/selected-info-sections/shared-sections/actions-section/actions-section.module.scss", "classes"],
    DescriptionTooltip: ["game-ui/common/tooltip/description-tooltip/description-tooltip.tsx", "DescriptionTooltip"],
    actionButtonTheme: ["game-ui/game/components/selected-info-panel/selected-info-sections/shared-sections/actions-section/action-button.module.scss", "classes"],
    CommonButton: ["game-ui/common/input/button/button.tsx", "Button"],
    Dialog: ["game-ui/common/panel/dialog/dialog.tsx", "Dialog"],
    TabNav: ["game-ui/common/tabs/tabs.tsx", "TabNav"],
    TabBar: ["game-ui/common/tabs/tabs.tsx", "TabBar"],
    Tab: ["game-ui/common/tabs/tabs.tsx", "Tab"],
    toggleGamePanel: ["game-ui/game/data-binding/game-bindings.ts", "toggleGamePanel"],
    gameMainScreenModule: ["game-ui/game/components/game-main-screen.module.scss", "classes"],
    PanelTitleBar: ["game-ui/common/panel/panel-title-bar.tsx", "PanelTitleBar"],
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
    public get TooltipRow(): (props: any) => JSX.Element { return this.cachedData["TooltipRow"] ?? this.updateCache("TooltipRow") }
    public get ActiveFocusDiv(): (props: any) => JSX.Element { return this.cachedData["ActiveFocusDiv"] ?? this.updateCache("ActiveFocusDiv") }
    public get PassiveFocusDiv(): (props: any) => JSX.Element { return this.cachedData["PassiveFocusDiv"] ?? this.updateCache("PassiveFocusDiv") }
    public get Dropdown(): (props: DropdownProps) => JSX.Element { return this.cachedData["Dropdown"] ?? this.updateCache("Dropdown") }
    //public get DropdownItem(): (props: DropdownItemProps<T>) => JSX.Element { return this.cachedData["DropdownItem"] ?? this.updateCache("DropdownItem") }
    public get DropdownToggle(): (props: DropdownToggleProps) => JSX.Element { return this.cachedData["DropdownToggle"] ?? this.updateCache("DropdownToggle") }
    public get IconButton(): (props: IconButtonProps) => JSX.Element { return this.cachedData["IconButton"] ?? this.updateCache("IconButton") }
    public get Tooltip(): (props: PropsTooltip) => JSX.Element { return this.cachedData["Tooltip"] ?? this.updateCache("Tooltip") }
    public get EllipsisTextInput(): (props: PropsEllipsesTextInput) => JSX.Element { return this.cachedData["EllipsisTextInput"] ?? this.updateCache("EllipsisTextInput") }


    public get themeToggleLine(): Theme | any { return this.cachedData["themeToggleLine"] ?? this.updateCache("themeToggleLine") }
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
    public get ellipsisInput(): Theme | any { return this.cachedData["ellipsisInput"] ?? this.updateCache("ellipsisInput") }
    public get ellipsisInputAlt(): Theme | any { return this.cachedData["ellipsisInputAlt"] ?? this.updateCache("ellipsisInputAlt") }
    public get actionsSectionTheme(): Theme | any { return this.cachedData["actionsSectionTheme"] ?? this.updateCache("actionsSectionTheme") }
    public get DescriptionTooltip(): (props: PropsDescriptionTooltip) => JSX.Element { return this.cachedData["DescriptionTooltip"] ?? this.updateCache("DescriptionTooltip") }
    public get actionButtonTheme(): Theme | any { return this.cachedData["actionButtonTheme"] ?? this.updateCache("actionButtonTheme") }
    public get CommonButton(): (props: ButtonProps) => JSX.Element { return this.cachedData["CommonButton"] ?? this.updateCache("CommonButton") }
    public get Dialog(): (props: DialogProps) => JSX.Element { return this.cachedData["Dialog"] ?? this.updateCache("Dialog") }


    public get TabNav(): (props: TabNavProps) => JSX.Element { return this.cachedData["TabNav"] ?? this.updateCache("TabNav") }
    public get TabBar(): (props: TabBarProps) => JSX.Element { return this.cachedData["TabBar"] ?? this.updateCache("TabBar") }
    public get Tab(): (props: TabProps) => JSX.Element { return this.cachedData["Tab"] ?? this.updateCache("Tab") }


    public get toggleGamePanel(): (panelId: string) => void { return this.cachedData["toggleGamePanel"] ?? this.updateCache("toggleGamePanel") }
    public get gameMainScreenModule(): Theme | any { return this.cachedData["gameMainScreenModule"] ?? this.updateCache("gameMainScreenModule") }

    public get PanelTitleBar(): (props: PanelTitleBarProps) => JSX.Element { return this.cachedData["PanelTitleBar"] ?? this.updateCache("PanelTitleBar") }
}
