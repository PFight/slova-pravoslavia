import { SourceRef } from './SourceRef';

/** Блок богослужебного текста. */
export interface WorshipNode {
  /** Ссылка на текст в источнике */
  sourceRef: SourceRef;
  /** Ближайший узел каталога */
  catalogNodeId: string;
  /** Соответствующий фрагмент из богослужебных указаний. Например "На «Господи, воззвах» стихиры на 10". */
  basis: SourceRef;
  /** Порядок в ходе богослужения. */
  order: number;
  /** Идентификатор условия, при котором данный узел включается в богослужение. */
  conditionId?: string;
  /** Комментарий составителя. */
  comment?: string;
}