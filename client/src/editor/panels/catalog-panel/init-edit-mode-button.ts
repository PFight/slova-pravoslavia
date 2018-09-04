import * as GoldenLayout from "golden-layout";

export function initEditModeButton(editModeButton: HTMLElement, tab: GoldenLayout.Tab) {
  editModeButton = document.createElement("li");
  editModeButton.className = "edit-mode-button bp3-icon-standard bp3-icon-eye-open";
  editModeButton.style.cursor = "pointer";
  editModeButton.style.cssFloat = "left";
  editModeButton.style.fontFamily = "Icons16";
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
  tab.header.controlsContainer.prepend(editModeButton);
  return editModeButton;
}
