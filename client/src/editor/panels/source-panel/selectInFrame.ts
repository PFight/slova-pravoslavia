import { SourceRefSource, SourceRef, SourceRange } from '@common/models/SourceRef';
import { getNode } from './nodeSelector';

export function selectInFrame(frame: HTMLFrameElement, ref: SourceRefSource | undefined) {
  if (frame.contentWindow && ref) {
    let document = frame.contentWindow.document;
    let selection = frame.contentWindow.getSelection();
    selection.removeAllRanges();

    for (let refRange of ref.ranges) {
      let range = getSelectionRange(document, refRange);    
      selection.addRange(range);
      let startNode = getNode(document, refRange.beginNodeId);
      if (startNode) {
        startNode.parentElement!.scrollIntoView();  
      }
    }
  }
}

export function getSelectionRange(document: Document, refRange: SourceRange) {
  let range = document.createRange();
  let startNode = getNode(document, refRange.beginNodeId);
  let endNode = getNode(document, refRange.endNodeId);
  if (startNode && endNode) {
    range.setStart(startNode, parseInt(refRange.beginNodeStartShift || '0'));
    range.setEnd(endNode, parseInt(refRange.endNodeFinishShift || '0'));    
  }
  return range;
}
