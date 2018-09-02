import { Injectable, Inject } from '@nestjs/common';
import { CatalogNode } from '@common/models/CatalogNode';
import { SourceFileInfo } from '@common/models/SourceFileInfo';
import { WorshipDigest } from '@common/models/WorshipDigest';
import { Worship } from '@common/models/Worship';
import { WorshipCondition } from '@common/models/WorshipCondition';
import { ConfigService } from './config.service';
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DataFileService {
  constructor(private config: ConfigService) {
  }

  public getCatalog(): CatalogNode[] {
    return this.readFile(this.config.CATALOG_FILE, "[]");
  }
  public saveCatalog(catalog: CatalogNode[]) {
    this.writeFile(this.config.CATALOG_FILE, catalog);
  }

  public getSourceFileInfo(): SourceFileInfo[] {
    return this.readFile(this.config.SOURCE_FILE_INFO_FILE, "[]");
  }
  public saveSourceFileInfo(info: SourceFileInfo[]) {
    this.writeFile(this.config.SOURCE_FILE_INFO_FILE, info);
  }

  public getWorships(): WorshipDigest[] {
    let worships = this.readFile<Worship[]>(this.config.WORSHIPS_FILE, "[]");
    worships.forEach(x => delete x.nodes);
    return worships;
  }

  public getWorship(id: string): Worship | undefined {
    let worships = this.readFile<Worship[]>(this.config.WORSHIPS_FILE, "[]");
    let result = worships.find(x => x.id == id);
    return result;
  }
  public saveWorship(worship: Worship) {
    let worships = this.readFile<Worship[]>(this.config.WORSHIPS_FILE, "[]");
    let index = worships.findIndex(x => x.id == worship.id);
    if (index >= 0) {
      worships[index] = worship;
    } else {
      worships.push(worship);
    }
    this.writeFile(this.config.WORSHIPS_FILE, worships);
  }
  public getWorshipConditions(): WorshipCondition[] {
    return this.readFile(this.config.WORSHIP_CONDITIONS_FILE, "[]");
  }
  public saveWorshipConditions(conditions: WorshipCondition[]) {
    this.writeFile(this.config.WORSHIP_CONDITIONS_FILE, conditions);
  }

  private readFile<T>(fileName: string, defaultContent: string) {
    let fullName = path.join(this.config.DATA_DIR, fileName);
    if (!fs.existsSync(fullName)) {
      fs.writeFileSync(fullName, defaultContent);
    }
    let strContent = fs.readFileSync(fullName, "utf-8");
    return JSON.parse(strContent) as T;
  }

  private writeFile<T>(fileName: string, data: T) {
    let fullName = path.join(this.config.DATA_DIR, fileName);
    let strContent = JSON.stringify(data, undefined, 2);
    fs.writeFileSync(fullName, strContent);
  }
}