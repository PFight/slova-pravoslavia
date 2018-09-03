import GoldenLayout from "golden-layout";

export interface PanelDescription {
  config: GoldenLayout.ItemConfigType;
  description: string;
  iconRender: () => JSX.Element;
}