import {BUS_EVENT, DxcAgent, TECH_TYPE} from "./DxcAgent.js";
import {UiJavaCmpData} from "./techs/java/DxcJavaUI.js";


export type UiCmpData = {header: string[], data:UiJavaCmpData[], type:TECH_TYPE};

export abstract class DxcUiAPI {

    private _ctx:DxcAgent;
    constructor(pDxcAgent:DxcAgent) {
        this._ctx = pDxcAgent;
    }

    sendView() {
        let viewHierarchy: UiCmpData = this.dumpView();
        this._ctx.push(BUS_EVENT.VIEW_HIERARCHY, viewHierarchy)
    }

    abstract dumpView(): UiCmpData;
}