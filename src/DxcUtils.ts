/*
 *
 *     Reversense platform / dexcalibur-agent :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import Java from "frida-java-bridge"

export class DxcUtils {

    private  _class=null;

    constructor(){
        if(typeof Java !== "undefined"){
            this._class = Java.use("java.lang.Class");
        }
    }

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