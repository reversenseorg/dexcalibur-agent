

export class CoreClassLoader {

    cl:any = {};

    constructor() {
        this.refresh();
    }

    refresh(){
        Java.enumerateClassLoadersSync().map( (x)=>{
            const fqcn = x.getClass().getCanonicalName();
            console.log('ClassLoader: '+fqcn);
            if(this.cl[fqcn]!=null){
                this.cl[fqcn] = x;
            }
        });
    }

    get path():any{
        return this.cl["dalvik.system.PathClassLoader"];
    }

    get boot():any{
        return this.cl["java.lang.BootClassLoader"];
    }

    add( pName:string, pCLassLoader:any):void {
        this.cl[pName] = pCLassLoader;
    }

    appCL( pName:string){
        return this.cl[pName];
    }
}