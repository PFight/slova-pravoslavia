import * as GoldenLayout from "golden-layout";
import { initExtraButton } from "../../panels-common/init-extra-button";


export function initEditModeButton(tab: GoldenLayout.Tab, mainClass: string) {
  let editModeButton = initExtraButton(tab, mainClass);
  if (!editModeButton.className.includes("bp3-icon-standard")) {
    editModeButton.className += " bp3-icon-standard bp3-icon-eye-open"; 
    editModeButton.addEventListener("click", () => {
      if (editModeButton) {
        editModeButton.dataset.editMode = editModeButton.dataset.editMode == "true" ? "false" : "true";
        if (editModeButton.dataset.editMode === "true") {
          editModeButton.classList.add('bp3-icon-annotation');
          editModeButton.classList.remove('bp3-icon-eye-open');
        }
        else {
          editModeButton.classList.add('bp3-icon-eye-open');
          editModeButton.classList.remove('bp3-icon-annotation');
        }
      }
    });
  }
  return editModeButton;
}
