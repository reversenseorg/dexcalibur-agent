import Java from "frida-java-bridge"
export class DxcJava {

    class:any = {
        java: {
            lang:{
                Class: Java.use("java.lang.Class"),
                System: Java.use('java.lang.System'),
                String: Java.use('java.lang.String'),
                Runtime: Java.use('java.lang.Runtime'),
                Thread: Java.use('java.lang.Thread'),
                reflect: {
                    AccessibleObject:  Java.use('java.lang.reflect.AccessibleObject'),
                    AnnotatedElement:  Java.use('java.lang.reflect.AnnotatedElement'),
                    Array:  Java.use('java.lang.reflect.Array'),
                    Constructor:  Java.use('java.lang.reflect.Constructor'),
                    Field:  Java.use('java.lang.reflect.Field'),
                    GenericArrayType:  Java.use('java.lang.reflect.GenericArrayType'),
                    GenericDeclaration:  Java.use('java.lang.reflect.GenericDeclaration'),
                    GenericSignatureFormatError:  Java.use('java.lang.reflect.GenericSignatureFormatError'),
                    InvocationHandler:  Java.use('java.lang.reflect.InvocationHandler'),
                    InvocationTargetException:  Java.use('java.lang.reflect.InvocationTargetException'),
                    MalformedParameterizedTypeException:  Java.use('java.lang.reflect.MalformedParameterizedTypeException'),
                    Member:  Java.use('java.lang.reflect.Member'),
                    Method:  Java.use('java.lang.reflect.Method'),
                    Modifier:  Java.use('java.lang.reflect.Modifier'),
                    ParameterizedType:  Java.use('java.lang.reflect.ParameterizedType'),
                    Proxy:  Java.use('java.lang.reflect.Proxy'),
                    ReflectPermission:  Java.use('java.lang.reflect.ReflectPermission'),
                    Type:  Java.use('java.lang.reflect.Type'),
                    TypeVariable:  Java.use('java.lang.reflect.TypeVariable'),
                    UndeclaredThrowableException:  Java.use('java.lang.reflect.UndeclaredThrowableException'),
                    WildcardType:  Java.use('java.lang.reflect.WildcardType'),
                }
            },
            io: {
                File: Java.use("java.io.File"),
                FileInputStream: Java.use("java.io.FileInputStream"),
                FileOutputStream: Java.use("java.io.FileOutputStream")
            }
        },
        dalvik: {
            system: {
                VMStack: Java.use('dalvik.system.VMStack')
            }
        }
    };

    obj:any = {}

    constructor() {
    }


    printStackTrace() {
        const stack = Java.use("java.lang.Exception").$new().getStackTrace()
        let msg = "";
        // the two firsts stack trace elements are skipped
        for (let i = 2; i < stack.length; i++) {
            msg = msg + i + " => " + stack[i].toString()+"<br>&nbsp;&nbsp;";
        }
        return msg;
    }

    /**
     * To read a file using Java FileInputStream
     *
     * @param pInputFile
     */
    readFile(pInputFile){

        const fin = this.class.java.io.FileInputStream.$new(pInputFile);
        const content:any[] = [];
        let b=null;
        const jsBuffer = new Uint8Array(4096);
        const buffer = Java.array('byte', Array.from(jsBuffer)  );
        do{
            b=fin.read(buffer);
            if(b != -1) {
                //console.log("read " + b + " bytes, writing it into a JS array");
                for(let i =0; i < b; i++) {
                    content.push(buffer[i]);
                }
            }
        }while(b != -1);

        fin.close();
        console.log("Finished flatting array");
        return content;
    }

    getStackTrace() {
        const stack = Java.use("java.lang.Exception").$new().getStackTrace()
        const msg = [];
        // the two firsts stack trace elements are skipped
        for (let i = 2; i < stack.length; i++) {
            msg.push({
                cls: stack[i].getClassName(),
                meth: stack[i].getMethodName(),
                file: stack[i].getFileName(),
                line: stack[i].getLineNumber()
            });
        }
        return msg;
    }

    getSignature(pClass:any):string{
        return "<"+pClass.getName()+">";
    }

    /**
     * Cast as an array of object of <pClass>
     *
     * @param pClass
     * @param pArr
     */
    castArray( pClass:any, pArr:any):any{
        const ret:any[] = [];
        let i=0;
        let tmp=null;

        if(pArr == null) return null;

        while(null != (tmp = pArr[i])){
            ret.push( Java.cast( tmp, pClass));
            i++;
        }

        return ret;
    }

    /**
     * To generate method signature compliant with Dexcalibur format
     *
     * @param {any} pMethod Instance of java.lang.Method class
     * @param {any} pArgTypes Array of instance of java.lang.Class class
     * @return {string} The method signature
     * @method
     */
    getMethodSignature( pMethod:any, pArgTypes:any):string{
        let sign ="";

        const cls = Java.cast( pMethod.getDeclaringClass(), this.class.java.lang.Class);
        const args = this.castArray( this.class.java.lang.Class, pArgTypes); // method.getParameterTypes());
        const rett = Java.cast( pMethod.getReturnType(), this.class.java.lang.Class);

        sign += cls.getCanonicalName();
        sign += ".";
        sign += pMethod.getName();
        sign += "(";

        if(args!==null)
            for(let a=0; a<args.length; a++){
                sign += this.getSignature(args[a]);
                if(args[a].isArray()) sign += "[]";
            }

        sign += ")";

        sign += this.getSignature(rett);

        return sign;
    }
}


