import React from "react";
import { WORSHIP_CLOSE_EVENT, PanelOpenClosesArgs, WORSHIP_OPEN_EVENT } from 'editor/global-state/events/panel-open-close';
import * as GoldenLayout from "golden-layout";
import { GLOBAL_STATE } from 'editor/global-state/global-state';
import { DataFileController } from 'editor/data-file-controller';
import { Worship } from '@common/models/Worship';
import { getCurrentWorshipId, onCurrentWorshipChange } from './urlParams';

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

  renderWorship(worship: Worship) {
    return worship.id;
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