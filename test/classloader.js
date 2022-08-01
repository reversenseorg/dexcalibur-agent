Java.deoptimizeEverything();

const DXC = require('../dist/dxc-agent.android.arm64.min.js').newDxcAgent({

});

DXC.onAppStarted((vAgent)=>{
    console.log("App started ")
});

DXC.beforeAppStart(()=>{
    //DXC.classLoader.refresh();

    console.log(DXC.classLoader.path());

    const ad = DXC.classLoader.path.use('a.d');
    const newInstance = ad.newInstance.overload('java.lang.String')
    newInstance.implementation = function(arg0){
        console.log(arg0)
        return newInstance.call(null, arg0);
    }
    DXC.onClassDefine( 'a.d', ()=>{
        console.log("Class a.d defined  ! ")
    });
    DXC.onClassDefine( 'sg.vantagepoint.uncrackable2.MainActivity', ()=>{
        console.log("Class MainActivity defined  ! ")
    });
    console.log("Before app start ")
})


DXC.start();
/*
DXC.newSyscallTracer({
    followThread: false,
    exclude : {
        syscall: [/clock_gettime/]
    }
}).start();*/
