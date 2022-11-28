import {DxcAgent} from "./src/DxcAgent.js";
import * as InterruptorLib from "@reversense/interruptor/index.linux.x64.js"

// To create a Dexcalibur's agent with x64 syscall hooking ability
export  const newDxcAgent = (function( pOptions:any){
    return new DxcAgent(InterruptorLib.default.LinuxX64.call(null,pOptions));
});