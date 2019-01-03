import { CatalogNode } from '@common/models/CatalogNode';
import { visitDeep } from "../../utils/visitors";
import { ReactTreeNode } from './ReactTreeNode';

export function syncDataWithNodeTree(children: ReactTreeNode<CatalogNode>[], updateExpadedState: boolean) {
  let smthChanged = false;
  visitDeep(children, "children", (node) => {
    if (updateExpadedState) {
        if (node.nodeData.defaultExpanded != !node.collapsed) {
            smthChanged = true;
            node.nodeData.defaultExpanded = !node.collapsed;
        }        
    }
    if (node.children) {
      let oldChildren = node.nodeData.children;
      node.nodeData.children = node.children.map(x => x.nodeData);
      let changed = oldChildren!.some((x, i) => !node.nodeData.children![i] || x.id != node.nodeData.children![i].id);
      if (changed) {
        for (let child of node.children) {
          child.nodeData.parentId = node.nodeData.id;
        }
        smthChanged = true;
      }
    }
  });
  return smthChanged;
}
