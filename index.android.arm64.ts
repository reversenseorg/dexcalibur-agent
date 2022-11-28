import {DxcAgent} from "./src/DxcAgent.js";
import * as Interruptor from "@reversense/interruptor/index.linux.arm64.js"

// To create a Dexcalibur's agent with arm64 syscall hooking ability
export  const newDxcAgent = (function( pOptions:any){
    return new DxcAgent(Interruptor.default.LinuxArm64.call(null, pOptions));
    //return new DxcAgent(Interruptor.target.LinuxArm64(pOptions));
});