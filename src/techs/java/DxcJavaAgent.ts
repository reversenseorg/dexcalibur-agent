import Java from "frida-java-bridge"
import {STEP} from "../../core/const.js";
import {IOopAgent} from "../../core/IOopAgent.js";
import {DxcAgent} from "../../DxcAgent.js";
import {CoreClassLoader} from "../../core/CoreClassLoader.js";
import {DxcJava} from "./DxcJava.js";
import {DxcJavaUI} from "./DxcJavaUI.js";


export class DxcJavaAgent implements IOopAgent {

    private _parent:DxcAgent;
    private _javaAPI:DxcJava;
    private _javaUI_API:DxcJavaUI;
    private _early:any = [];

    modifiers:any = [];
    defines:any = {
        classes: [],
        field: [],
        method: [],
    };
    accessFlags:any = [];

    class:any;

    classLoader = new CoreClassLoader();

    constructor(pParent:DxcAgent) {
        this._parent = pParent;
        this._javaAPI = new DxcJava();
        this._javaUI_API = new DxcJavaUI(this._parent, this._javaAPI);
        this.class = this._javaAPI.class;
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





    printStackTrace() {
       return this._javaAPI.printStackTrace();
    }

    /**
     * To read a file using Java FileInputStream
     *
     * @param pInputFile
     */
    readFile(pInputFile){
        return this._javaAPI.readFile(pInputFile);
    }

    getStackTrace() {
        return this._javaAPI.getStackTrace();
    }

    getSignature(pClass:any):string{
        return this._javaAPI.getSignature(pClass);
    }

    /**
     * Cast as an array of object of <pClass>
     *
     * @param pClass
     * @param pArr
     */
    castArray( pClass:any, pArr:any):any{
        return this._javaAPI.castArray(pClass,pArr);
    }

    /**
     * To generate method signature compliant with Dexcalibur format
     *
     * @param {any} pMethod Instance of java.lang.Method class
     * @param {any} pArgTypes Array of instance of java.lang.Class class
     * @return {string} The method signature
     * @method
     */
    getMethodSignature( pMethod:any, pArgTypes:any):string{
        return this._javaAPI.getMethodSignature(pMethod,pArgTypes);
    }

    get ui(): DxcJavaUI {
        return this._javaUI_API;
    }
}