import { visitDeepWithResult } from 'editor/utils/visitors';
import { CatalogNode } from '@common/models/CatalogNode';

export function getNodeCaption(catalog: CatalogNode[], nodeId: string, includeSpecified: boolean) {
  let caption = "";
  visitDeepWithResult({ children: catalog, data: { caption: "" } } as any, "", "children", (node: CatalogNode, parentResult: string | null) => {
    let currentCaption = (parentResult && (parentResult + ", ") || "") + node.data!.caption;
    if (node.id == nodeId) {
      if (includeSpecified) {
        caption = currentCaption;
      } else {
        caption = parentResult!;
      }
    }
    return currentCaption;
  });
  return caption;
}
