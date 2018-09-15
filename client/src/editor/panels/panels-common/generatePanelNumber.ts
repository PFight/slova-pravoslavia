export function generatePanelNumber(openPanels: number[]) {
  let panelNumber = 1;
  while (openPanels.indexOf(panelNumber) >= 0) {
    panelNumber++;
  }
  return panelNumber;
}