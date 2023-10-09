export declare class CoreClassLoader {
    cl: any;
    tech: string;
    constructor();
    refresh(): void;
    get path(): any;
    get boot(): any;
    add(pName: string, pCLassLoader: any): void;
    appCL(pName: string): any;
}
