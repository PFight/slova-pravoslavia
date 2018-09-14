import { CatalogNode } from '@common/models/CatalogNode';
import { ITreeNode, Icon } from "@blueprintjs/core";
import React from 'react';

export function createTreeNode(catalogNode: CatalogNode, parentNode?: ITreeNode<CatalogNode>): ITreeNode<CatalogNode> {
  let node: ITreeNode<CatalogNode> = {
    id: catalogNode.id,
    label: catalogNode.data && catalogNode.data.caption || '',
    nodeData: catalogNode,
    icon: catalogNode.children && catalogNode.children.length > 0 ? 
      <Icon icon="duplicate" className="bp3-tree-node-icon" iconSize={12} /> : 
      <Icon icon="square" className="bp3-tree-node-icon" iconSize={10} style={{marginTop: "4px"}} />
  };
  if (parentNode) {
    parentNode.childNodes = parentNode.childNodes || [];
    parentNode.childNodes.push(node);
  }
  return node;
}