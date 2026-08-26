import { ReactNode } from "react";
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
}: Props) => (
    <div
        className={[styles.formLine, compact ? styles.compact : "", className ?? ""].filter(Boolean).join(" ")}
        onClick={() => onClick?.()}
        data-tooltip={tooltip}
    >
        <div className={styles.label}>
            <div className={styles.title}>{title}</div>
            {subtitle != null && subtitle !== "" && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        <div className={styles.content}>{children}</div>
    </div>
);
