import { CatalogNode } from '@common/models/CatalogNode';
import { ITreeNode } from "@blueprintjs/core";

export function createTreeNode(catalogNode: CatalogNode, parentNode: ITreeNode<CatalogNode> | null): ITreeNode<CatalogNode> {
  let node: ITreeNode<CatalogNode> = {
    id: catalogNode.id,
    label: catalogNode.data && catalogNode.data.caption || '',
    nodeData: catalogNode,
    icon: catalogNode.children && catalogNode.children.length > 0 ? "folder-close" : "layout-linear"
  };
  if (parentNode) {
    parentNode.childNodes = parentNode.childNodes || [];
    parentNode.childNodes.push(node);
  }
  return node;
}