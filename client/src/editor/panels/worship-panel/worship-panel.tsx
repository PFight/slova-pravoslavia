import React from "react";
import { WORSHIP_CLOSE_EVENT, PanelOpenClosesArgs, WORSHIP_OPEN_EVENT } from 'editor/global-state/events/panel-open-close';
import * as GoldenLayout from "golden-layout";
import { GLOBAL_STATE } from 'editor/global-state/global-state';

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
}
export class WorshipPanel extends React.Component<Props, State> {
  state = {} as State;

  componentDidMount() {
    if (GLOBAL_STATE.OpenWorships.length == 0) {
      this.state.panelNumber = 0;
      this.props.glEventHub.emit(WORSHIP_OPEN_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
      this.forceUpdate();
    }
  }
  
  componentWillUnmount() {
    this.props.glEventHub.emit(WORSHIP_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
  }

  render() {
    return (
      this.state.panelNumber !== undefined ?
        <div>
          WorshipPanel
        </div>
      : "Одновременно может быть открыта только одна панель редактирования службы."
    );
  }
}