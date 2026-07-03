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
import {DxcAgent} from "./DxcAgent.js";


/**
 *
 * @class
 */
export class DxcFactory {


    _early:any[] = [];
    _run:any[] = [];

    dl_open:any = [];
    read:any = [];
    modifiers:any = [];
    defines:any = {
        classes: [],
        field: [],
        method: [],
    };
    accessFlags:any = [];

    private _agent:DxcAgent;

    constructor( pAgent:any) {
        this._agent = pAgent;
    }

    /**
     * To call a function if the path from dlopen matched a particular pattern
     *
     * @private
     */
    private _hookDlOpen(){
        Interceptor.attach(
            Module.findExportByName('libdl.so', 'dlopen'),
            {
                onEnter: function(args){
                    const lib = args[0].readUtf8String();
                    this.dl_open.map( (pOpt:any)=>{
                        if(pOpt.path.test(lib)){
                            (pOpt.cb)(this, args, lib);
                        }
                    })
                }
            }
        )
    }

    /**
     * To hook defineClass() from every class loaders
     *
     * @private
     */
    private _hookClassDefine(){
        let CL = null;
        for(const k in this._agent.classLoader){
            CL = this._agent.classLoader[k];
            CL.defineClass.overload();
        }
    }

    /**
     * To load everything
     */
    load(){
        return;

        if(this.dl_open.length > 0) this._hookDlOpen();
        if(this.defines.classes.length > 0) this._hookClassDefine();
        //if(this.defines.method.length > 0) this._hookMethodDefine();
        //if(this.defines.field.length > 0) this._hookFieldDefine();
        //if(this.modifiers.length > 0)


        if(this._early.length > 0){
            Java.performNow(()=>{
                this._early.map( x => {
                    x.call( null, this );
                })
            });
        }

        Java.perform(()=>{
            this._agent.classLoader.refresh();

            this._run.map( x => {
                x.call( null, this );
            });
        });
    }
}