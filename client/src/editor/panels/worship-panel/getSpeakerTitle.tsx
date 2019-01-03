import { WorshipNode } from '@common/models/WorshipNode';
export function getSpeakerTitle(node: WorshipNode) {
  switch (node.speaker) {
    case "choir": return "Клирос";
    case "deacon": return "Диакон";
    case "people": return "Прихожане";
    case "priest": return "Священник";
    case "sexton": return "Алтарник";
    default: return node.speaker;
  }
}
