export class DxcObjcAgent {
    constructor(pParent) {
        this.modifiers = [];
        this.defines = {
            classes: [],
            field: [],
            method: [],
        };
        this._parent = pParent;
    }
    onClassDefine(pStep, pClass, pCallback) {
    }
    onFieldDefine(pStep, pClass, pCallback) {
    }
    onMethodDefine(pStep, pMethod, pCallback) {
    }
    onModifierChange(pStep, pField, pCallback) {
    }
    load() {
    }
}
