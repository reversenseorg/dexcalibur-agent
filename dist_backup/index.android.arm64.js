import { DxcAgent } from "./src/DxcAgent.js";
import * as Interruptor from "@reversense/interruptor/index.linux.arm64.js";
export const newDxcAgent = (function (pOptions) {
    return new DxcAgent(Interruptor.default.LinuxArm64.call(null, pOptions));
});
