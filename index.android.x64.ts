import {DxcAgent} from "./src/DxcAgent";
import * as InterruptorLib from "@reversense/interruptor/index.linux.x64"

// To create a Dexcalibur's agent with x64 syscall hooking ability
export  const newDxcAgent = (function( pOptions:any){
    return new DxcAgent(InterruptorLib.target.LinuxX64(pOptions));
});