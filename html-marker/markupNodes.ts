import {DefaultTreeNode, DefaultTreeElement, Attribute} from "parse5";
import { IdGenerator } from "./idGenerator";


export function markupNodes(node: DefaultTreeNode, generator: IdGenerator) {
  let element = node as DefaultTreeElement;
  if (element.tagName && !element.attrs.some(x => x.name == "id" && isNaN(x.value as any))) {
    element.attrs = element.attrs.filter(x => x.name != "id");
    element.attrs.push({ name: "id", value: generator.next() });
  }
  if (element.childNodes) {
    for (let child of element.childNodes) {
      markupNodes(child, generator);
    }
  }
}