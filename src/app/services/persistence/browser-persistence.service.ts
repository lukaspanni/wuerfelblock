import { Injectable } from '@angular/core';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserPersistenceService extends PersistenceService {
  //TODO: consider localstorage and indexedDB
  private readonly dataRegex = 'data=([0-9a-zA-Z+/=]+)';

  constructor() {
    super();
  }

  public async store(key: string, data: string): Promise<void> {
    const cookieData = this.getCookieData();
    const index = this.findKey(cookieData, key);
    if (index === -1)
      //push new data
      cookieData.data.push({ [key]: data });
    else cookieData.data[index][key] = data;

    const serialized = btoa(JSON.stringify(cookieData));
    document.cookie = 'data=' + serialized;
  }

  public async retrieve(key: string): Promise<string> {
    const cookieData = this.getCookieData();
    const index = this.findKey(cookieData, key);
    if (index === -1) return '';
    return cookieData.data[index][key];
  }

  public async clear(): Promise<void> {
    const date = new Date();
    date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
    document.cookie = 'data=; expires=' + date.toUTCString() + ';';
  }

  private getCookieData(): { data: any[] } {
    //try to get existing data
    const matches = document.cookie.match(this.dataRegex);
    if (matches !== null && matches.length > 0) {
      const dataString = atob(matches[1]);
      return JSON.parse(dataString);
    } else return { data: [] };
  }

  private findKey(cookieData: { data: any[] }, key: string): number {
    return cookieData.data.findIndex((e) => e.hasOwnProperty(key));
  }
}
