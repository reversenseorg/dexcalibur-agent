import {DxcAgent} from "./src/DxcAgent.js";

// To create a Dexcalibur's agent without syscall hooking ability
export  const newDxcAgent = (function( pOptions:any = {}){
    return new DxcAgent(null);
});