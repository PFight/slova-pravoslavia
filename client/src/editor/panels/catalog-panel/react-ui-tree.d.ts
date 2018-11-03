import { ReactTreeNode } from "./ReactTreeNode";
import React from "react";



export interface IReactUiTreeProps {
  tree: ReactTreeNode<any>;
  onChange?: (tree: ReactTreeNode<any>) => void;
  renderNode: (node: ReactTreeNode<any>) => React.ReactNode;
  paddingLeft?: number;
}

export class ReactUiTreeType extends React.Component<IReactUiTreeProps> {

}

