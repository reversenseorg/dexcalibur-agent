export class CoreClassLoader {
    constructor() {
        this.cl = {};
        this.refresh();
    }
    refresh() {
        Java.enumerateClassLoadersSync().map((x) => {
            const fqcn = x.getClass().getCanonicalName();
            console.log('ClassLoader: ' + fqcn);
            if (this.cl[fqcn] != null) {
                this.cl[fqcn] = x;
            }
        });
    }
    get path() {
        return this.cl["dalvik.system.PathClassLoader"];
    }
    get boot() {
        return this.cl["java.lang.BootClassLoader"];
    }
    add(pName, pCLassLoader) {
        this.cl[pName] = pCLassLoader;
    }
    appCL(pName) {
        return this.cl[pName];
    }
}
