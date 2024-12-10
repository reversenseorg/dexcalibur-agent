import {UiCmpData, DxcUiAPI} from "../../DxcUiAPI";
import {TECH_TYPE} from "../../DxcAgent";


type ParentHashCode = number;
type ViewHashCode = number;
type Cls = string;
type ViewId = number;
type Flags = any;
type Left = number;
type Top = number;
type Right = number;
type Bottom = number;
type Bounds = [Left, Top, Right, Bottom];

export type UiJavaCmpData = [ParentHashCode, ViewHashCode, Cls, ViewId, Flags, Bounds]

export class DxcJavaUI extends DxcUiAPI {

    static VIEW_ROOT_NODE_IMPL_HASHID = 0;
    static VIEW_LIST_HEADER = ["parentHashCode", "viewHashCode", "cls", "viewId", "flags", "bounds"];
    /**
     * dump the View Hierarchy in the App.
     *
     * @return {UiJavaCmpData[]} A list of Views, with `children` and `parents` Ids.
     */
    dumpView(): UiCmpData {
        let view_list: UiJavaCmpData[] = [];
        // Hypothesis that DecorView is the root View for each Display.
        Java.choose("com.android.internal.policy.DecorView", {
            onMatch: (vI) => {
                this.__view_tree_to_list(vI, view_list, DxcJavaUI.VIEW_ROOT_NODE_IMPL_HASHID);
            },
            onComplete: () => {
            }
        });
        return {
            header: DxcJavaUI.VIEW_LIST_HEADER,
            data: view_list,
            type:TECH_TYPE.JAVA
        };
    }

    /**
     * Recursively decompose a given View into a ViewHierarchy in form of list of Views.
     */
    __view_tree_to_list(view: any, view_list: UiJavaCmpData[], parentHashId: number): void {
        let extractedView: any[] = [];
        //  extractedView = [parentHashId:number, viewHashId:number, Cls:string, viewId:number, flags: string,
        //      (bounds relative to the parentView) left:number, top:number, right: number, bottom:number]
        extractedView.push(parentHashId) //TODO getId System.hash
        // getId() -> mId, mAutofillViewId, mAccessibilityViewId, (id used in toString method: Integer.toHexString(System.identityHashCode(view)))
        let viewHashId: number = Java.use('java.lang.Integer').toHexString(Java.use('java.lang.System').identityHashCode(view));
        extractedView.push(viewHashId);
        extractedView.push(view.getClass().getName())
        extractedView.push(view.getId());
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
        extractedView.push(view.toString().split(' ').slice(1, 3).join(''));
        extractedView.push([[view.getLeft(), view.getTop(), view.getRight(), view.getBottom()]]);
        view_list.push(extractedView as UiJavaCmpData);
        try {
            let viewAsViewGroup = Java.cast(view, Java.use('android.view.ViewGroup'));
            for (let i = 0; i < viewAsViewGroup.getChildCount(); i++) {
                let childView = viewAsViewGroup.getChildAt(i); //android.view.View
                this.__view_tree_to_list(childView, view_list, viewHashId);
            }
        } catch (e) {
            if (!(e.toString().includes('Cast from'))) {
                throw e;
            }
        }
    }
}