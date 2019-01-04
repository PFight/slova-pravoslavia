import { WorshipNode } from '@common/models/WorshipNode';

export function getHintText(node: WorshipNode) {
  if (node.sourceRef && node.sourceRef.sources.length > 0) {
    let source = node.sourceRef.sources.find(x => x.language == "chu-gr");
    if (!source) {
      source = node.sourceRef.sources[0];
    }
    if (source.ranges[0] && source.ranges[0].hintText) {
      return " (" + source.ranges[0].hintText + "...)";
    }
  }
  return "";
}
