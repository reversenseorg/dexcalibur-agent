import { IOopAgent } from "../../core/IOopAgent";
import {DxcAgent} from "../../DxcAgent";
import {STEP} from "../../core/const";


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
        if(this.defines.classes.length > 0)
            this._hookClassDefine();
        //if(this.defines.method.length > 0) this._hookMethodDefine();
        //if(this.defines.field.length > 0) this._hookFieldDefine();
        //if(this.modifiers.length > 0)


        if(this._early.length > 0){
            Java.performNow(()=>{
                this._early.map( x => {
                    x.call( null, this );
                })
            });
        }

        Java.perform(()=>{
            this._agent.classLoader.refresh();

            this._run.map( x => {
                x.call( null, this );
            });
        });
    }
}