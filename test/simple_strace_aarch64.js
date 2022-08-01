var DXC = require('../dist/dxc-agent.android.arm64.min.js').newDxcAgent({

});

DXC.newSyscallTracer({
    followThread: false,
    exclude : {
        syscall: [/clock_gettime/]
    }
}).start();
