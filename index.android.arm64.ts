import {DxcAgent} from "./src/DxcAgent";
import * as InterruptorLib from "../interruptor/index.linux.arm64"

// To create a Dexcalibur's agent with arm64 syscall hooking ability
export  const newDxcAgent = (function( pOptions:any){
    return new DxcAgent(InterruptorLib.target.LinuxArm64(pOptions));
});