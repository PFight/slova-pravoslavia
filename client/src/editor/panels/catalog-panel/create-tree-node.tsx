import { CatalogNode } from '@common/models/CatalogNode';
import { Icon } from "@blueprintjs/core";
import React from 'react';
import { ReactTreeNode } from './ReactTreeNode';

export function createTreeNode(catalogNode: CatalogNode, parentNode?: ReactTreeNode<CatalogNode> | null): ReactTreeNode<CatalogNode> {
  let node: ReactTreeNode<CatalogNode> = {
    module: catalogNode.id,
    nodeData: catalogNode,
    children: undefined,
    leaf: true,
    collapsed: !catalogNode.defaultExpanded,
    icon: catalogNode.children && catalogNode.children.length > 0 ? 
      <Icon icon="duplicate" className="bp3-tree-node-icon" iconSize={12} /> : 
      <Icon icon="square" className="bp3-tree-node-icon" iconSize={10} style={{marginTop: "4px"}} />
  };
  if (parentNode) {
    parentNode.children = parentNode.children || [];
    parentNode.leaf = false;
    parentNode.children.push(node);
  }
  return node;
}