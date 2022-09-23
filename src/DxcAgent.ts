import {DxcJava} from "./DxcJava";
import {DxcUtils} from "./DxcUtils";
import {NodeInternalType} from "./core/NodeInternalType";
import {CoreClassLoader} from "./core/CoreClassLoader";
import {DxcFactory} from "./DxcFactory";


/**
 *
 * @class
 */
export class DxcAgent {

    private _factory:DxcFactory = null;

    tracerFactory:any;
    tracers:any[] = [];
    hooks:any = {};
    callbacks:any = {};
    classLoader:any = {};
    modifier:any = {};


    NODE:any = NodeInternalType;

    util:DxcUtils = new DxcUtils();
    java:DxcJava = new DxcJava();


    constructor( pTracerFactory:any) {
        this.tracerFactory = pTracerFactory;
        this.classLoader = new CoreClassLoader();
        this._factory = new DxcFactory(this);
    }


    /**
     * To create and configure a new syscall tracer, but not load it
     *
     * @param pOptions
     * @method
     */
    newSyscallTracer( pOptions:any):any{
        if(this.tracerFactory==null){
            throw new Error("[DXC] Interruptor is not available");
        }

        const t = this.tracerFactory.newAgentTracer(pOptions);
        this.tracers.push(t);
        return t;
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
     * DlOpen key point
     * @param pFilePattern
     * @param pHook
     */
    onDlOpenOf( pFilePattern:RegExp, pHook: any){
        this._factory.dl_open.push( { path:pFilePattern, cb:pHook });
    }

    onClassDefine( pClass:string, pCallback:any){
        this._factory.defines.classes.push( { fqcn:pClass, cb:pCallback });
    }

    onFieldDefine( pClass:string, pCallback:any){

    }

    onMethodDefine( pMethod:any, pCallback:any){

    }

    onModifierChange( pField:any, pCallback:any){

    }

    onSyscall( pSyscall:string, pCondition:any, pCallback:any){
        //if(this.isModuleTraced(pModule)){

        //}
    }

    beforeAppStart( pCallback:any):void {
        this._factory._early.push(pCallback);
    }

    /**
     * To add a function / code block called inside Java.perform()
     *
     * @param pCallback
     */
    onAppStarted( pCallback:any):void {
        this._factory._run.push(pCallback);
    }

    start():void{
        this._factory.load();

    }

    /**
     * To send a message to the host script
     *
     * @param {string} pHookId Hook ID
     * @param {string} pFragmentId Fragment ID
     * @param {any} pInfo Data
     * @method
     */
    send( pHookId:string, pFragmentId:string, pInfo:any){
        send({
            hid: pHookId,
            fid: pFragmentId,
            data: pInfo
        })
    }
}