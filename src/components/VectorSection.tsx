import { Component } from "react";
import { VanillaComponentResolver } from "../VanillaComponentResolver";

type VectorSectionProps = {
    title: string;
    valueGetter: () => string[];
};

export class VectorSection extends Component<VectorSectionProps> {

    render() {
        return <>
            <VanillaComponentResolver.instance.Section title={this.props.title}>
                {this.props.valueGetter()?.map((x, i) => <div key={i} className={VanillaComponentResolver.instance.mouseToolOptionsTheme.numberField}>{x}</div>)}
            </VanillaComponentResolver.instance.Section>
        </>;

    }
}
