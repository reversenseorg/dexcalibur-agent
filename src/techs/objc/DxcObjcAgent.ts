import { IOopAgent } from "../../core/IOopAgent.js";
import {DxcAgent} from "../../DxcAgent.js";
import {STEP} from "../../core/const.js";


export class DxcObjcAgent implements IOopAgent {

    private _parent:DxcAgent;

    modifiers:any = [];
    defines:any = {
        classes: [],
        field: [],
        method: [],
    };

    constructor(pParent:DxcAgent) {
        this._parent = pParent;
    }


    onClassDefine( pStep:STEP, pClass:string, pCallback:any){

    }

    onFieldDefine( pStep:STEP, pClass:string, pCallback:any){

    }

    onMethodDefine( pStep:STEP, pMethod:any, pCallback:any){

    }

    onModifierChange( pStep:STEP, pField:any, pCallback:any){

    }

    load(){

    }
}