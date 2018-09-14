import * as GoldenLayout from "golden-layout";
import { OPEN_CATALOG_EVENT, OpenCatalogEvent } from "./events/open-catalog";
import { CLOSE_CATALOG_EVENT, CloseCatalogEvent } from "./events/close-catalog";
import { GET_GLOBAL_STATE_EVENT } from "./events/get-global-state";
import { GLOBA_STATE_EVENT } from "./events/global-state";

export class GlobalState {
  constructor(emitter: GoldenLayout.EventEmitter) {
    emitter.on(GLOBA_STATE_EVENT, (state: GlobalState) => {
      for (let prop in state) {
        this[prop] = state[prop];
      }
    })
    emitter.emit(GET_GLOBAL_STATE_EVENT);
    emitter.on(GET_GLOBAL_STATE_EVENT, () => {
      emitter.emit(GLOBA_STATE_EVENT, this);
    });

    emitter.on(OPEN_CATALOG_EVENT, 
      (ev: OpenCatalogEvent) => this.openCatalogs.push(ev.catalogNumber));
    emitter.on(CLOSE_CATALOG_EVENT, 
      (ev: CloseCatalogEvent) => this.openCatalogs.splice(this.openCatalogs.indexOf(ev.catalogNumber), 1));    
    
  }

  private openCatalogs = [];
  public get OpenCatalogs(): number[] {
    return this.openCatalogs;
  }
}

export var GLOBAL_STATE: GlobalState;

export function initGlobalState(emitter: GoldenLayout.EventEmitter) {
  GLOBAL_STATE = new GlobalState(emitter);
}