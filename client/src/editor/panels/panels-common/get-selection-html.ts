export function getSelectionHtml(sel: Selection, document: Document) {
  var html = "";
  if (sel.rangeCount) {
    var container = document.createElement("div");
    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
      container.appendChild(sel.getRangeAt(i).cloneContents());
    }
    html = container.innerHTML;
  } 
  return html;
}