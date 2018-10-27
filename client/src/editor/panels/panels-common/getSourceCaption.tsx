import { CatalogNode } from '@common/models/CatalogNode';
import { SourceRefSource } from '@common/models/SourceRef';

export function getSourceCaption(selectedNode: CatalogNode, source: SourceRefSource) {
  let result =  selectedNode.data!.caption + " (" + source.language + ")";
  if (source.ranges && source.ranges.length == 1) {
    result += " / " + source.ranges[0].sourceFileId + "." + source.format;
  }
  return result;
}