import { SourceRefSource } from '@common/models/SourceRef';
import { getNode } from './nodeSelector';

export function selectInFrame(frame: HTMLFrameElement, ref: SourceRefSource | undefined) {
  if (frame.contentWindow && ref) {
    let document = frame.contentWindow.document;
    let selection = frame.contentWindow.getSelection();
    selection.removeAllRanges();

    for (let refRange of ref.ranges) {
      let range = document.createRange();
      let startNode = getNode(document, refRange.beginNodeId);
      let endNode = getNode(document, refRange.endNodeId);
      if (startNode && endNode) {
        range.setStart(startNode, parseInt(refRange.beginNodeStartShift || '0'));
        range.setEnd(endNode, parseInt(refRange.endNodeFinishShift || '0'));
        selection.addRange(range);
        startNode.parentElement!.scrollIntoView();
      }      
    }
  }
}