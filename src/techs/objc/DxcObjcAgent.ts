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

import { IOopAgent } from "../../core/IOopAgent.js";
import {DxcAgent} from "../../DxcAgent.js";
import {STEP} from "../../core/const.js";


export class DxcObjcAgent implements IOopAgent {

    private _parent:DxcAgent;

    modifiers:any = [];
    defines:any = {
        classes: [],
        field: [],
        method: [],
    };

    constructor(pParent:DxcAgent) {
        this._parent = pParent;
    }


    onClassDefine( pStep:STEP, pClass:string, pCallback:any){

    }

    onFieldDefine( pStep:STEP, pClass:string, pCallback:any){

    }

    onMethodDefine( pStep:STEP, pMethod:any, pCallback:any){

    }

    onModifierChange( pStep:STEP, pField:any, pCallback:any){

    }

    load(){

    }
}