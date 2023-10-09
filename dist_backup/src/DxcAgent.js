import { DxcUtils } from "./DxcUtils.js";
import { NodeInternalType } from "./core/NodeInternalType.js";
import { CoreClassLoader } from "./core/CoreClassLoader.js";
import { DxcFactory } from "./DxcFactory.js";
import { ADAPTER } from "./core/const.js";
import { DxcJavaAgent } from "./techs/java/DxcJavaAgent.js";
import { DxcObjcAgent } from "./techs/objc/DxcObjcAgent.js";
export class DxcAgent {
    constructor(pTracerFactory) {
        this._factory = null;
        this._java = null;
        this._objc = null;
        this.tracers = [];
        this.hooks = {};
        this.callbacks = {};
        this.classLoader = {};
        this.modifier = {};
        this.mods = {};
        this.NODE = NodeInternalType;
        this.util = new DxcUtils();
        this.adapters = {};
        this.tracerFactory = pTracerFactory;
        this.classLoader = new CoreClassLoader();
        this._factory = new DxcFactory(this);
    }
    java() {
        if (this.adapters[ADAPTER.JAVA] == null) {
            this.adapters[ADAPTER.JAVA] = new DxcJavaAgent(this);
        }
        return this.adapters[ADAPTER.JAVA];
    }
    objc() {
        if (this.adapters[ADAPTER.OBJC] == null) {
            this.adapters[ADAPTER.OBJC] = new DxcObjcAgent(this);
        }
        return this.adapters[ADAPTER.OBJC];
    }
    newSyscallTracer(pOptions) {
        if (this.tracerFactory == null) {
            throw new Error("[DXC] Interruptor is not available");
        }
        const t = this.tracerFactory.newAgentTracer(pOptions);
        this.tracers.push(t);
        return t;
    }
    onDlOpenOf(pFilePattern, pHook) {
        this._factory.dl_open.push({ path: pFilePattern, cb: pHook });
    }
    onSyscall(pSyscall, pCondition, pCallback) {
        if (pCondition.module != null) {
        }
        if (pCondition.module != null) {
        }
    }
    beforeAppStart(pCallback) {
        this._factory._early.push(pCallback);
    }
    onAppStarted(pCallback) {
        this._factory._run.push(pCallback);
    }
    start() {
        this._factory.load();
    }
    send(pHookId, pFragmentId, pInfo) {
        send({
            hid: pHookId,
            fid: pFragmentId,
            data: pInfo
        });
    }
    startInteractiveSession() {
        send({
            type: "interactiv_new",
            data: {
                session: null
            }
        });
    }
}
