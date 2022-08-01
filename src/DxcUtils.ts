export class DxcUtils {

    private  _class = Java.use("java.lang.Class");

    c2s(pCharArr:any[]){
        const char:any[] = Java.array("char",pCharArr);
        let str="";
        for(let i=0; i <pCharArr.length; i++)
            str += String.fromCharCode(pCharArr[i]);

        return str;
    }

    isInstanceOf(raw_ref:any, fqcn:any):boolean{
        if(raw_ref == null) return false;

        if(typeof raw_ref != "string"){
            let cls = Java.cast(raw_ref.getClass(), this._class);
            return (cls.getCanonicalName()==fqcn);
        }else{
            return ("java.lang.String"==fqcn);
        }
    }
}