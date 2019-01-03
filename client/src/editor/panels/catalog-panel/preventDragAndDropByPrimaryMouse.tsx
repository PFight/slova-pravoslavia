import { ReactUiTreeType } from './react-ui-tree';
/** Prevent drag and drop by primary mouse button and in view mode */
export function preventDragAndDropByPrimaryMouse(el: ReactUiTreeType, forcePrevent: () => boolean) {
  if (el) {
    let dragStartOrig = (el as any).dragStart as Function;
    (el as any).dragStart = function (id: string, dom: any, ev: MouseEvent) {
      if (ev.button != 0 && !forcePrevent()) {
        let evCopy = { ...ev };
        evCopy.button = 0;
        dragStartOrig.apply(this, [id, dom, evCopy]);
      }
    };
  }
}
