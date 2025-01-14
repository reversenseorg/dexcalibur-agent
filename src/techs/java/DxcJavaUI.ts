// Source Toller: https://github.com/TOLLER-Android/main/blob/main/on-device-agent/java/edu/illinois/cs/ase/ViewHandlerAnalysis.java

import {UiCmpData, DxcUiAPI} from "../../DxcUiAPI.js";
import {TECH_TYPE} from "../../DxcAgent.js";

type ParentHashCode = number;
type ViewHashCode = number;
type Cls = string;
type ViewId = number;
type ResourceName = string;
type Flags = any;
type Left = number;
type Top = number;
type Right = number;
type Bottom = number;
type Bounds = [Left, Top, Right, Bottom];
type viewText = string;

export type UiJavaCmpData = [ParentHashCode, ViewHashCode, Cls, ViewId, ResourceName, Flags, Bounds, viewText, viewText]

export class DxcJavaUI extends DxcUiAPI {

    static DEFAULT_ROOT_VIEW_ID = 0;
    static VIEW_LIST_HEADER = ["parentHashCode", "vHash", "cls", "viewId", "resName", "flags", "bounds", "viewText", "viewText"];
    static TEXTVIEW_MAX_LENGTH = 200;

    view_NO_ID: number = -1;
    clsViewGroup:any;
    fridaClsViewGroup:any;
    accessibilityStateChangeListeners: any = null;
    fViewRootImpl: any;
    fContext: any;
    fRootView: any;

    /**
     * To initialize the elements needed to dump the UI View tree.
     *
     * @method
     */
    initDecorView() {
        this.view_NO_ID = Java.use("android.view.View").NO_ID;
        let clsClass = Java.use("java.lang.Class");

        this.clsViewGroup = clsClass.forName("android.view.ViewGroup");
        this.fridaClsViewGroup = Java.use('android.view.ViewGroup');

        // Setup accessibilityStateChangeListeners
        let clsAccessibilityManager = clsClass.forName("android.view.accessibility.AccessibilityManager");
        let fInstance = clsAccessibilityManager.getDeclaredField("sInstance");
        fInstance.setAccessible(true);
        let accessibilityManager = fInstance.get(null);
        let fStateChangeListeners = clsAccessibilityManager.getDeclaredField("mAccessibilityStateChangeListeners");
        fStateChangeListeners.setAccessible(true);
        this.accessibilityStateChangeListeners = fStateChangeListeners.get(accessibilityManager);
        // ArrayMap<AccessibilityStateChangeListener, Handler>
        this.accessibilityStateChangeListeners = Java.cast(this.accessibilityStateChangeListeners,
                                                            Java.use("android.util.ArrayMap"));

        // Setup fViewRootImpl
        this.fViewRootImpl = clsClass.forName("android.view.ViewRootImpl$ViewRootHandler").getDeclaredField("this$0");
        this.fViewRootImpl.setAccessible(true);
        // Setup fRootView and fContext
        let clsViewRootImpl = clsClass.forName("android.view.ViewRootImpl");
        this.fRootView = clsViewRootImpl.getDeclaredField("mView");
        this.fRootView.setAccessible(true);
        this.fContext = clsViewRootImpl.getDeclaredField("mContext");
        this.fContext.setAccessible(true);
    }

    /**
     * Dump all the UI View trees from the current App state into a list of views. All displays will be dumped,
     * included those not focused.
     *
     * @return {UiCmpData}
     * @method
     */
    dumpView(): UiCmpData {
        let view_list: UiJavaCmpData[][] = [];
        if (this.accessibilityStateChangeListeners == null) {
            this.initDecorView();
        }
        for (let i = 0; i < this.accessibilityStateChangeListeners.size(); i++) {
        // Improvement: detect if the rootView is focused.
            try {
                let viewRootImpl = this.fViewRootImpl.get(this.accessibilityStateChangeListeners
                    .get(this.accessibilityStateChangeListeners.keyAt(i)));
                let ctxWrapper = this.fContext.get(viewRootImpl);
                ctxWrapper = Java.cast(ctxWrapper, Java.use(ctxWrapper.$className));
                let res = ctxWrapper.getResources();
                let rootView = this.fRootView.get(viewRootImpl);
                rootView = Java.cast(rootView, Java.use(rootView.$className));
                let ui = this.extract_view_list(rootView, DxcJavaUI.DEFAULT_ROOT_VIEW_ID, res);
                view_list.push(ui);
            }catch(e) {
                console.log(e.stack, e.message);
            }
        }
        let ret: UiJavaCmpData[][] = view_list as UiJavaCmpData[][];
        return {
            header: DxcJavaUI.VIEW_LIST_HEADER,
            data: ret,
            type: TECH_TYPE.JAVA
        };
    }

    /**
     * Recursively decompose the given View, and its children into a View tree.
     *
     * @param pView The View to be dumped.
     * @param {number} pParentHashId The parent View HashID.
     * @param pRes The resources associated to the context of the viewRootImpl that contains pView.
     * @return {UiJavaCmpData[]}
     * @method
     */
    extract_view_list(pView: any, pParentHashId: number, pRes: any): UiJavaCmpData[] {
        let view_list: UiJavaCmpData[] = [];
        let extractedView: any[] = [];
        //  extractedView = [parentHashId:number, vHash:number, Cls:string, viewId:number, resName:string, flags: string,
        //  (bounds relative to the parentView), text: string]
        extractedView.push(pParentHashId)
        pView = Java.cast(pView, Java.use(pView.$className));
        // getId() -> mId, mAutofillViewId, mAccessibilityViewId, (id used in toString method: Integer.toHexString(System.identityHashCode(view)))
        let vHash: number = Java.use('java.lang.System').identityHashCode(pView);
        extractedView.push(vHash);
        extractedView.push(pView.getClass().getName())
        let viewId = pView.getId();
        extractedView.push(viewId);
        // Retrieve the Resource ID from the view ID.
        try {
            if (viewId != this.view_NO_ID && pRes != null) {
                extractedView.push(pRes.getResourceName(viewId));
            } else {
                extractedView.push("");
            }
        } catch (e) {
            // android.content.res.Resources$NotFoundException
            extractedView.push("");
        }
        // Improvement: getUnifiedClassName(v.getClass());
        /* Add Flags extracted from the toString method.
        - Visibility: 'V' Visible || 'I' invisible || 'G' gone || '.' default
        - FOCUSABLE: 'F'|| '.'
        - ENABLED: 'E' || '.'
        - DRAW_MASK: 'D' || '.'
        - SCROLLBARS_HORIZONTAL : 'H' || '.'
        - SCROLLBARS_VERTICAL : 'V' || '.'
        - CLICKABLE : 'C' || '.'
        - LONG_CLICKABLE : 'L' || '.'
        - CONTEXT_CLICKABLE : 'X' || '.'
        - Private_FLAG_IS_ROOT_NAMESPACE: 'R' || '.'
        - Private_FLAG_FOCUSED: 'F' || '.'
        - Private_FLAG_SELECTED: 'S' || '.'
        - Private_FLAG_PRESSED: 'p' Prepressed || 'P' Pressed || '.'
        - Private_FLAG_HOVERED: 'H' || '.'
        - Private_FLAG_ACTIVATED: 'A' || '.'
        - Private_FLAG_INVALIDATED: 'I' || '.'
        - Private_FLAG_DIRTY_MASK: 'D' || '.'
         */
        extractedView.push(pView.toString().split(' ').slice(1, 3).join(''));
        // Bounds
        extractedView.push([pView.getLeft(), pView.getTop(), pView.getRight(), pView.getBottom()]);
        // TODO: Improvement orgClickListener.getClass().getName()); For AdapterView ViewGroup, the onclick also goes for children views.
        // Retrieve the text in the View, from the getView method
        if (typeof pView.getText === 'function') { // Alternative: check if view is instance of TextView
            let viewText = pView.getText();
            // Need to cast the viewText to its own class, to be sure to be able to call length() and toString().
            viewText = Java.cast(viewText, Java.use(viewText.$className));
            // Truncate the text.
            if (typeof viewText.length === 'function' && viewText.length() > DxcJavaUI.TEXTVIEW_MAX_LENGTH) {
                viewText = viewText.subSequence(0, DxcJavaUI.TEXTVIEW_MAX_LENGTH);
            }
            extractedView.push(viewText.toString());
        } else {
            // No text was found attached to the view.
            extractedView.push("");
        }
        view_list.push(extractedView as UiJavaCmpData);
        // Get children views
        if (this.clsViewGroup.isInstance(pView)) {
            let viewAsViewGroup = Java.cast(pView, this.fridaClsViewGroup);
            for (let i = 0; i < viewAsViewGroup.getChildCount(); i++) {
                let childView = viewAsViewGroup.getChildAt(i);
                view_list = view_list.concat(this.extract_view_list(childView, vHash, pRes));
            }
        }
        return view_list;
    }
}