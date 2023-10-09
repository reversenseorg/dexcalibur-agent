import { IAdapterAgent, STEP } from "./const";
export interface IOopAgent extends IAdapterAgent {
    onClassDefine(pStep: STEP, pClass: string, pCallback: any): any;
    onFieldDefine(pStep: STEP, pClass: string, pCallback: any): any;
    onMethodDefine(pStep: STEP, pMethod: any, pCallback: any): any;
    onModifierChange(pStep: STEP, pField: any, pCallback: any): any;
}
