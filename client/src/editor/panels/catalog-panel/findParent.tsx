import { CatalogNode } from '@common/models/CatalogNode';
import { ITreeNode } from "@blueprintjs/core";
import { visitDeep } from "../../utils/visitors";

export function findParent(treeNodes: ITreeNode<CatalogNode>[], selectedNode: ITreeNode<CatalogNode>) {
  let parent: ITreeNode<CatalogNode> | null = null;
  let indexInParent: number = 0;
  visitDeep(treeNodes, "childNodes", n => {
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