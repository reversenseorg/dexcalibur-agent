export enum STEP {
    EARLY,
    RUNTIME,
    DELAY
}

export enum ADAPTER {
    JAVA="java",
    OBJC="objc",
    NATIVE="native",
    FLUTTER="flutter",
    REACT="react"
}

export interface IAdapterAgent {}