import { WorshipNode, Speakers } from '@common/models/WorshipNode';

export function getSpeakerTitle(speaker: Speakers | undefined) {
  switch (speaker) {
    case "choir": return "Клирос";
    case "deacon": return "Диакон";
    case "people": return "Прихожане";
    case "priest": return "Священник";
    case "sexton": return "Алтарник";
    default: return speaker;
  }
}
