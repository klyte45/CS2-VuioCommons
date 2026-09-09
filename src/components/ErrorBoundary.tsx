import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }> {
    state = { hasError: false };

    componentDidCatch(error: unknown, info: unknown) {
        this.setState({ hasError: true });
        console.log(error, info);
    }

    render() {
        if (this.state.hasError) {
            return <>
                <h1>Something went wrong.</h1>
                <h2>Reload the window to restart it. (click twice on the taskbar icon)</h2>
            </>;
        }
        return this.props.children;
    }
}
