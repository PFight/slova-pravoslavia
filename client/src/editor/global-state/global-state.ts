import * as GoldenLayout from "golden-layout";

import { GET_GLOBAL_STATE_EVENT } from "./events/get-global-state";
import { GLOBA_STATE_EVENT } from "./events/global-state";
import { CATALOG_OPEN_EVENT, CATALOG_CLOSE_EVENT, PanelOpenClosesArgs, CATALOG_ITEM_DETAILS_OPEN_EVENT, CATALOG_ITEM_DETAILS_CLOSE_EVENT, SOURCE_OPEN_EVENT, SOURCE_CLOSE_EVENT } from "./events/panel-open-close";
import { CatalogNode } from '@common/models/CatalogNode';
import { CATALOG_ITEM_SELECTED_EVENT, CatalogItemArgs } from "./events/catalog-item";
import { SourceRange, SourceRefSource } from '@common/models/SourceRef';
import { SELECTED_SOURCE_RANGE_EVENT, SelectedSourceRangeArgs } from "./events/source-range";

export type PanelValues<T> = { [panelNumber: number]: T };

export class GlobalState {
  constructor(emitter: GoldenLayout.EventEmitter) {
    emitter.on(GLOBA_STATE_EVENT, (state: GlobalState) => {
      for (let prop in state) {
        (this as any)[prop] = (state as any)[prop];
      }
    })
    emitter.emit(GET_GLOBAL_STATE_EVENT);
    emitter.on(GET_GLOBAL_STATE_EVENT, () => {
      emitter.emit(GLOBA_STATE_EVENT, this);
    });

    emitter.on(CATALOG_OPEN_EVENT, (ev: PanelOpenClosesArgs) => this.onPanelOpen(this.openCatalogs, ev));
    emitter.on(CATALOG_CLOSE_EVENT, (ev: PanelOpenClosesArgs) => this.onPanelClose(this.openCatalogs, ev)); 
    emitter.on(CATALOG_ITEM_DETAILS_OPEN_EVENT, (ev: PanelOpenClosesArgs) => this.onPanelOpen(this.openCatalogItemDetails, ev));
    emitter.on(CATALOG_ITEM_DETAILS_CLOSE_EVENT, (ev: PanelOpenClosesArgs) => this.onPanelClose(this.openCatalogItemDetails, ev));
    emitter.on(SOURCE_OPEN_EVENT, (ev: PanelOpenClosesArgs) => this.onPanelOpen(this.openSources, ev));
    emitter.on(SOURCE_CLOSE_EVENT, (ev: PanelOpenClosesArgs) => this.onPanelClose(this.openSources, ev));
    emitter.on(CATALOG_ITEM_SELECTED_EVENT, (ev: CatalogItemArgs) => {
      this.selectedNode[ev.panelNumber] = ev.node;
    });
    emitter.on(SELECTED_SOURCE_RANGE_EVENT, (ev: SelectedSourceRangeArgs) => {
      this.selectedRange[ev.panelNumber] = ev.source;
    });
  }

  private onPanelOpen(array: number[], ev: PanelOpenClosesArgs) {
    array.push(ev.panelNumber)
  }

  private onPanelClose(array: number[], ev: PanelOpenClosesArgs) {
    array.splice(array.indexOf(ev.panelNumber), 1)
  }

  private openCatalogs = [];
  public get OpenCatalogs(): number[] {
    return this.openCatalogs;
  }

  private openCatalogItemDetails = [];
  public get OpenCatalogItemDetails(): number[] {
    return this.openCatalogItemDetails;
  }

  private openSources = [];
  public get OpenSources(): number[] {
    return this.openSources;
  }

  private selectedNode: PanelValues<CatalogNode | null> = {};
  public get SelectedNode() {
    return this.selectedNode;
  }

  private selectedRange: PanelValues<SourceRefSource | null> = {};
  public get SelectedRange() {
    return this.selectedRange;
  }
}

export var GLOBAL_STATE: GlobalState;

export function initGlobalState(emitter: GoldenLayout.EventEmitter) {
  GLOBAL_STATE = new GlobalState(emitter);
}