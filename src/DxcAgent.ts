import {DxcUtils} from "./DxcUtils.js";
import {NodeInternalType} from "./core/NodeInternalType.js";
import {CoreClassLoader} from "./core/CoreClassLoader.js";
import {DxcFactory} from "./DxcFactory.js";
import {SyscallCondition} from "./core/SyscallCondition.js";
import {ADAPTER, IAdapterAgent} from "./core/const.js";
import {DxcJavaAgent} from "./techs/java/DxcJavaAgent.js";
import {DxcObjcAgent} from "./techs/objc/DxcObjcAgent.js";
import {DxcKeyPointHandler} from "./core/DxcKeyPointHandler";

export interface SystemCallHookOptions {
    file?:RegExp|string;
    args?:any;
    ret:any;
}

export interface TracedModule {
    [syscallName:string] :SystemCallHookOptions
}

interface AdapterMap {
    [adapterName:string] :IAdapterAgent;
}

export enum BUS_EVENT {
    VIEW_HIERARCHY = "agent.ui.view_hierarchy",
}

export enum TECH_TYPE {
    JAVA= "java",
}

/**
 *
 * @class
 */
export class DxcAgent {

    private _factory:DxcFactory = null;

    private _java:DxcAgent|null = null;
    private _objc:DxcAgent|null = null;

    tracerFactory:any;
    tracers:any[] = [];
    hooks:any = {};
    callbacks:any = {};
    classLoader:any = {};
    modifier:any = {};
    mods:any = {};
    kp:DxcKeyPointHandler;


    NODE:any = NodeInternalType;

    utils:DxcUtils = new DxcUtils();
    //__java:DxcJava = new DxcJava();

    adapters:AdapterMap = {

    }

    constructor( pTracerFactory:any) {
        this.tracerFactory = pTracerFactory;
        this.classLoader = new CoreClassLoader();
        this.kp = new DxcKeyPointHandler(this);
        this._factory = new DxcFactory(this);
    }

    /**
     * To get Java Dexcalibur API
     *
     * @return {DxcObjcAgent}
     * @method
     */
    get java():DxcJavaAgent {
        if(this.adapters[ADAPTER.JAVA]==null){
            this.adapters[ADAPTER.JAVA] = new DxcJavaAgent(this);
        }

        return this.adapters[ADAPTER.JAVA] as DxcJavaAgent;
    }

    /*
    react():DxcJavaAgent {
        if(this.adapters[ADAPTER.JAVA]==null){
            this.adapters[ADAPTER.JAVA] = new DxcJavaAgent(this);
        }

        return this.adapters[ADAPTER.JAVA] as DxcJavaAgent;
    }


    /**
     * To get Objective-C Dexcalibur API
     *
     * @return {DxcObjcAgent}
     * @method
     */
    objc():DxcObjcAgent {
        if(this.adapters[ADAPTER.OBJC]==null){
            this.adapters[ADAPTER.OBJC] = new DxcObjcAgent(this);
        }

        return this.adapters[ADAPTER.OBJC] as DxcObjcAgent;
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
     * DlOpen key point
     * @param pFilePattern
     * @param pHook
     */
    onDlOpenOf( pFilePattern:RegExp, pHook: any){
        this._factory.dl_open.push( { path:pFilePattern, cb:pHook });
    }


    onSyscall( pSyscall:string, pCondition:SyscallCondition, pCallback:any){


        //this._factory.dl_open.push( { path:pFilePattern, cb:pHook });

        if(pCondition.module!=null){

        }

        if(pCondition.module!=null){

        }
        //if(this.isModuleTraced(pModule)){

        //}
    }

    beforeAppStart( pCallback:any):void {
        this._factory._early.push(pCallback);
    }

    /**
     * To add a function / code block called inside
     *
     * Android App : from Java.perform()
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
        });
    }


    /**
     * To push an event into the host bus.
     *
     * @param {string} evt The name of the event to be sent
     * @param {any} data The data to be sent
     * @method
     */
    push(evt:BUS_EVENT, data:any){
        send({
            evt: evt,
            data: data
        });
    }

    /**
     * To send an error message when a hook cannot be
     *  loaded.
     *
     * @param {string} pErrCode Error code must be upper than 0, to be caught
     * @param {string} pHookId Hook ID
     * @param {any} pInfo Data
     * @method
     */
    sendDefinitionError( pErrCode:number, pHookId:string, pMsg:any){
        send({
            err: pErrCode,
            hid: pHookId,
            data: pMsg
        });
    }

    /**
     * To send an error message when a fragment cannot be
     *  satisfied.
     *
     * @param {string} pErrCode Error code must be negative and lower than 0, to be caught as fragment error
     * @param {string} pHookId Hook ID
     * @param {string} pFragmentId Fragment ID
     * @param {any} pInfo Data
     * @method
     */
    sendFragmentError( pErrCode:number, pHookId:string, pFragmentId:string, pMsg:any){
        send({
            err: pErrCode,
            hid: pHookId,
            fid: pFragmentId,
            data: pMsg
        });
    }

    /**
     * To create a kind of interactive terminal to
     * explore the application context interactively
     *
     * @method
     */
    startInteractiveSession(){
        send({
            type: "interactiv_new",
            data: {
                session:null
            }
        })
    }

    httpReq(pHookId:string, pFragmentId:string, pVerb:string, pUrl:string, pHeader:any[] = [], pBody:any = null){
        send({
            hid: pHookId,
            fid: pFragmentId,
            type: "http_req",
            data: {
                verb: pVerb,
                url: pUrl,
                header: pHeader,
                body: pBody
            }
        });
    }
}