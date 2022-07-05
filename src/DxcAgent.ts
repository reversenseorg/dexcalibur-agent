import {target} from "../../interruptor/index"

/**
 *
 * @class
 */
export class DxcAgent {

    tracerFactory:any;
    tracers:any[] = [];
    hooks:any = {};
    callbacks:any = {};


    constructor( pTracerFactory:any) {
        this.tracerFactory = pTracerFactory;
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
        if(!this.hooks.dl_open){
            this.callbacks.dl_open = [];
            Interceptor.attach(
                Module.findExportByName('libdl.so', 'dlopen'),
                {
                    onEnter: function(args){
                        const lib = args[0].readUtf8String();
                        this.callbacks.dl_open.map( (pOpt:any)=>{
                            if(pOpt.pattern.test(lib)){
                                (pOpt.cb)(this, args, lib);
                            }
                        })
                    }
                }
            )
        }


        this.callbacks.dl_open.push({
            pattern: pFilePattern,
            cb: pHook
        });

    }


    onSyscall( pSyscall:string, pCondition:any, pCallback:any){
        //if(this.isModuleTraced(pModule)){

        //}
    }

    start():void{
        this.tracers.map( x => {

        })
    }

    send( pHookId:string, pInfo:any){
        pInfo.id = pHookId;
        send()
    }
}