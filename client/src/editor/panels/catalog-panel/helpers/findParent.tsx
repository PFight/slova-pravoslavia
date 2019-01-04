import { CatalogNode } from '@common/models/CatalogNode';
import { visitDeep } from "../../../utils/visitors";
import { ReactTreeNode } from './ReactTreeNode';

export function findParent(treeNodes: ReactTreeNode<CatalogNode>[], selectedNode: ReactTreeNode<CatalogNode>) {
  let parent: ReactTreeNode<CatalogNode> | null = null;
  let indexInParent: number = 0;
  visitDeep(treeNodes, "children", n => {
    if (n.nodeData!.children) {
      let index = n.nodeData!.children!.indexOf(selectedNode.nodeData!);
      if (index >= 0) {
        parent = n;
        indexInParent = index;
      }
    }
  });
  return { parent, indexInParent };
}