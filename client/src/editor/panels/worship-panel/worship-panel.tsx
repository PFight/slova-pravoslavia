import React from "react";
import { WORSHIP_CLOSE_EVENT, PanelOpenClosesArgs, WORSHIP_OPEN_EVENT } from 'editor/global-state/events/panel-open-close';
import * as GoldenLayout from "golden-layout";
import { GLOBAL_STATE } from 'editor/global-state/global-state';
import { DataFileController } from 'editor/data-file-controller';
import { Worship } from '@common/models/Worship';
import { getCurrentWorshipId, onCurrentWorshipChange } from './urlParams';
import styled from 'styled-components';
import { WorshipNode } from '@common/models/WorshipNode';
import { getSpeakerTitle } from './getSpeakerTitle';

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
  worship: Worship | undefined;
  loadingWorship: boolean;
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
        this.setState({ worship });
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

  worshipNode = styled.div`
    border-radius: 6px;
    background-color: rgb(247, 239, 205);
    &:hover {
      background-color: rgb(249, 235, 177);
    }
    &:focus {
      border: 1px dashed blue;
    }
    border: 1px solid transparent;
    margin: 2px 3px;
    padding: 5px;
    cursor: pointer;
  `;

  speaker = styled.span`
    font-weight: bold;
    color: red;
    display: inline-block;
    padding-right: 4px;
  `;

  nodeComment = styled.span`
    font-style: italic;
  `;

  renderWorship(worship: Worship) {
    return worship.nodes && worship.nodes.map(node =>
        <this.worshipNode key={node.id} tabIndex={1}>
          <div>
            <this.speaker>{getSpeakerTitle(node)}:</this.speaker>
            <span title={node.sourceRef && node.sourceRef.comment}>
              {node.sourceRef && node.sourceRef.caption}
            </span>
          </div>
          <div>
            <this.nodeComment>{node.comment}</this.nodeComment>
          </div>
        </this.worshipNode> 
      );
  }

  renderNoWorshipSelected() {
    return "Богослужение не выбрано";
  }

  render() {
    return (
      this.state.panelNumber !== undefined ? (
        this.state.worship ? 
          this.renderWorship(this.state.worship) :
          (this.state.loadingWorship && "Загрузка..." ||
          this.renderNoWorshipSelected())
      )
      : "Одновременно может быть открыта только одна панель редактирования службы."
    );
  }
}


