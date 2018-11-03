import { CatalogNode } from '@common/models/CatalogNode';

export const CATALOG_ITEM_SELECTED_EVENT = "CATALOG_ITEM_SELECTED";
export const CATALOG_ITEM_OPENED_EVENT = "CATALOG_ITEM_OPENED_EVENT";
export const CATALOG_ITEM_SOURCES_CHANGED_EVENT = "CATALOG_ITEM_CHANGED";

export interface CatalogItemArgs {
  panelNumber: number;
  node: CatalogNode | null;
}