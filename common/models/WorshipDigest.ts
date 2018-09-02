import { SourceRef } from "./SourceRef";
import { WorshipNode } from "./WorshipNode";

/** Основная информация о богослужении */
export interface WorshipDigest {
  id: string;
  name?: string;
  description?: string;
  /** Дата, на которую составлено богослужение. */
  date: Date;   
  /** Составители данной расшифровки богослужебных указаний.  */
  authors: string[];
  /** Богослужебные указания, на основе которых составлена служба. */
  basis: SourceRef;
  /** Дата составления данной расшифровки. */
  creationDate: Date;
  /** Дата последнего изменения данной расшифровки. */
  changeDate: Date;
}