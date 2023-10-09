export declare class DxcFactory {
    _early: any[];
    _run: any[];
    dl_open: any;
    read: any;
    modifiers: any;
    defines: any;
    accessFlags: any;
    private _agent;
    constructor(pAgent: any);
    private _hookDlOpen;
    private _hookClassDefine;
    load(): void;
}
