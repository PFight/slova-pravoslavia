import { DataFileControllerApi } from '@common/server-api/DataFileControllerApi';
import { Async } from './utils/async';
import { CatalogNode } from '@common/models/CatalogNode';
import { SourceFileInfo } from '@common/models/SourceFileInfo';
import { WorshipDigest } from '@common/models/WorshipDigest';
import { Worship } from '@common/models/Worship';
import { WorshipCondition } from '@common/models/WorshipCondition';
import { SERVER_URL } from './server-url';


export class DataFileController implements Async<DataFileControllerApi> {

  getCatalog = () => this.get<CatalogNode[]>('getCatalog');
  saveCatalog = (catalog: CatalogNode[]) => this.save('saveCatalog', catalog);  
  getSourceFileInfo = () => this.get<SourceFileInfo[]>('getSourceFileInfo');
  saveSourceFileInfo = (info: SourceFileInfo[]) => this.save('saveSourceFileInfo', info);
  getWorships = () => this.get<WorshipDigest[]>('getWorships');
  getWorship = (id: string) => this.get<Worship | undefined>('getWorship', id);
  saveWorship = (worship: Worship) => this.save('saveWorship', worship);
  getWorshipConditions = () => this.get<WorshipCondition[]>('getWorshipConditions');
  saveWorshipConditions = (conditions: WorshipCondition[]) => this.save('saveWorshipConditions', conditions);

  private async get<T>(actionName: string, id?: string): Promise<T> {
    let response = await fetch(SERVER_URL + "/DataFile/" + actionName + (id ? ("/" + id) : ""));
    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  private async save<T>(actionName: string, data: T) {
    let response = await fetch(SERVER_URL + "/DataFile/" + actionName, 
      { body: JSON.stringify(data), method: "PUT", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }});
    if (response.status != 200) {
      throw new Error(await response.text());
    }
  }
}