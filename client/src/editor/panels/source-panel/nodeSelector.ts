// @ts-ignore
import getSelector from 'get-selector'; 

interface INodeId {
  selector: string;
  childIndex?: number;
}

function indexOfNode(nodes: NodeListOf<Node>, node: Node) {
  let index = -1;
  nodes.forEach((x, i) => {
    if (x == node) {
      index = i;
    }
  });
  
  return index;
}

export function getNodeId(node: Node) {
  if (node) {
    let id: INodeId;
    if (node.nodeType == node.TEXT_NODE) {
      id = {
        selector: getSelector(node.parentElement),
        childIndex: indexOfNode(node.parentElement!.childNodes, node)
      };
    } else {
      id = {
        selector: getSelector(node)
      };
    }
    return JSON.stringify(id);
  }
}

export function getNode(document: Document, nodeId: string) {
  if (nodeId) {
    let id = JSON.parse(nodeId) as INodeId;
    let elem = document.querySelector(id.selector);
    if (elem && id.childIndex !== undefined) {
      return elem.childNodes[id.childIndex];
    } else {
      return elem;
    }
  }
}