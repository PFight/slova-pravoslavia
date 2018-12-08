import React from "react";
import * as GoldenLayout from "golden-layout";
import { GLOBAL_STATE } from '../../global-state/global-state';
import { CATALOG_ITEM_DETAILS_OPEN_EVENT, PanelOpenClosesArgs, CATALOG_ITEM_DETAILS_CLOSE_EVENT, CATALOG_OPEN_EVENT, CATALOG_CLOSE_EVENT } from '../../global-state/events/panel-open-close';
import { generatePanelNumber } from "../panels-common/generatePanelNumber";
import { initExtraButton, deinitExtraButton } from '../panels-common/init-extra-button';
import { CatalogNode } from '@common/models/CatalogNode';
import { CATALOG_ITEM_SELECTED_EVENT, CatalogItemArgs, CATALOG_ITEM_SOURCES_CHANGED_EVENT, CATALOG_ITEM_OPENED_EVENT } from '../../global-state/events/catalog-item';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import { SourceRefSource } from '@common/models/SourceRef';
import { SELECTED_SOURCE_REF_EVENT, SelectedSourceRefArgs } from "../../global-state/events/source-ref";
import { SELECTED_SOURCE_RANGE_EVENT } from '../../global-state/events/source-range';
import { getSourceCaption } from '../panels-common/getSourceCaption';

export interface Props {
  glContainer: GoldenLayout.Container;
  glEventHub: GoldenLayout.EventEmitter;
}
export interface State {
  panelNumber: number;
  catalogItem: CatalogNode | null;
  addingNewRef: boolean;
}
export class CatalogItemDetailsPanel extends React.Component<Props, State> {
  state = {} as State;

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
    this.props.glEventHub.on(CATALOG_ITEM_SELECTED_EVENT, (ev: CatalogItemArgs) => {
      if (ev.panelNumber == this.state.panelNumber) {
        this.onCatalogItemSelected(ev.node);
      }
    });
    this.props.glEventHub.on(CATALOG_ITEM_OPENED_EVENT, (ev: CatalogItemArgs) => {
      if (ev.panelNumber == this.state.panelNumber) {
        if (ev.node && ev.node.data!.sources!.length > 0) {
          this.selectSourceRef(ev.node);
        } 
      }
    });
    this.props.glEventHub.on(SELECTED_SOURCE_RANGE_EVENT, () => this.forceUpdate());
  }

  componentWillUnmount() {
    this.props.glEventHub.emit(CATALOG_ITEM_DETAILS_CLOSE_EVENT, { panelNumber: this.state.panelNumber } as PanelOpenClosesArgs)
  }

  onCatalogItemSelected(item: CatalogNode | null) {
    if (item) {
      if (!item.data) {
        item.data = {} as any;
      }
      if (!item.data!.sources) {
        item.data!.sources = [];
      }      
    }
    this.setState({ catalogItem: item });
  }

  selectSourceRef(item: CatalogNode, ref?: SourceRefSource) {
    this.props.glEventHub.trigger(SELECTED_SOURCE_REF_EVENT, { 
      catalogNodeId: item.id,  
      panelNumber: this.state.panelNumber,
      sourceIndex: ref ? item.data!.sources.indexOf(ref) : undefined,
      ref: item.data
     } as SelectedSourceRefArgs); 
  }

  onSelectedRef(ref: SourceRefSource) {
    this.selectSourceRef(this.state.catalogItem!, ref);
  }

  onAddNewNode = async (text: string) => {
    let selectedRange = GLOBAL_STATE.SelectedRange[this.state.panelNumber];
    selectedRange!.caption = getSourceCaption(this.state.catalogItem!, selectedRange!);
    this.setState({ addingNewRef: false});
    this.state.catalogItem!.data!.sources.push(selectedRange!);
    this.props.glEventHub.trigger(CATALOG_ITEM_SOURCES_CHANGED_EVENT, {
      panelNumber: this.state.panelNumber,
      node: this.state.catalogItem
    } as CatalogItemArgs);
  }

  noValueLabel = styled.div`
    font-style: italic;
    font-size: 90%;
  `;

  itemCaption = styled.div`
    font-size: 110%;
    margin-bottom: 5px;
  `;

  sourceRef = styled(Button)`
    text-decoration: underline;
    color: blue;
  `;

  newSourceRef = styled(Button)`
    text-decoration: underline;
    color: blue;
    font-style: italic;
  `

  wrapper = styled.div`
    margin: 7px;
  `;

  renderNewSourceRef() {
    let selectedRange = GLOBAL_STATE.SelectedRange[this.state.panelNumber];
    return ( selectedRange && this.state.catalogItem &&
      <this.newSourceRef minimal onClick={() => this.onAddNewNode(selectedRange!.ranges[0].sourceFileId)}>
        Сопоставить с выделенным
      </this.newSourceRef>  
    )
  }

  render() {
    return (
      <this.wrapper>    
        {this.state.catalogItem && (
          this.state.catalogItem!.data && (
            <div>
              <this.itemCaption title={this.state.catalogItem!.data!.comment}>
                {this.state.catalogItem!.data!.caption}
              </this.itemCaption>
              {this.state.catalogItem!.data!.sources.map((ref, i) => 
                <this.sourceRef minimal key={i} title={ref.comment} onClick={() => this.onSelectedRef(ref)} >
                  {ref.caption}
                </this.sourceRef>
              )}
              {this.renderNewSourceRef()}
            </div>
          ) || ""
        ) || (
          <this.noValueLabel>Выберите узел в каталоге</this.noValueLabel>
        )}
      </this.wrapper>
    );
  }
}


