import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DataFileService } from './data-file.service';
import { CatalogNode } from '@common/models/CatalogNode';
import { SourceFileInfo } from '@common/models/SourceFileInfo';
import { WorshipDigest } from '@common/models/WorshipDigest';
import { Worship } from '@common/models/Worship';
import { WorshipCondition } from '@common/models/WorshipCondition';
import { DataFileControllerApi } from '@common/server-api/DataFileControllerApi';

@Controller('DataFile')
export class DataFileController implements DataFileControllerApi {
  constructor(private data: DataFileService) {
  }

  @Get('getCatalog') getCatalog(): CatalogNode[] {
    return this.data.getCatalog();
  }
  @Put('saveCatalog') saveCatalog(@Body() catalog: CatalogNode[]) {
    this.data.saveCatalog(catalog);
  }

  @Get('getSourceFileInfo') getSourceFileInfo(): SourceFileInfo[] {
    return this.data.getSourceFileInfo();
  }
  @Put('saveSourceFileInfo') saveSourceFileInfo(@Body() info: SourceFileInfo[]) {
    this.data.saveSourceFileInfo(info);
  }
  @Get('getWorships') getWorships(): WorshipDigest[] {
    return this.data.getWorships();
  }
  @Get('getWorship/:id') getWorship(@Param('id') id: string): Worship | undefined {
    return this.data.getWorship(id);
  }
  @Put('saveWorship') saveWorship(@Body() worship: Worship) {
    this.data.saveWorship(worship);
  }
  @Get('getWorshipConditions') getWorshipConditions(): WorshipCondition[] {
    return this.data.getWorshipConditions();
  }
  @Put('saveWorshipConditions') saveWorshipConditions(@Body() conditions: WorshipCondition[]) {
    this.data.saveWorshipConditions(conditions);
  }
}