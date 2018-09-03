import * as GoldenLayout from "golden-layout";
import { CATALOG_PANEL, SOURCE_PANEL, WORSHIP_PANEL } from "../panels/panels";

export const DEFAULT_CONFIG: GoldenLayout.Config = {
  content: [{
    type: "row",
    content: [
      CATALOG_PANEL.config,
      SOURCE_PANEL.config,
      WORSHIP_PANEL.config
    ]
  }]
}