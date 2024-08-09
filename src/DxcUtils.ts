export class DxcUtils {

    private  _class = Java.use("java.lang.Class");

    c2s(pCharArr:any[]){
        const char:any[] = Java.array("char",pCharArr);
        let str="";
        for(let i=0; i <pCharArr.length; i++)
            str += String.fromCharCode(pCharArr[i]);

        return str;
    }

    isInstanceOf(raw_ref:any, fqcn:any) {
        if (raw_ref == null)
            return false;
        switch(typeof raw_ref){
            case "string":
                return ("java.lang.String" === fqcn);
            default:
                if (typeof raw_ref.getClass === 'function') {
                    let cls = Java.cast(raw_ref.getClass(), Java.use("java.lang.Class"));
                    return (cls.getCanonicalName() === fqcn);
                } else {
                    // TODO: Check if other type are needed. if raw_ref is boolean or number
                    return false
                }
        }
    }
}