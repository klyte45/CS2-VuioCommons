import engine from "cohtml/cohtml";

export class MultiUIValueBinding<T, U = T> {

    public get value(): U {
        return this.internalValue as U;
    }
    private internalValue?: U;
    private subscriptions: ((x: U) => Promise<any>)[] = []
    private onUpdate = (x: T) => this.setInternalValue(x);

    setInternalValue(x: any) {
        this.internalValue = this.parseFn?.(x) ?? x;
        Promise.all(this.subscriptions.map(y => y(this.internalValue as U)));
    }

    constructor(private propertyPrefix: string, private parseFn?: (input: T) => U, private deparseFn?: (input: U) => T) {
        engine.off(this.propertyPrefix + "->");
        this.reactivate();
    }

    async set(newValue: U) {
        engine.call(this.propertyPrefix + "!", this.deparseFn?.(newValue) ?? newValue);
    }

    dispose() {
        engine.off(this.propertyPrefix + "->", this.onUpdate);
        this.subscriptions = []
    }
    reactivate() {
        this.subscriptions = []
        engine.call(this.propertyPrefix + "?").then((x) => this.setInternalValue(x)).catch((y)=>console.warn(`ERR: ${this.propertyPrefix}\n${y}`));
        engine.off(this.propertyPrefix + "->", this.onUpdate);
        engine.on(this.propertyPrefix + "->", this.onUpdate, this);
    }

    subscribe(fn: (x: U) => Promise<any>) {
        this.subscriptions.push(fn);
    }

}
