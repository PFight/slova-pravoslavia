import React from "react";
import { CatalogNode } from '@common/models/CatalogNode';
import { ITreeNode, Tree, Button } from "@blueprintjs/core";
import { DataFileController } from "../../data-file-controller";
import { visitDeepWithResult, visitDeep } from "../../utils/visitors";
import { createTreeNode } from "./create-tree-node";
import { NodeNameEditor } from './node-name-editor';
import * as GoldenLayout from "golden-layout";
import {initEditModeButton} from "./init-edit-mode-button";
import styled from 'styled-components';
import shortid from 'shortid';

export interface Props {
  glContainer: GoldenLayout.Container;
}
interface State {
  catalog: CatalogNode[];
  treeNodes: ITreeNode<CatalogNode>[];
  editMode: boolean;
}
const NEW_NODE_ID = 'new-node';

export class CatalogPanel extends React.Component<Props, State> {
  state = {} as State;
  dataFileController = new DataFileController();
  editingNode: ITreeNode<CatalogNode> | undefined;

  componentDidMount() {
    this.loadCatalog();
    this.props.glContainer.on('tab', this.onTabCreated);
    if (this.props.glContainer.tab) {
      this.onTabCreated(this.props.glContainer.tab);
    }
  }

  onTabCreated = (tab: GoldenLayout.Tab) => {    
    let editModeButton = tab.header.controlsContainer[0].querySelector('.edit-mode-button') as HTMLElement;
    if (!editModeButton) {
      editModeButton = initEditModeButton(editModeButton, tab);
    }
    editModeButton.addEventListener("click", () => {
      if (editModeButton) {
        this.setEditMode(editModeButton.dataset.editMode === "true"); 
      }
    })
  }

  setEditMode(editMode: boolean) {
    if (editMode) {
      this.selectNode(null, true);
      this.addNewNodeStub();
    } else {
      this.state.treeNodes.splice(this.state.treeNodes.length - 1);
    }
    this.setState({ editMode });   
  }

  addNewNodeStub() {
    let catalogNode = {
      id: NEW_NODE_ID,
      data: { 
        caption: "<добавить>"
      }
    } as CatalogNode;
    let treeNode = this.createTreeNode(catalogNode, null);
    treeNode.icon = "new-text-box";
    this.state.treeNodes.push(treeNode);
  }

  async loadCatalog() {
    let catalog = await this.dataFileController.getCatalog();
    let treeNodes = catalog.map(x => 
      visitDeepWithResult<CatalogNode, ITreeNode<CatalogNode>>(x, null, "children", this.createTreeNode.bind(this))
    );
    this.setState({ catalog, treeNodes });
  }

  private createTreeNode(catalogNode: CatalogNode, parent: ITreeNode<CatalogNode> | null) {
    let treeNode = createTreeNode(catalogNode, parent);
    treeNode.label = this.renderLabel(treeNode);
    return treeNode;
  }

  private onNodeClick = (nodeData: ITreeNode<CatalogNode>, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
    if (this.state.editMode) {
      if (!this.editingNode) {
        this.beginNodeEdit(nodeData);
      }
    } else {
      this.selectNode(nodeData, !e.shiftKey);
    }
    this.forceUpdate();
  };

  private onNodeCollapse = (nodeData: ITreeNode) => {
      nodeData.isExpanded = false;
      this.forceUpdate();
  };

  private onNodeExpand = (nodeData: ITreeNode) => {
      nodeData.isExpanded = true;
      this.forceUpdate();
  };

  private onDoubleClick = (nodeData: ITreeNode<CatalogNode>) => {
    this.beginNodeEdit(nodeData);
  }

  private onAddNodeClick = () => {
    let catalogNode = {
      id: shortid.generate(),
      data: {}
    } as CatalogNode;
    this.state.catalog.push(catalogNode);
    let treeNode = this.createTreeNode(catalogNode, null);
    this.state.treeNodes.push(treeNode);
    this.beginNodeEdit(treeNode);
    this.forceUpdate();
  }

  private beginNodeEdit(nodeData: ITreeNode<CatalogNode>) {
    if (this.editingNode) {
      this.endNodeEdit(this.editingNode);
    }    
    let accept = async (node: ITreeNode<CatalogNode>, newText: string) => {
      node.label = newText;
      if (node.nodeData && node.nodeData.data) {
        node.nodeData.data.caption = newText;
        if (node.id == NEW_NODE_ID) {
          this.state.catalog.push(node.nodeData);
          node.icon = this.createTreeNode(node.nodeData, null).icon;
          node.id = shortid.generate();
          node.nodeData.id = node.id;
          this.addNewNodeStub();
        }
        await this.dataFileController.saveCatalog(this.state.catalog);
      }
      this.endNodeEdit(node);
    };
    nodeData.label = <NodeNameEditor node={nodeData} onAccept={accept} onCancel={this.endNodeEdit.bind(this)} />;
    this.editingNode = nodeData;
  }

  private endNodeEdit(node: ITreeNode<CatalogNode>) {
    node.label = this.renderLabel(node);    
    this.forceUpdate(() => {
      this.editingNode = undefined;
    });
  }

  private selectNode(nodeData: ITreeNode<CatalogNode> | null, unselectOthers: boolean) {
    const originallySelected = nodeData && nodeData.isSelected;
    if (unselectOthers) {
      visitDeep(this.state.treeNodes, "childNodes", n => (n.isSelected = false));
    }
    if (nodeData) {
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;
    }
  }

  renderLabel(node: ITreeNode<CatalogNode>) {
    if (node.nodeData && node.nodeData.data) {
      return node.nodeData.data.caption || "<узел без названия>";
    } else {
      return "";
    }
  }

  render() {
      return (
        this.state.treeNodes ?
          this.renderTree()
        :
        <div>Loading...</div>
    );
  }

  addButton = styled(Button)`
    text-decoration: underline;
  `

  private renderTree() {
    return (
      <React.Fragment>
        <Tree contents={this.state.treeNodes} onNodeClick={this.onNodeClick} onNodeCollapse={this.onNodeCollapse} onNodeExpand={this.onNodeExpand} onNodeDoubleClick={this.onDoubleClick}>
        </Tree>
      </React.Fragment>
    );
  }
}

