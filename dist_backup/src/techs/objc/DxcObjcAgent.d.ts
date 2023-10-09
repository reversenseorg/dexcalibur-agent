import { IOopAgent } from "../../core/IOopAgent.js";
import { DxcAgent } from "../../DxcAgent.js";
import { STEP } from "../../core/const.js";
export declare class DxcObjcAgent implements IOopAgent {
    private _parent;
    modifiers: any;
    defines: any;
    constructor(pParent: DxcAgent);
    onClassDefine(pStep: STEP, pClass: string, pCallback: any): void;
    onFieldDefine(pStep: STEP, pClass: string, pCallback: any): void;
    onMethodDefine(pStep: STEP, pMethod: any, pCallback: any): void;
    onModifierChange(pStep: STEP, pField: any, pCallback: any): void;
    load(): void;
}
