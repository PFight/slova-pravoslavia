import { CatalogNode } from "@common/models/CatalogNode";
import { SourceFileInfo } from "@common/models/SourceFileInfo";
import { WorshipDigest } from "@common/models/WorshipDigest";
import { Worship } from "@common/models/Worship";
import { WorshipCondition } from "@common/models/WorshipCondition";

export interface DataFileControllerApi {
  getCatalog(): CatalogNode[];
  saveCatalog(catalog: CatalogNode[]): void;
  getSourceFileInfo(): SourceFileInfo[];
  saveSourceFileInfo(info: SourceFileInfo[]): void;
  getWorships(): WorshipDigest[];
  getWorship(id: string): Worship | undefined;
  saveWorship(worship: Worship): void;
  getWorshipConditions(): WorshipCondition[];
  saveWorshipConditions(conditions: WorshipCondition[]): void;
}