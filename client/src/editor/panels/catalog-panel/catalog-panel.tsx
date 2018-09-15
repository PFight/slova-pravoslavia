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
import { MessageBox } from '../../utils/message-box';
import { GLOBAL_STATE } from '../../global-state/global-state';
import { CATALOG_OPEN_EVENT, PanelOpenClosesArgs, CATALOG_CLOSE_EVENT } from '../../global-state/events/panel-open-close';

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
interface State {
  catalog: CatalogNode[];
  treeNodes: ITreeNode<CatalogNode>[];
  editMode: boolean;
  catalogNumber: number;
}
const NEW_NODE_STUB_ID = 'new-node';

export class CatalogPanel extends React.Component<Props, State> {
  state = {} as State;
  dataFileController = new DataFileController();
  editingNode: ITreeNode<CatalogNode> | undefined;

  componentDidMount() {
    this.loadCatalog();
    this.props.glContainer.on('tab', this.onTabCreated);    
    let panelNumber = 1;
    while (GLOBAL_STATE.OpenCatalogs.indexOf(panelNumber) >= 0) {
      panelNumber++;
    }
    this.setState({ catalogNumber: panelNumber }, () => {
      this.props.glEventHub.emit(CATALOG_OPEN_EVENT, { panelNumber } as PanelOpenClosesArgs);
      if (this.props.glContainer.tab) {
        this.onTabCreated(this.props.glContainer.tab);
      }
      if (panelNumber > 1) {
        this.props.glContainer.setTitle(this.props.glContainer.parent.config.title + " " + panelNumber);
      }
    });
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(CATALOG_CLOSE_EVENT, { panelNumber: this.state.catalogNumber } as PanelOpenClosesArgs)
  }

  onTabCreated = (tab: GoldenLayout.Tab) => {    
    let editModeButton = initEditModeButton(tab, "edit-mode-button");
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
    this.setState({ editMode }, () => {
      visitDeep(this.state.treeNodes, "childNodes", n => this.updateNodeView(n));
      this.forceUpdate();
    });
  }

  addNewNodeStub() {
    let catalogNode = {
      id: NEW_NODE_STUB_ID,
      data: { 
        caption: "<добавить>"
      }
    } as CatalogNode;
    let treeNode = this.createTreeNode(catalogNode);
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

  private createTreeNode(catalogNode: CatalogNode, parent?: ITreeNode<CatalogNode>) {
    let treeNode = createTreeNode(catalogNode, parent);
    this.updateNodeView(treeNode);
    return treeNode;
  }

  private onNodeClick = (nodeData: ITreeNode<CatalogNode>, e: React.MouseEvent<HTMLElement>) => {
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

  private onAddNodeClick = (parent?: ITreeNode<CatalogNode>) => {
    let catalogNode = {
      id: shortid.generate(),
      parentId: parent && parent.id || undefined,
      data: {}
    } as CatalogNode;
    let treeNode = this.createTreeNode(catalogNode, parent);
    if (parent) {
      parent.isExpanded = true;
      parent.nodeData!.children = parent.nodeData!.children || [];
      parent.nodeData!.children!.push(catalogNode);
      this.updateNodeView(parent);
    } else {
      this.state.treeNodes.push(treeNode);
    }
    this.beginNodeEdit(treeNode, parent, true);
    this.forceUpdate();
  }

  private beginNodeEdit(nodeData: ITreeNode<CatalogNode>, parent?: ITreeNode<CatalogNode>, newNode?: boolean) {
    if (this.editingNode) {
      this.endNodeEdit(this.editingNode);
    }    
    let accept = async (node: ITreeNode<CatalogNode>, newText: string) => {
      node.label = newText;
      if (node.nodeData && node.nodeData.data) {
        node.nodeData.data.caption = newText;
        if (node.id == NEW_NODE_STUB_ID) {
            this.state.catalog.push(node.nodeData);
          node.icon = this.createTreeNode(node.nodeData).icon;
          node.id = shortid.generate();
          node.nodeData.id = node.id;
          this.addNewNodeStub();
        } 
        await this.dataFileController.saveCatalog(this.state.catalog);
      }
      this.endNodeEdit(node);
    };
    let cancel = (node: ITreeNode<CatalogNode>) => {
      if (newNode && parent && parent.childNodes) {
        parent.childNodes!.splice(parent.childNodes.indexOf(node), 1);
        parent.nodeData!.children!.splice(parent.nodeData!.children!.indexOf(node.nodeData!), 1);
        this.updateNodeView(parent);
      }
      this.endNodeEdit(node);
    }
    nodeData.label = <NodeNameEditor node={nodeData} parent={parent} onAccept={accept} onCancel={cancel} />;
    this.editingNode = nodeData;
  }

  private endNodeEdit(node: ITreeNode<CatalogNode>) {
    this.updateNodeView(node);
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

  private onAddChildNode(parent: ITreeNode<CatalogNode>) {
    this.onAddNodeClick(parent);
  }

  private async onDeleteNode(node: ITreeNode<CatalogNode>) {
    if (node.childNodes && node.childNodes.length > 0) {
      await MessageBox.ShowConfirmation("Вы действительно хотите удалить узел со всеми его дочерними узлами?");
    } else {
      await MessageBox.ShowConfirmation("Вы действительно хотите удалить узел?");
    }

    if (node.nodeData && node.nodeData.parentId) {
      // Find parent node
      let parent: ITreeNode<CatalogNode> | undefined;
      visitDeep(this.state.treeNodes, "childNodes", n => {
        if (n.id == node.nodeData!.parentId) {
          parent = n;
        }
      });
      // remove node
      if (parent) {
        parent.childNodes!.splice(parent.childNodes!.indexOf(node), 1);
        parent.nodeData!.children!.splice(parent.nodeData!.children!.indexOf(node.nodeData), 1);
        this.updateNodeView(parent);
      }
    } else {
      this.state.treeNodes.splice(this.state.treeNodes.indexOf(node), 1);
      this.state.catalog.splice(this.state.catalog.indexOf(node.nodeData!), 1);
    }
    this.forceUpdate();
    await this.dataFileController.saveCatalog(this.state.catalog);
  }

  updateNodeView(node: ITreeNode<CatalogNode>) {
    node.label = this.renderLabel(node);
    node.icon = createTreeNode(node.nodeData!).icon;
    if (node.childNodes && node.childNodes.length == 0) {
      node.childNodes = undefined;
    }
  }

  renderLabel(node: ITreeNode<CatalogNode>) {
    let text = "";
    if (node.nodeData && node.nodeData.data) {
      text = node.nodeData.data.caption || "<узел без названия>";
    }
    if (this.state.editMode && node.id != NEW_NODE_STUB_ID) {
      return (
        <div className="display-flex">
          <span className="flex-spring margin-v-auto" onClick={(ev) => this.onNodeClick(node, ev)}>{text}</span>
          <Button className="flex-static margin-v-auto" minimal icon="plus" onClick={() => this.onAddChildNode(node)} />
          <Button className="flex-static margin-v-auto" minimal icon="trash" onClick={() => this.onDeleteNode(node)} />
        </div>
      );
    } else {
      return <div onClick={(ev) => this.onNodeClick(node, ev)}>{text}</div>;
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

  private renderTree() {
    return (
      <React.Fragment>
        <Tree contents={this.state.treeNodes}  
          onNodeCollapse={this.onNodeCollapse} 
          onNodeExpand={this.onNodeExpand} >
        </Tree>
      </React.Fragment>
    );
  }
}

