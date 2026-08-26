import { ReactNode } from "react";
import { FocusDisabled } from "cs2/input";
import { VanillaWidgets } from "../VanillaWidgets";
import styles from "./FormLine.module.scss";

type Props = {
    title: string | JSX.Element;
    onClick?: () => void;
    compact?: boolean;
    className?: string;
    subtitle?: string | JSX.Element;
    tooltip?: string;
    children?: ReactNode;
};

export const FormLine = ({
    title,
    onClick,
    compact,
    className,
    subtitle,
    tooltip,
    children,
}: Props) => {
    const editor = VanillaWidgets.instance.editorItemModule;

    return (
        <div
            className={[
                editor.row,
                styles.formLine,
                compact ? styles.compact : "",
                className ?? "",
            ].filter(Boolean).join(" ")}
            onClick={() => onClick?.()}
            data-tooltip={tooltip}
        >
            <div className={[editor.label, styles.label].join(" ")}>
                <div className={styles.title}>{title}</div>
                {subtitle != null && subtitle !== "" && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
            <div className={[editor.control, styles.content].join(" ")}>
                <FocusDisabled>{children}</FocusDisabled>
            </div>
        </div>
    );
};
