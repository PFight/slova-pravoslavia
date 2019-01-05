import React from "react";
import { WORSHIP_CLOSE_EVENT, PanelOpenClosesArgs, WORSHIP_OPEN_EVENT } from 'editor/global-state/events/panel-open-close';
import * as GoldenLayout from "golden-layout";
import { GLOBAL_STATE, GlobalState } from 'editor/global-state/global-state';
import { DataFileController } from 'editor/data-file-controller';
import { Worship } from '@common/models/Worship';
import { getCurrentWorshipId, onCurrentWorshipChange } from './urlParams';
import { WorshipNode, Speakers } from '@common/models/WorshipNode';
import { getSpeakerTitle } from './getSpeakerTitle';
import * as styles from './worship-panel-styles';
import { SourceRefView, NewSourceRefButton } from '../panels-common/SourceRefView';
import { SourceRefSource } from '@common/models/SourceRef';
import { SELECTED_SOURCE_REF_EVENT, SelectedSourceRefArgs } from 'editor/global-state/events/source-ref';
import { getHintText } from './getHintText';
import { MessageBox } from 'editor/utils/message-box';
import { SELECTED_SOURCE_RANGE_EVENT } from 'editor/global-state/events/source-range';
import { getSourceCaption } from '../panels-common/getSourceCaption';
import { getNodeCaption } from '../panels-common/getNodeCaption';
import shortid = require('shortid');
import { H3, H5, H4 } from '@blueprintjs/core';

export var SpeakerValues: (Speakers | undefined)[] = ["priest", "deacon", "sexton", "choir", "people", undefined];

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
  worship: Worship | undefined;
  loadingWorship: boolean;
  selectedNode: WorshipNode | undefined;
  editingNode: WorshipNode | undefined;
  newNode: WorshipNode | undefined;
}
export class WorshipPanel extends React.Component<Props, State> {
  state = {} as State;
  dataFileController = new DataFileController();

  componentDidMount() {
    if (GLOBAL_STATE.OpenWorships.length == 0) {
      this.state.panelNumber = 0;
      this.props.glEventHub.emit(WORSHIP_OPEN_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
      this.forceUpdate();
    }
    this.props.glEventHub.on(SELECTED_SOURCE_RANGE_EVENT, () => this.forceUpdate());
    
    this.loadWorship(getCurrentWorshipId());
    onCurrentWorshipChange((worshipId: string | null) => this.loadWorship(worshipId));
  }

  async loadWorship(worshipId: string | null) {
    if (worshipId) {
      this.setState({loadingWorship: true});
      try {
        let worship = await this.dataFileController.getWorship(worshipId);
        if (worship) {
          worship.nodes = worship.nodes.sort((a, b) => a.order - b.order);
        }
        this.setState({ worship }, () => this.openNewNode());
      } finally {
        this.setState({ loadingWorship: false });
      }
    } else {
      this.setState({ worship: undefined });
    }
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(WORSHIP_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
  }

  openNewNode() {
    if (!this.state.newNode) {
      this.state.newNode = { 
        id: shortid.generate(), 
        sourceRef: { sources: []},
        catalogNodeId: undefined,
        basis: undefined,
        order: this.state.worship!.nodes.length,
      };
    }
    this.setState({
      editingNode: this.state.newNode
    });
  }

  onNodeClick(node: WorshipNode) {
    if (this.state.selectedNode != node) {
      this.setState({ selectedNode: node });
      this.props.glEventHub.trigger(SELECTED_SOURCE_REF_EVENT, { 
        catalogNodeId: node.catalogNodeId,  
        ref: node.sourceRef
       } as SelectedSourceRefArgs); 
    }
  }
  onRefClick = (node: WorshipNode, ref: SourceRefSource) => {
    this.props.glEventHub.trigger(SELECTED_SOURCE_REF_EVENT, { 
      catalogNodeId: node.catalogNodeId,
      sourceIndex: node.sourceRef!.sources.indexOf(ref),
      ref: node.sourceRef
     } as SelectedSourceRefArgs); 
  }
  onDeleteRefClick = async (node: WorshipNode, ref: SourceRefSource) => {
    await MessageBox.ShowConfirmation(`Удалить ссылку ${ref.caption}?`);
    let index = node.sourceRef!.sources.indexOf(ref);
    node.sourceRef!.sources.splice(index, 1);
    this.dataFileController.saveWorship(this.state.worship!);
    this.forceUpdate();
  }
  onAddNewRefFromSelection = async () => {
    for (let sourcePanelNum of GLOBAL_STATE.OpenSources) {
      let sel = GLOBAL_STATE.SelectedRange[sourcePanelNum];
      let selNode = GLOBAL_STATE.SelectedRangeNode[sourcePanelNum];
      if (sel) {
        if (!sel.caption) {
          sel.caption = getSourceCaption(selNode, sel);
        }
        this.state.selectedNode!.sourceRef.sources.push(sel);
        if (selNode && GLOBAL_STATE.Catalog) {
          this.state.selectedNode!.catalogNodeId = selNode.id;
          this.state.selectedNode!.sourceRef = {...selNode.data!};
          this.state.selectedNode!.sourceRef.caption = getNodeCaption(GLOBAL_STATE.Catalog, selNode.id, true) || "...";
        }
      }
    }
    this.forceUpdate();
    await this.dataFileController.saveWorship(this.state.worship!);
  }

  onEditNode(node: WorshipNode) {
    this.setState({ editingNode: node, selectedNode: node });
  }

  onSaveNode(node: WorshipNode) {
    if (node == this.state.editingNode) {
      if (node == this.state.newNode) {
        this.state.worship!.nodes.push(node);
        this.state.newNode = undefined;
      }
      this.dataFileController.saveWorship(this.state.worship!);
      this.setState({ editingNode: undefined });
      this.openNewNode();
    }
  }

  renderWorship(worship: Worship) {
    let nodes = [...worship.nodes];
    if (this.state.newNode && this.state.newNode == this.state.editingNode) {
      nodes.push(this.state.newNode!);
    }
    nodes.sort((a, b) => a.order - b.order);
    return nodes.map(node =>
        node == this.state.editingNode ?
          this.renderWorshipNodeEdit(node) :
          this.renderWorshipNodeView(node)
      );
  }

  private renderWorshipNodeEdit(node: WorshipNode): JSX.Element {
    return (
      <styles.WorshipNodeStyle key={node.id} tabIndex={1}
        selected={this.state.selectedNode == node}>
        <styles.EditButton minimal icon="saved" onClick={() => this.onSaveNode(node)} text="Сохранить" />
        <H4>{node == this.state.newNode ? "Новый узел": "Редактирование"}</H4>        
        <styles.FormGroupEx label="Читает:" inline>
          <div className="bp3-select">          
            <select onChange={(ev) => (node.speaker = ev.target.value == "none" ? null : (ev.target.value as any)) && this.forceUpdate()}
              value={node.speaker || "none"}> 
              {SpeakerValues.map(speaker => 
                <option key={speaker || "none"} value={speaker || "none"}>{getSpeakerTitle(speaker) || "Не выбрано"}</option>
              )}
            </select>
          </div>
        </styles.FormGroupEx>
        { node.sourceRef && 
          <styles.FormGroupEx label="Содержимое:">
            <styles.textArea rows={1} className="bp3-input" value={node.sourceRef.caption}
              placeholder="Название узла" 
              onChange={(ev) => (node.sourceRef.caption = ev.target.value) && this.forceUpdate()} />
          </styles.FormGroupEx>}
        <styles.FormGroupEx label="Комментарий:">
          <styles.textInput className="bp3-input" value={node.comment} 
              placeholder="Комментарий" 
              onChange={(ev) => (node.comment = ev.target.value) && this.forceUpdate()} />
        </styles.FormGroupEx>
        <styles.FormGroupEx label="Ссылки:">
          {this.renderRefs(node)}
        </styles.FormGroupEx>
      </styles.WorshipNodeStyle>
    )
  }

  private renderWorshipNodeView(node: WorshipNode): JSX.Element {
    let selections = this.getCurrentSelections();

    return (
      <styles.WorshipNodeStyle key={node.id} tabIndex={1} 
        onClick={() => this.onNodeClick(node)} 
        selected={this.state.selectedNode == node}>
        <div>
          <styles.EditButton minimal icon="edit" onClick={() => this.onEditNode(node)} />
          <styles.Speaker>{getSpeakerTitle(node.speaker)}:</styles.Speaker>
          <span title={node.sourceRef && node.sourceRef.comment}>
            {node.sourceRef && node.sourceRef.caption + getHintText(node)}
          </span>
        </div>
        <div>
          <styles.NodeComment>{node.comment}</styles.NodeComment>
        </div>
        {this.state.selectedNode == node &&
          this.renderRefs(node)}
      </styles.WorshipNodeStyle>
    );
  }

  private renderRefs(node: WorshipNode): React.ReactNode {
    let selections = this.getCurrentSelections();

    return (
      <div>
        {node.sourceRef && node.sourceRef.sources.map(ref => <SourceRefView sourceRef={ref} onSelected={() => this.onRefClick(node, ref)} onDelete={() => this.onDeleteRefClick(node, ref)} />)}
        {selections.length > 0 &&
          <NewSourceRefButton minimal onClick={this.onAddNewRefFromSelection}>
            Добавить выделенное
          </NewSourceRefButton>}
      </div>
    );
  }

  private getCurrentSelections(): SourceRefSource[] {
    return GLOBAL_STATE.OpenSources.map(x => GLOBAL_STATE.SelectedRange[x]!).filter(x => !!x);
  }

  renderNoWorshipSelected() {
    return "Богослужение не выбрано";
  }

  render() {
    return (
      <styles.Panel>
        {this.state.panelNumber !== undefined ? (
          this.state.worship ? 
            this.renderWorship(this.state.worship) :
            (this.state.loadingWorship && "Загрузка..." ||
            this.renderNoWorshipSelected())
        )
        : "Одновременно может быть открыта только одна панель редактирования службы."}
      </styles.Panel>
    );
  }
}
