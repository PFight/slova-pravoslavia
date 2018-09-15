import React from "react";
import * as GoldenLayout from "golden-layout";
import { GLOBAL_STATE } from '../../global-state/global-state';
import { CATALOG_ITEM_DETAILS_OPEN_EVENT, PanelOpenClosesArgs, CATALOG_ITEM_DETAILS_CLOSE_EVENT, CATALOG_OPEN_EVENT, CATALOG_CLOSE_EVENT } from '../../global-state/events/panel-open-close';
import { generatePanelNumber } from "../panels-common/generatePanelNumber";
import { initExtraButton, deinitExtraButton } from '../panels-common/init-extra-button';

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
}
export class CatalogItemDetailsPanel extends React.Component<Props, State> {
  componentDidMount() {
    this.props.glEventHub.on(CATALOG_CLOSE_EVENT, (args: PanelOpenClosesArgs) => {
      if (args.panelNumber == this.state.panelNumber) {
        setTimeout(() => this.props.glContainer.close());
      }
    });
    let panelNumber = generatePanelNumber(GLOBAL_STATE.OpenCatalogItemDetails);
    if (this.state.panelNumber > 1) {
      this.props.glContainer.setTitle(this.props.glContainer.parent.config.title + " " + this.state.panelNumber);
    }
    this.setState({ panelNumber }, () => {
      this.props.glEventHub.emit(CATALOG_ITEM_DETAILS_OPEN_EVENT, { panelNumber } as PanelOpenClosesArgs);     
    });
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(CATALOG_ITEM_DETAILS_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
  }

  render() {
    return (
      <div>CatalogItemDetailsPanel</div>
    );
  }
}


