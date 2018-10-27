"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function markupNodes(node, generator) {
    let element = node;
    if (element.tagName && !element.attrs.some(x => x.name == "id" && isNaN(x.value))) {
        element.attrs = element.attrs.filter(x => x.name != "id");
        element.attrs.push({ name: "id", value: generator.next() });
    }
    if (element.childNodes) {
        for (let child of element.childNodes) {
            markupNodes(child, generator);
        }
    }
}
exports.markupNodes = markupNodes;
