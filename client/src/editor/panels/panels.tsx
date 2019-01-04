import { PanelDescription } from './panel-description';
import React from 'react';
import { CatalogIcon } from './catalog-panel/helpers/catalog-icon';
import { SourceIcon } from './source-panel/source-icon';
import { WorshipIcon } from './worship-panel/worship-icon';
import { ConditionsIcon } from './conditions-panel/conditions-icon';
import GoldenLayout from "golden-layout";
import { CatalogPanel } from './catalog-panel/catalog-panel';
import { ConditionsPanel } from './conditions-panel/conditions-panel';
import { WorshipPanel } from './worship-panel/worship-panel';
import { SourcePanel } from './source-panel/source-panel';
import { CatalogItemDetailsPanel } from './catalog-item-details-panel/catalog-item-details-panel';

export const CATALOG_COMPONENT_NAME = "catalog";
export const CATALOG_ITEM_DETAILS_COMPONENT_NAME = "catalog-item-details";
export const SOURCE_COMPONENT_NAME = "source";
export const WORSHIP_COMPONENT_NAME = "worship";
export const WORSHIP_CONDITIONS_COMPONENT_NAME = "worship-conditions";

export const CATALOG_PANEL: PanelDescription = {
  description: "Каталог богослужебных книг",
  config: {
    type: "column",
    width: 20,
    content: [
      {
        component: CATALOG_COMPONENT_NAME,
        title: "Каталог",
        height: 80,
        type: "react-component"
      },
      {
        component: CATALOG_ITEM_DETAILS_COMPONENT_NAME,
        title: "Содержимое элемента",
        height: 20,    
        type: "react-component"
      }
    ]
  },
  iconRender: () => <CatalogIcon />
};
export const SOURCE_PANEL: PanelDescription = {
  description: "Тексты богослужебных книг",
  config: {
    component: SOURCE_COMPONENT_NAME,
    title: "Тексты",
    width: 60,
    type: "react-component"
  },
  iconRender: () => <SourceIcon />
};
export const WORSHIP_PANEL: PanelDescription = {
  description: "Редактор богослужения",
  config: {
    component: WORSHIP_COMPONENT_NAME,
    title: "Богослужение",
    width: 20,
    type: "react-component"
  },
  iconRender: () => <WorshipIcon />
};
export const CONDITIONS_PANEL: PanelDescription = {
  description: "Редактор условий варьирования богослужений",
  config: {
    component: WORSHIP_CONDITIONS_COMPONENT_NAME,
    title: "Условия варьирования",
    width: 20,
    type: "react-component"
  },
  iconRender: () => <ConditionsIcon />
};
export const PANELS: PanelDescription[] = [
  CATALOG_PANEL,
  SOURCE_PANEL,
  WORSHIP_PANEL,
  CONDITIONS_PANEL
]

export function registerPanels(layout: GoldenLayout) {
  layout.registerComponent(CATALOG_COMPONENT_NAME, CatalogPanel);
  layout.registerComponent(CATALOG_ITEM_DETAILS_COMPONENT_NAME, CatalogItemDetailsPanel);
  layout.registerComponent(SOURCE_COMPONENT_NAME, SourcePanel);
  layout.registerComponent(WORSHIP_COMPONENT_NAME, WorshipPanel);
  layout.registerComponent(WORSHIP_CONDITIONS_COMPONENT_NAME, ConditionsPanel);
}