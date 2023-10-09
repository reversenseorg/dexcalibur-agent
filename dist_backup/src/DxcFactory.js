export class DxcFactory {
    constructor(pAgent) {
        this._early = [];
        this._run = [];
        this.dl_open = [];
        this.read = [];
        this.modifiers = [];
        this.defines = {
            classes: [],
            field: [],
            method: [],
        };
        this.accessFlags = [];
        this._agent = pAgent;
    }
    _hookDlOpen() {
        Interceptor.attach(Module.findExportByName('libdl.so', 'dlopen'), {
            onEnter: function (args) {
                const lib = args[0].readUtf8String();
                this.dl_open.map((pOpt) => {
                    if (pOpt.path.test(lib)) {
                        (pOpt.cb)(this, args, lib);
                    }
                });
            }
        });
    }
    _hookClassDefine() {
        let CL = null;
        for (const k in this._agent.classLoader) {
            CL = this._agent.classLoader[k];
            CL.defineClass.overload();
        }
    }
    load() {
        if (this.dl_open.length > 0)
            this._hookDlOpen();
        if (this.defines.classes.length > 0)
            this._hookClassDefine();
        if (this._early.length > 0) {
            Java.performNow(() => {
                this._early.map(x => {
                    x.call(null, this);
                });
            });
        }
        Java.perform(() => {
            this._agent.classLoader.refresh();
            this._run.map(x => {
                x.call(null, this);
            });
        });
    }
}
