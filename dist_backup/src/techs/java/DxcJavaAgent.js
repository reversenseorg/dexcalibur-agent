import { STEP } from "../../core/const.js";
import { CoreClassLoader } from "../../core/CoreClassLoader.js";
export class DxcJavaAgent {
    constructor(pParent) {
        this._early = [];
        this.modifiers = [];
        this.defines = {
            classes: [],
            field: [],
            method: [],
        };
        this.accessFlags = [];
        this.classLoader = new CoreClassLoader();
        this._parent = pParent;
    }
    _hookClassDefine() {
    }
    _hookMethodDefine() {
    }
    updateIsolatedProcess(pAppComponentFactoryFQCN) {
    }
    onClassDefine(pStep, pClass, pCallback) {
        switch (pStep) {
            case STEP.EARLY:
                this._early.push(() => {
                });
                break;
            case STEP.RUNTIME:
                break;
            case STEP.DELAY:
                break;
        }
    }
    onFieldDefine(pStep, pClass, pCallback) {
    }
    onMethodDefine(pStep, pMethod, pCallback) {
    }
    onModifierChange(pStep, pField, pCallback) {
    }
    onCall(pStep, pField, pCallback) {
    }
    loaderOf(pFile) {
        const cl = Java.enumerateClassLoadersSync();
        for (let i = 0; i < cl.length; i++) {
        }
        return null;
    }
    use(pFQCN) {
        return null;
    }
    getClassLoaderOf() {
        Java.enumerateClassLoadersSync().map(vLoader => {
        });
    }
    getDefaultClassLoader() {
        return null;
    }
    earlyLoad() {
        if (this._early.length > 0) {
            Java.performNow(() => {
                this._early.map(x => {
                    x.call(null, this);
                });
            });
        }
    }
    load() {
        if (this.defines.classes.length > 0)
            this._hookClassDefine();
        this.earlyLoad();
        Java.perform(() => {
        });
    }
}
