import { DxcUtils } from "./DxcUtils.js";
import { SyscallCondition } from "./core/SyscallCondition.js";
import { IAdapterAgent } from "./core/const.js";
import { DxcJavaAgent } from "./techs/java/DxcJavaAgent.js";
import { DxcObjcAgent } from "./techs/objc/DxcObjcAgent.js";
export interface SystemCallHookOptions {
    file?: RegExp | string;
    args?: any;
    ret: any;
}
export interface TracedModule {
    [syscallName: string]: SystemCallHookOptions;
}
interface AdapterMap {
    [adapterName: string]: IAdapterAgent;
}
export declare class DxcAgent {
    private _factory;
    private _java;
    private _objc;
    tracerFactory: any;
    tracers: any[];
    hooks: any;
    callbacks: any;
    classLoader: any;
    modifier: any;
    mods: any;
    NODE: any;
    util: DxcUtils;
    adapters: AdapterMap;
    constructor(pTracerFactory: any);
    java(): DxcJavaAgent;
    objc(): DxcObjcAgent;
    newSyscallTracer(pOptions: any): any;
    onDlOpenOf(pFilePattern: RegExp, pHook: any): void;
    onSyscall(pSyscall: string, pCondition: SyscallCondition, pCallback: any): void;
    beforeAppStart(pCallback: any): void;
    onAppStarted(pCallback: any): void;
    start(): void;
    send(pHookId: string, pFragmentId: string, pInfo: any): void;
    startInteractiveSession(): void;
}
export {};
