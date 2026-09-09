import engine from "cohtml/cohtml";

export function translateCommons(acronym: string, key: string): string {
    const fullKey = `K45::${acronym.toUpperCase()}.commons[${key}]`;
    const tr = engine.translate(fullKey);
    if (tr === fullKey) {
        (window as any).K45_MISSING_I18N ??= new Set<string>();
        ((window as any).K45_MISSING_I18N as Set<string>).add(fullKey);
    }
    return tr;
}

export function whatsNewDialogClass(acronym: string, part: string): string {
    return `${acronym.toLowerCase()}-whatsNewDialog_${part}`;
}
