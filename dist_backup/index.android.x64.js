import { DxcAgent } from "./src/DxcAgent.js";
import * as InterruptorLib from "@reversense/interruptor/index.linux.x64.js";
export const newDxcAgent = (function (pOptions) {
    return new DxcAgent(InterruptorLib.default.LinuxX64.call(null, pOptions));
});
