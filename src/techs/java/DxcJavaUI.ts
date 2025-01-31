// Source Toller: https://github.com/TOLLER-Android/main/blob/main/on-device-agent/java/edu/illinois/cs/ase/ViewHandlerAnalysis.java

import {UiCmpData, DxcUiAPI} from "../../DxcUiAPI.js";
import {DxcAgent, TECH_TYPE} from "../../DxcAgent.js";
import {DxcJava} from "./DxcJava.js";

type ParentHashId = number;
type HashId = number;
type Cls = string;
type LocalId = number;
type ResourceName = string;
type Left = number;
type Top = number;
type Right = number;
type Bottom = number;
type Bounds = [Left, Top, Right, Bottom];
type Text = string | null;
type Editable = boolean;
type Password = boolean;
type Checked = boolean | null;
type ContentDescription = string;

// "mPrivateFlags2", "mPrivateFlags3", "mPrivateFlags4" are not used in the UI view representation.
const FLAGS_TO_RETRIEVE = ["mViewFlags", "mPrivateFlags"] // , "mPrivateFlags2", "mPrivateFlags3", "mPrivateFlags4"]
const CONTENT_DESCRIPTION_FIELD = "mContentDescription";
type Flags = [number, number, number, number, number];


export type UiJavaCmpData = [ParentHashId, HashId, Cls, LocalId, ResourceName, Flags, Bounds,
    Text, Editable, Password, Checked, ContentDescription];

export class DxcJavaUI extends DxcUiAPI {

    static DEFAULT_ROOT_VIEW_ID = 0;
    static VIEW_LIST_HEADER = ["parentHashId", "hashId", "cls", "localId", "resourceName", "flags", "bounds",
        "text", "editable", "password", "checked", "contentDescription"];
    static TEXTVIEW_MAX_LENGTH = 200;
    static CLICKABLE_VIEW = 0x00004000;
    static LONG_CLICKABLE_VIEW = 0x00200000;

    private _javaAPI:DxcJava;

    view_NO_ID: number = -1;
    clsViewGroup:any;
    clsEditText:any;
    fridaClsViewGroup:any;
    accessibilityStateChangeListeners = null;
    clsViewRootHandler;
    fViewRootImpl: any;
    fContext: any;
    fRootView: any;
    flagFields: any[];
    fridaClsCharSequence: Java.Wrapper<{}>;
    fridaClsSystem: Java.Wrapper<{}>;

    constructor(pDxcAgent:DxcAgent, pJavaAPI: DxcJava) {
        super(pDxcAgent);
        this._javaAPI = pJavaAPI;
    }

    /**
     * To initialize the elements needed to dump the UI View tree.
     *
     * @method
     */
    initDecorView() {
        this.view_NO_ID = Java.use("android.view.View").NO_ID;
        let clsClass = Java.use("java.lang.Class");

        this.clsViewGroup = clsClass.forName("android.view.ViewGroup");
        this.clsEditText = clsClass.forName("android.widget.EditText");
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
        this.clsViewRootHandler = clsClass.forName("android.view.ViewRootImpl$ViewRootHandler");

        this.flagFields = [];
        for (let flag_name of FLAGS_TO_RETRIEVE) {
            let field = Java.use('android.view.View').class.getDeclaredField(flag_name);
            if (field != null) {
                // Get around @UnsupportedAppUsage by setting the field as accessible.
                field.setAccessible(true);
            }
            this.flagFields.push(field);
        }
        this.fridaClsCharSequence = Java.use("java.lang.CharSequence");
        this.fridaClsSystem = Java.use("java.lang.System");
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
            let handler = this.accessibilityStateChangeListeners.valueAt(i);
            if (this.clsViewRootHandler.isInstance(handler)) {
                let viewRootImpl = this.fViewRootImpl.get(handler);
                let ctxWrapper = this.fContext.get(viewRootImpl);
                ctxWrapper = Java.cast(ctxWrapper, Java.use(ctxWrapper.$className));
                let res = ctxWrapper.getResources();
                let rootView = this.fRootView.get(viewRootImpl);
                rootView = Java.cast(rootView, Java.use(rootView.$className));
                let ui = this.extract_view_list(rootView, DxcJavaUI.DEFAULT_ROOT_VIEW_ID, res);
                view_list.push(ui);
            } else {
                console.log("Handler not a ViewRootHandler");
                console.log(handler);
                console.log(handler.$className);
            }
        }
        let ret: UiJavaCmpData[][] = view_list as UiJavaCmpData[][];
        return {
            headers: DxcJavaUI.VIEW_LIST_HEADER,
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
        //  extractedView = [parentHashId:number, vHash:number, Cls:string, viewId:number, resourceName:string, flags: string,
        //  (bounds relative to the parentView), text: string]
        pView = Java.cast(pView, Java.use(pView.$className));
        // 1. Get the parent hash ID
        extractedView.push(pParentHashId);
        // getId() -> mId, mAutofillViewId, mAccessibilityViewId, (id used in toString method: Integer.toHexString(System.identityHashCode(view)))
        // 2. Get the view hash ID
        let vHash: number = this._javaAPI.class.java.lang.System.identityHashCode(pView);
        extractedView.push(vHash);
        // 3. Get the view Class Name
        extractedView.push(pView.getClass().getName());
        // 4. Get the view local ID
        let viewId = pView.getId();
        extractedView.push(viewId);
        // 5. Get the view Resource ID from the view ID.
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
        // 6. Get the viewFlags and the 4 mPrvivateFlags
        let vFlags = [];
        for (let flagField of this.flagFields) {
            try {
                vFlags.push(flagField.getInt(pView));
            } catch (e) {
                vFlags.push(0);
            }
        }
        extractedView.push(vFlags);
        // 7, Get the view Bounds
        extractedView.push([pView.getLeft(), pView.getTop(), pView.getRight(), pView.getBottom()]);
        // TODO: Improvement orgClickListener.getClass().getName()); For AdapterView ViewGroup, the onclick also goes for children views.
        // 8-9-10. Get the view text - Get Editable status - Get isPassword
        if (typeof pView.getText === 'function') { // Alternative: check if view is instance of TextView
            let viewText = pView.getText();
            if (viewText != null) {
                // Need to cast the viewText to its own class, to be sure to be able to call length() and toString().
                viewText = Java.cast(viewText, this.fridaClsCharSequence);
                // Truncate the text.
                if (typeof viewText.length === 'function' && viewText.length() > DxcJavaUI.TEXTVIEW_MAX_LENGTH) {
                    viewText = viewText.subSequence(0, DxcJavaUI.TEXTVIEW_MAX_LENGTH);
                }
                extractedView.push(viewText.toString());
                // 9 Get Editable view status
                extractedView.push(this.clsEditText.isInstance(pView));
                // 10 Get isPassword view status
                if (typeof pView.isAnyPasswordInputType === 'function') { // Method from TextView
                    let isPassword: boolean = pView.isAnyPasswordInputType()
                    extractedView.push(isPassword);
                } else {
                    extractedView.push(null);
                }
            }
        } else {
            // No text was found attached to the view.
            extractedView.push(null);
            // Not Text Editable
            extractedView.push(false);
            // Not password
            extractedView.push(false);
        }
        // 10. Get the view Checked status
        if (typeof pView.isChecked === 'function') { // Alternative: check if view is instance of Checkable
            extractedView.push(pView.isChecked());
        } else {
            // View is not Checkable
            extractedView.push(null);
        }
        // 11. Get the view Content Description
        extractedView.push(pView.getContentDescription());
        /* Added by Toller
        getUnifiedClassName(v.getClass());
        v.isEnabled()
        v.getContentDescription();
        if v instanceof AdapterView > orgClickListener = adapterView.getOnItemClickListener() > getClass().getName()
        actionable (if component is interactive)
        // Config all info
        //AccessibilityNodeInfo, v.onInitializeAccessibilityNodeInfo(nodeInfo)
        */
        view_list.push(extractedView as UiJavaCmpData);
        // Add actionableViews
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