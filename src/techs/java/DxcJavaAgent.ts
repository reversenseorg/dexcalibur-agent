import {STEP} from "../../core/const.js";
import {IOopAgent} from "../../core/IOopAgent.js";
import {DxcAgent} from "../../DxcAgent.js";
import {CoreClassLoader} from "../../core/CoreClassLoader.js";


export class DxcJavaAgent implements IOopAgent {

    private _parent:DxcAgent;

    private _early:any = [];

    modifiers:any = [];
    defines:any = {
        classes: [],
        field: [],
        method: [],
    };
    accessFlags:any = [];

    classLoader = new CoreClassLoader();

    constructor(pParent:DxcAgent) {
        this._parent = pParent;
    }

    private _hookClassDefine(){

    }

    private _hookMethodDefine(){

    }

    updateIsolatedProcess( pAppComponentFactoryFQCN:string){

    }

    onClassDefine( pStep:STEP, pClass:string, pCallback:any){
        switch ( pStep){
            case STEP.EARLY:
                this._early.push(()=>{

                });
                break;
            case STEP.RUNTIME:
                break;
            case STEP.DELAY:
                break;
        }
        //this._factory.defines.classes.push( { fqcn:pClass, cb:pCallback });
    }

    onFieldDefine( pStep:STEP, pClass:string, pCallback:any){

    }

    onMethodDefine( pStep:STEP, pMethod:any, pCallback:any){

    }

    onModifierChange( pStep:STEP, pField:any, pCallback:any){

    }

    // Method.invoke + invoke-*
    onCall( pStep:STEP, pField:any, pCallback:any){

    }

    /**
     * To get the class loader associated to a file or a buffer
     *
     * @param pFile
     */
    loaderOf(pFile:string):any{
        const cl = Java.enumerateClassLoadersSync();
        for(let i=0; i<cl.length; i++){
            // if(cl)
        }

        return null;
    }

    use(pFQCN:string):any{
        return null;
    }


    getClassLoaderOf():any {
        Java.enumerateClassLoadersSync().map( vLoader => {
            //if(loader)
        });
    }

    getDefaultClassLoader():any{
        return null;
    }

    /**
     * To call hook wrapper from early stage
     * @method
     */
    earlyLoad(){
        if(this._early.length > 0){
            Java.performNow(()=>{
                this._early.map( x => {
                    x.call( null, this );
                })
            });
        }
    }

    load(){
        if(this.defines.classes.length > 0)
            this._hookClassDefine();
        //if(this.defines.method.length > 0) this._hookMethodDefine();
        //if(this.defines.field.length > 0) this._hookFieldDefine();
        //if(this.modifiers.length > 0)


        this.earlyLoad();

        Java.perform(()=>{
            /*this.refreshClassLoader();

            this._run.map( x => {
                x.call( null, this );
            });*/
        });
    }
}