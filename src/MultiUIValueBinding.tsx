import engine from "cohtml/cohtml";

export class MultiUIValueBinding<T> {

    public get value(): T {
        return this.internalValue as T;
    }
    private internalValue?: T;
    private subscriptions: ((x: T) => Promise<any>)[] = []

    setInternalValue(x: any) {
        this.internalValue = x;
        Promise.all(this.subscriptions.map(y => y(x)));
    }

    constructor(private propertyPrefix: string) {
        engine.call(this.propertyPrefix + "?").then((x) => this.setInternalValue(x));
        engine.off(this.propertyPrefix + "->");
        engine.on(this.propertyPrefix + "->", (x) => this.setInternalValue(x));
    }

    async set(newValue: T) {
        engine.call(this.propertyPrefix + "!", newValue);
    }

    dispose() {
        engine.off(this.propertyPrefix + "->");
    }

    subscribe(fn: (x: T) => Promise<any>) {
        this.subscriptions.unshift(fn);
    }

}
