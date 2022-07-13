export class DxcUtils {

    c2s(pCharArr:any[]){
        const char:any[] = Java.array("char",pCharArr);
        let str="";
        for(let i=0; i <pCharArr.length; i++)
            str += String.fromCharCode(pCharArr[i]);

        return str;
    }
}