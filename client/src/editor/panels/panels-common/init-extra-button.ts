import * as GoldenLayout from "golden-layout";

export function initExtraButton(tab: GoldenLayout.Tab, mainClass: string) {
  let editModeButton = tab.header.controlsContainer[0].querySelector("." + mainClass) as HTMLElement;
  if (!editModeButton) {
    editModeButton = document.createElement("li");
    editModeButton.className = mainClass;
    editModeButton.style.cursor = "pointer";
    editModeButton.style.cssFloat = "left";
    editModeButton.style.fontFamily = "Icons16";
    
    tab.header.controlsContainer.prepend(editModeButton);
  }
  return editModeButton;
}

export function deinitExtraButton(tab: GoldenLayout.Tab, mainClass: string) {
  let editModeButton = tab.header.controlsContainer[0].querySelector("." + mainClass) as HTMLElement;
  if (editModeButton) {
    editModeButton.remove();
  }
}