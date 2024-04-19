import { Component } from "react";
import { VanillaComponentResolver } from "../VanillaComponentResolver";

type AmountValueSectionProps = {
    title: string;
    down: {
        tooltip: string;
        onSelect: () => any;
        disabledFn?: () => boolean;
    };
    up: {
        tooltip: string;
        onSelect: () => any;
        disabledFn?: () => boolean;
    };
    valueGetter: () => string;
};
export class AmountValueSection extends Component<AmountValueSectionProps> {

    render() {
        const baseUrl = "coui://GameUI/Media/Glyphs/";
        const arrowDownSrc = baseUrl + "ThickStrokeArrowDown.svg";
        const arrowUpSrc = baseUrl + "ThickStrokeArrowUp.svg";

        return <>
            <VanillaComponentResolver.instance.Section title={this.props.title}>
                <VanillaComponentResolver.instance.ToolButton
                    className={VanillaComponentResolver.instance.mouseToolOptionsTheme.startButton}
                    tooltip={this.props.down.tooltip}
                    onSelect={this.props.down.onSelect}
                    src={arrowDownSrc}
                    focusKey={VanillaComponentResolver.instance.FOCUS_DISABLED}
                    disabled={this.props.down.disabledFn?.()}
                ></VanillaComponentResolver.instance.ToolButton>
                <div className={VanillaComponentResolver.instance.mouseToolOptionsTheme.numberField}>{this.props.valueGetter()}</div>
                <VanillaComponentResolver.instance.ToolButton
                    className={VanillaComponentResolver.instance.mouseToolOptionsTheme.endButton}
                    tooltip={this.props.up.tooltip}
                    onSelect={this.props.up.onSelect}
                    src={arrowUpSrc}
                    focusKey={VanillaComponentResolver.instance.FOCUS_DISABLED}
                    disabled={this.props.up.disabledFn?.()}
                ></VanillaComponentResolver.instance.ToolButton>
            </VanillaComponentResolver.instance.Section>
        </>

    }
}


