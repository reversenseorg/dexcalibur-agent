import {DxcAgent} from "../DxcAgent";

export type KpHandler = ((vArgs:any,vCtx:KpCtx)=>void);

interface KpState {
    name: string, //lib
    uid: string,
    enter?: boolean,
    params: any,
    hooks?: KpHandler[]
}

interface KpCtx {
    s:KpState[],
    ctx:any,
    _c:number // counter
}

export type KpName = string;
export type KpGroupName = string;

export class DxcKeyPointHandler {


    state:Record<KpGroupName, KpCtx> = {}

    lookup:Record<string, Record<any, any>> = {};

    a:DxcAgent;

    constructor(pCtx:DxcAgent){
        this.a = pCtx;
    }

    /**
     * To assign a hook load/unload to a kp
     * @param {KpGroupName} pType
     * @param pName
     * @param pFn
     */
    register(pType:KpGroupName, pName:KpName, pFn:(vCtx:any)=>void):void{
        if(this.state[pType] === undefined) this.state[pType] = { s:[], ctx:{}, _c:-1 };

        let kpState = this.state[pType].s.find( (v) => v.name===pName);
        if(kpState==null)
            this.state[pType].s.push({ name:pName, uid:null, params:null, hooks:[pFn] })
        else
            kpState.hooks.push(pFn);
    }

    unregister(pName:KpName,pOf=-1){
        if(pOf>-1){
            this.state[pName].s[pOf] = null;
        }else
            this.state[pName].s = [];
    }


    trigger(pName:KpName, pInfo:KpState){
        if(this.state[pName] != null){
            this.state[pName].s.map( (vKP) => {
                if(vKP.name===pInfo.name){
                    vKP.hooks.map( (vHook) => vHook(pInfo.params, this.state[pName]) );
                }
            });
        }
    }

    /**
     * Deploy lookup to trace dlopen() and map handle to lib name
     */
    _traceDlOpen(){
        const self = this;
        this.lookup.dlopen = {};

        Interceptor.attach(Module.findExportByName('libdl.so', 'dlopen'), {
            onEnter: function (args) {
                this.targetLib = args[0].readUtf8String();
            },
            onLeave: function (ret) {
                self.lookup.dlopen[ret.toInt32()] = this.targetLib;
            }
        });
    }

    // ----------------------

    DlOpen(pFile:string, pName:KpName = null):void {
        const kpn = pName || pFile;
        if(this.state.dlopen==null){
            this.state.dlopen = { s:[], ctx:{}, _c:-1};

            const self = this;

            Interceptor.attach(Module.findExportByName('libdl.so', 'dlopen'), {
                onEnter: function (args) {
                    const lib = args[0].readUtf8String();
                    const c = self.state.dlopen.s.find(s => s.uid===lib);
                    if(c!=null){
                        self.trigger("dlopen", {
                            ...c,
                            params: {
                               lib:lib,
                                ...args
                            }
                        });
                    }

                }
            });
        }

        let state = this.state.dlopen.s.find(x => x.name===kpn); // push({name:pLib, params: []});

        if(state==null) {
            this.state.dlopen.s.push({ name:kpn, uid:pFile, params: {}, hooks: [] });
        }
    }

    DlSym(pFile:string, pSymbol:string, pName:KpName = null):void {
        const kpn = pName || pFile;
        if(this.state.dlsym==null){
            this.state.dlsym = { s:[], ctx:{}, _c:-1};
            const self = this;

            if(this.lookup.dlopen==null){
                this._traceDlOpen();
            }

            Interceptor.attach(Module.findExportByName('libdl.so', 'dlsym'), {
                onEnter: function (args) {
                    const sym = args[1].readCString();
                    const handle = args[0];
                    const lib =self.lookup.dlopen[handle.toInt32()];

                    if(lib!=null){

                        const c = self.state.dlsym.s.find(s => s.uid===lib+"::"+sym);
                        if(c!=null){
                            self.trigger("dlsym", {
                                ...c,
                                params: {
                                    lib:lib,
                                    ...args
                                }
                            });
                        }
                    }

                }
            });
        }

        let state = this.state.dlsym.s.find(x => x.name===kpn); // push({name:pLib, params: []});

        if(state==null) {
            this.state.dlsym.s.push({ name:kpn, uid:pFile+"::"+pSymbol, params: {}, hooks: [] });
        }

    }

    DynLink(pFile:string, pName:KpName = null):void {

        const kpn = pName || pFile;
        const self = this;

        // add KP global state
        if(this.state.linker==null){
            this.state.linker = { s:[], ctx:{}, _c:-1};
            Process.findModuleByName('linker64').enumerateSymbols().forEach(sym => {
                if (sym.name.indexOf('do_dlopen') >= 0) {
                    this.state.linker.ctx.do_dlopen = sym.address;
                } else if (sym.name.indexOf('call_constructor') >= 0) {
                    this.state.linker.ctx.call_ctor = sym.address;
                } else if(sym.name.indexOf('__dl__ZN11ScopedTrace3EndEv') >= 0){
                    this.state.linker.ctx.scopedTrace = sym.address;
                }

                // hook
            });
        }

        let state = this.state.linker.s.find(x => x.name===kpn); // push({name:pLib, params: []});

        if(state==null) {
            this.state.linker.s.push({ name:kpn, uid:pFile, params: {}, hooks: [] });
        }
    }


    JniLoad(pFile:string, pName:KpName = null):void {

        const kpn = pName || pFile;
        const self = this;

        // add KP global state
        if(this.state.jniload==null){
            this.state.jniload = { s:[], ctx:{}, _c:-1};
        }

        let t = this.state.jniload.s.find(x => x.name===kpn); // push({name:pLib, params: []});

        if(t==null) {
            Interceptor.attach(
                Process.findModuleByName(pFile).findExportByName("JNI_Onload"),
                {
                    onEnter: function (args) {
                         // not optimized
                        self.trigger("jniload", {name: kpn, uid:pFile, enter: true, params: args });
                    },
                    onLeave: function (args) {
                        self.trigger("jniload", {name: kpn, uid:pFile, enter: false, params: args });
                    }
                }
            );
        }

        this.state.jniload.s.push({ name:kpn, uid:pFile, params: {}, hooks: [] });
    }

}