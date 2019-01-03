import React from "react";
import { CatalogNode } from '@common/models/CatalogNode';
import { Button } from "@blueprintjs/core";
// @ts-ignore
import Tree from 'react-ui-tree';
import { DataFileController } from "../../data-file-controller";
import { visitDeepWithResult, visitDeep } from "../../utils/visitors";
import { createTreeNode } from "./create-tree-node";
import { NodeNameEditor } from '../panels-common/node-name-editor';
import * as GoldenLayout from "golden-layout";
import {initEditModeButton} from "./init-edit-mode-button";
import styled from 'styled-components';
import shortid from 'shortid';
import { MessageBox } from '../../utils/message-box';
import { GLOBAL_STATE } from '../../global-state/global-state';
import { CATALOG_OPEN_EVENT, PanelOpenClosesArgs, CATALOG_CLOSE_EVENT } from '../../global-state/events/panel-open-close';
import { CATALOG_ITEM_SELECTED_EVENT, CatalogItemArgs, CATALOG_ITEM_SOURCES_CHANGED_EVENT, CATALOG_ITEM_OPENED_EVENT, CATALOG_MODE_CHANGED_EVENT, CatalogModeArgs } from '../../global-state/events/catalog-events';
import { SourceRef } from '@common/models/SourceRef';
import { SelectedSourceRangeArgs, ASSIGN_TO_SELECTED_NODE, ADD_AS_CHILD, ADD_AS_SIBLING } from '../../global-state/events/source-range';
import { assignNodeSource } from './assignNodeSource';
import { findParent } from './findParent';
import { getSourceCaption } from '../panels-common/getSourceCaption';
import { ReactTreeNode } from './ReactTreeNode';
import { ReactUiTreeType } from './react-ui-tree';
import { preventDragAndDropByPrimaryMouse } from './preventDragAndDropByPrimaryMouse';
import { syncDataWithNodeTree } from './syncDataWithNodeTree';
import { findParentNode } from './findParentNode';


var ReactUiTree = Tree as (typeof ReactUiTreeType);

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
interface State {
  catalog: CatalogNode[];
  
  editMode: boolean;
  panelNumber: number;
  
}
const NEW_NODE_STUB_ID = 'new-node';

export class CatalogPanel extends React.Component<Props, State> {
  state = {} as State;
  dataFileController = new DataFileController();
  editingNode: ReactTreeNode<CatalogNode> | undefined;
  uiTree: ReactUiTreeType | undefined;
  dragStartOrig: any;
  root: ReactTreeNode<CatalogNode> | null = null;
  selectedNode: ReactTreeNode<CatalogNode> | null = null;

  componentDidMount() {
    this.loadCatalog();
    this.props.glContainer.on('tab', this.onTabCreated);    
    let panelNumber = 1;
    while (GLOBAL_STATE.OpenCatalogs.indexOf(panelNumber) >= 0) {
      panelNumber++;
    }
    this.setState({ panelNumber: panelNumber }, () => {
      this.props.glEventHub.emit(CATALOG_OPEN_EVENT, { panelNumber } as PanelOpenClosesArgs);
      if (this.props.glContainer.tab) {
        this.onTabCreated(this.props.glContainer.tab);
      }
      if (panelNumber > 1) {
        this.props.glContainer.setTitle(this.props.glContainer.parent.config.title + " " + panelNumber);
      }
    });
    this.props.glEventHub.on(CATALOG_ITEM_SOURCES_CHANGED_EVENT, (ev: CatalogItemArgs) => {
      if (ev.panelNumber == this.state.panelNumber) {
        visitDeep(this.state.catalog, "children", (node) => {
          if (node.id == ev.node!.id) {
            node.data!.sources = ev.node!.data!.sources;
          }
        });
        this.dataFileController.saveCatalog(this.state.catalog);
      }
    });
    this.props.glEventHub.on(ASSIGN_TO_SELECTED_NODE, (ev: SelectedSourceRangeArgs) => this.assignNodeSource(ev));
    this.props.glEventHub.on(ADD_AS_CHILD, (ev: SelectedSourceRangeArgs) => this.addAsChild(ev));
    this.props.glEventHub.on(ADD_AS_SIBLING, (ev: SelectedSourceRangeArgs) => this.addAsSibling(ev));
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(CATALOG_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
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
      this.root!.children!.splice(this.root!.children!.length - 1);
    }
    this.setState({ editMode }, () => {
      visitDeep(this.root!.children!, "children", n => this.updateNodeView(n));
      this.forceUpdate();
      this.props.glEventHub.emit(CATALOG_MODE_CHANGED_EVENT, 
        { panelNumber: this.state.panelNumber, editMode } as CatalogModeArgs);
    });
  }

  addNewNodeStub() {
    let catalogNode = {
      id: NEW_NODE_STUB_ID,
      data: { 
        caption: "<добавить>"
      }
    } as CatalogNode;
    let ReactTreeNode = this.createTreeNode(catalogNode);
    ReactTreeNode.icon = "new-text-box";
    this.root!.children!.push(ReactTreeNode);
  }

  async loadCatalog() {
    let catalog = await this.dataFileController.getCatalog();
    let reactTreeNodes = catalog.map(x => 
      visitDeepWithResult<CatalogNode, ReactTreeNode<CatalogNode>>(x, null, "children", this.createTreeNode.bind(this))
    );
    this.root = { module: "root", label:"Каталог", children: reactTreeNodes, nodeData: {} as any, leaf: false, collapsed: false};
    this.state.catalog = catalog;
    this.forceUpdate();    
  }

  private async assignNodeSource(args: SelectedSourceRangeArgs) {
    if (args.panelNumber == this.state.panelNumber && this.selectedNode) {
      assignNodeSource(this.selectedNode.nodeData!, args);
      this.triggerNodeSelected(this.selectedNode);
      await this.dataFileController.saveCatalog(this.state.catalog);
    }
  }

  private addAsChild(args: SelectedSourceRangeArgs) {
    if (args.panelNumber == this.state.panelNumber && this.selectedNode) {
      let node = this.onAddNode(this.selectedNode, undefined, { sources: [ args.source ] }, !args.header);
      if (args.header) {
        node.nodeData!.data!.caption = args.header;
        this.updateNodeView(node);
        this.selectNode(node, true);
        this.forceUpdate();
        this.dataFileController.saveCatalog(this.state.catalog);
      }
    }
  }

  private addAsSibling(args: SelectedSourceRangeArgs) {
    if (args.panelNumber == this.state.panelNumber && this.selectedNode) {
      let { parent, indexInParent } = findParent(this.root!.children!, this.selectedNode);
      if (parent) {
        let node = this.onAddNode(parent, indexInParent + 1, { sources: [ args.source ] }, !args.header);
        if (args.header) {
          node.nodeData!.data!.caption = args.header;
          this.updateNodeView(node);
          this.selectNode(node, true);
          this.forceUpdate();
          this.dataFileController.saveCatalog(this.state.catalog);
        }
      }
    }
  }

  private createTreeNode(catalogNode: CatalogNode, parent?: ReactTreeNode<CatalogNode> | null) {
    let ReactTreeNode = createTreeNode(catalogNode, parent);
    this.updateNodeView(ReactTreeNode);
    return ReactTreeNode;
  }

  private onNodeClick = (nodeData: ReactTreeNode<CatalogNode>, e: React.MouseEvent<HTMLElement>) => {
    if (nodeData.module == "root")
      return;

    if (this.state.editMode) {
      this.selectNode(nodeData, !e.shiftKey);
      this.openNode(nodeData);
    } else {
      this.selectNode(nodeData, !e.shiftKey);
    }
    this.forceUpdate();
  };

  private onNodeDoubleClick = (nodeData: ReactTreeNode<CatalogNode>, e: React.MouseEvent<HTMLElement>) => {
    if (nodeData.module == "root")
      return;

    if (this.state.editMode) {
      if (!this.editingNode) {
        this.beginNodeEdit(nodeData);
      }
    } else {
      this.openNode(nodeData);
    }
    this.forceUpdate();
  }

  private onAddNode = (parent?: ReactTreeNode<CatalogNode>,  indexInParent?: number, sourceRef?: SourceRef, startEdit = true) => {
    let catalogNode = {
      id: shortid.generate(),
      parentId: parent && parent.module || undefined,
      data: sourceRef || {}
    } as CatalogNode;
    let reactTreeNode = this.createTreeNode(catalogNode, parent);
    if (parent) {
      parent.collapsed = false;
      parent.nodeData!.children = parent.nodeData!.children || [];
      if (indexInParent !== undefined) {
        parent.nodeData!.children!.splice(indexInParent, 0, catalogNode);
      } else {
        parent.nodeData!.children!.push(catalogNode);
      }
      this.updateNodeView(parent);
    } else {
      this.root!.children!.push(reactTreeNode);
    }
    if (startEdit) {
      this.beginNodeEdit(reactTreeNode, parent, true);
    }
    this.forceUpdate();
    return reactTreeNode;
  }

  private beginNodeEdit(nodeData: ReactTreeNode<CatalogNode>, parent?: ReactTreeNode<CatalogNode>, newNode?: boolean) {
    if (this.editingNode) {
      this.endNodeEdit(this.editingNode);
    }    
    let accept = async (node: ReactTreeNode<CatalogNode>, newText: string) => {
      node.label = newText;
      if (node.nodeData && node.nodeData.data) {
        node.nodeData.data.caption = newText;
        if (node.nodeData.data.sources && node.nodeData.data.sources.length > 0) {
          node.nodeData.data.sources[0].caption = getSourceCaption(node.nodeData, node.nodeData.data.sources[0]);
        }
        if (node.module == NEW_NODE_STUB_ID) {
            this.state.catalog.push(node.nodeData);
          node.icon = this.createTreeNode(node.nodeData).icon;
          node.module = shortid.generate();
          node.nodeData.id = node.module;
          this.addNewNodeStub();
        } 
        await this.dataFileController.saveCatalog(this.state.catalog);
      }
      this.endNodeEdit(node);
    };
    let cancel = (node: ReactTreeNode<CatalogNode>) => {
      if (newNode && parent && parent.children) {
        parent.children!.splice(parent.children.indexOf(node), 1);
        parent.nodeData!.children!.splice(parent.nodeData!.children!.indexOf(node.nodeData!), 1);
        this.updateNodeView(parent);
      }
      this.endNodeEdit(node);
    }
    nodeData.label = 
      <NodeNameEditor data={nodeData} 
        initialText={nodeData.nodeData!.data!.caption || ""}
        additionalData={parent} 
        onAccept={accept} 
        onCancel={cancel} />;
    this.editingNode = nodeData;
  }

  private endNodeEdit(node: ReactTreeNode<CatalogNode>) {
    this.updateNodeView(node);
    this.forceUpdate(() => {
      this.editingNode = undefined;
    });
  }

  private selectNode(node: ReactTreeNode<CatalogNode> | null, unselectOthers: boolean) {
    if (unselectOthers) {
      visitDeep(this.root!.children!, "children", n => {
        (n.isSelected = false);
        this.updateNodeView(n);
      });
    }
    if (node) {
      node.isSelected = true;
      this.updateNodeView(node);
    }
    this.triggerNodeSelected(node);
    this.selectedNode = node;
    this.forceUpdate();
  }

  private triggerNodeSelected(node: ReactTreeNode<CatalogNode> | null) {
    this.props.glEventHub.trigger(CATALOG_ITEM_SELECTED_EVENT, {
      node: node && node.nodeData || null,
      panelNumber: this.state.panelNumber
    } as CatalogItemArgs);
  }

  private openNode(nodeData: ReactTreeNode<CatalogNode> | null) {
    this.props.glEventHub.trigger(CATALOG_ITEM_OPENED_EVENT, {
      node: nodeData && nodeData.nodeData || null,
      panelNumber: this.state.panelNumber
    } as CatalogItemArgs);
  }

  private onAddChildNode(parent: ReactTreeNode<CatalogNode>) {
    this.onAddNode(parent);
  }

  private async onDeleteNode(node: ReactTreeNode<CatalogNode>) {
    if (node.children && node.children.length > 0) {
      await MessageBox.ShowConfirmation("Вы действительно хотите удалить узел со всеми его дочерними узлами?");
    } else {
      await MessageBox.ShowConfirmation("Вы действительно хотите удалить узел?");
    }

    if (node.nodeData && node.nodeData.parentId) {
      let parent = findParentNode(this.root!, node); 
      // remove node
      if (parent) {
        parent.children!.splice(parent.children!.indexOf(node), 1);
        parent.nodeData!.children!.splice(parent.nodeData!.children!.indexOf(node.nodeData), 1);
        this.updateNodeView(parent);
      }
    } else {
      this.root!.children!.splice(this.root!.children!.indexOf(node), 1);
      this.state.catalog.splice(this.state.catalog.indexOf(node.nodeData!), 1);
    }
    this.forceUpdate();
    await this.dataFileController.saveCatalog(this.state.catalog);
  }

  applyNodesOrder = async (tree: ReactTreeNode<CatalogNode>) => {
    if (this.state.editMode) {
      this.root = tree;
      let changed = syncDataWithNodeTree(this.root!.children!, this.state.editMode);
      if (changed) {
        await this.dataFileController.saveCatalog(this.state.catalog);
      }
    }
  }

  attachTree = (el: ReactUiTreeType) => {
    this.uiTree = el;
    preventDragAndDropByPrimaryMouse(el, () => !this.state.editMode);    
  }

  updateNodeView(node: ReactTreeNode<CatalogNode>) {
    node.label = this.renderLabel(node);
    node.icon = createTreeNode(node.nodeData!).icon;
    if (node.children && node.children.length == 0) {
      node.children = undefined;
      node.leaf = true;
    } else {
      node.leaf = false;
    }
  }

  NodeIcon = styled.span`
    margin-right: 5px;
  `;

  Node = styled.div`
    ${ (props: {selected: boolean} ) => `
      padding: 4px 0 4px 5px;
      &:hover {
        background-color: ${props.selected? '#9cacc1;' : 'lightgray;'};
      }
      
        background-color: ${props.selected? 'lightsteelblue;' : 'none;'}
    `}
  `;

  EditNode = styled(this.Node)`
    padding: 3px 0 3px 5px;
  `;

  NodeButton = styled(Button)`
    padding-top: 0;
    padding-bottom: 0;
    min-height: auto;
  `;

  renderLabel(node: ReactTreeNode<CatalogNode>) {
    let text = "";
    if (node.nodeData && node.nodeData.data) {
      text = node.nodeData.data.caption || "<узел без названия>";
    }
    const NodeComponent = this.Node;
    if (this.state.editMode && node.module != NEW_NODE_STUB_ID) {
      return (
        <this.EditNode className="display-flex" selected={node.isSelected!}>
          <this.NodeIcon className="flex-static margin-v-auto">{node.icon}</this.NodeIcon>
          <span className="flex-spring margin-v-auto" 
            onClick={(ev) => this.onNodeClick(node, ev)} 
            onDoubleClick={(ev) => this.onNodeDoubleClick(node, ev)}>
            {text}
          </span>
          <this.NodeButton className="flex-static margin-v-auto" minimal icon="plus" onClick={() => this.onAddChildNode(node)} />
          <this.NodeButton className="flex-static margin-v-auto" minimal icon="trash" onClick={() => this.onDeleteNode(node)} />
        </this.EditNode>
      );
    } else {
      return (
        <this.Node className="display-flex" selected={node.isSelected!}
          onClick={(ev) => this.onNodeClick(node, ev)} 
          onDoubleClick={(ev) => this.onNodeDoubleClick(node, ev)}>
          <this.NodeIcon className="flex-static margin-v-auto">{node.icon}</this.NodeIcon>
          <span className="flex-spring margin-v-auto">
            {text}
          </span>
        </this.Node>);
    }
  }



  render() {
      return (
        this.root ?
          this.renderTree()
        :
        <div>Loading...</div>
    );
  }

  renderNode = (node: ReactTreeNode<CatalogNode>) => {
    return node.label;
  }

  scrollContainer = styled.div`
    overflow-y: auto;
    height: 100%;
  `;

  private renderTree() {
    return (
      <this.scrollContainer>
        <ReactUiTree  ref={this.attachTree}
          tree={this.root!}  
          renderNode={this.renderNode}
          onChange={this.applyNodesOrder} >
        </ReactUiTree>
      </this.scrollContainer>
    );
  }
}


