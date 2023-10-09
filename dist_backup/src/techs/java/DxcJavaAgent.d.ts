import { STEP } from "../../core/const.js";
import { IOopAgent } from "../../core/IOopAgent.js";
import { DxcAgent } from "../../DxcAgent.js";
import { CoreClassLoader } from "../../core/CoreClassLoader.js";
export declare class DxcJavaAgent implements IOopAgent {
    private _parent;
    private _early;
    modifiers: any;
    defines: any;
    accessFlags: any;
    classLoader: CoreClassLoader;
    constructor(pParent: DxcAgent);
    private _hookClassDefine;
    private _hookMethodDefine;
    updateIsolatedProcess(pAppComponentFactoryFQCN: string): void;
    onClassDefine(pStep: STEP, pClass: string, pCallback: any): void;
    onFieldDefine(pStep: STEP, pClass: string, pCallback: any): void;
    onMethodDefine(pStep: STEP, pMethod: any, pCallback: any): void;
    onModifierChange(pStep: STEP, pField: any, pCallback: any): void;
    onCall(pStep: STEP, pField: any, pCallback: any): void;
    loaderOf(pFile: string): any;
    use(pFQCN: string): any;
    getClassLoaderOf(): any;
    getDefaultClassLoader(): any;
    earlyLoad(): void;
    load(): void;
}
