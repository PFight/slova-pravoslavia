import { SourceRef } from "./SourceRef";
import { WorshipNode } from "./WorshipNode";
import { WorshipDigest } from "./WorshipDigest";

/** Богослужение */
export interface Worship extends WorshipDigest { 
  /** Последовательность богослужения. */
  nodes: WorshipNode[];
}