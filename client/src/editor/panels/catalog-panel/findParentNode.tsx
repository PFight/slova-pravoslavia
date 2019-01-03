import { CatalogNode } from '@common/models/CatalogNode';
import { visitDeep } from "../../utils/visitors";
import { ReactTreeNode } from './ReactTreeNode';
export function findParentNode(root: ReactTreeNode<CatalogNode>, node: ReactTreeNode<CatalogNode>) {
  let parent: ReactTreeNode<CatalogNode> | undefined;
  visitDeep(root!.children!, "children", n => {
    if (n.module == node.nodeData!.parentId) {
      parent = n;
    }
  });
  return parent;
}
