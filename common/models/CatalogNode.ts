import { SourceRef } from './SourceRef';

export class CatalogNode {
  id!: string;
  /** Ссылка на источник */
  data?: SourceRef;
  /** Идентификатор родительского узла */
  parentId?: string;   
  /** Дочерние узлы */
  children?: CatalogNode[];
  /** Должен ли узел быть раскрыт (показывать дочерние узлы) по умолчанию */
  defaultExpanded?: boolean;
  type!: "book" | "chapter" | "section" | "paragraph" | "service";
}
