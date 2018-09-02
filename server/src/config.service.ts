import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  public readonly DATA_DIR = "./data";
  public readonly CATALOG_FILE = "Catalog.json";
  public readonly SOURCE_FILE_INFO_FILE = "SourceFileInfo.json";
  public readonly WORSHIPS_FILE = "Worships.json";
  public readonly WORSHIP_CONDITIONS_FILE = "WorshipConditions.json";
}