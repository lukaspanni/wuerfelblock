import { Injectable } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class MobilePersistenceService extends PersistenceService {
  public ready: Promise<boolean>;

  private storage: Storage | undefined;

  constructor(storage: Storage) {
    super();
    let resolveFunction;
    this.ready = new Promise((resolve) => (resolveFunction = resolve));
    storage.create().then((value) => {
      this.storage = value;
      resolveFunction(true);
    });
  }

  public async store(key: string, data: string): Promise<void> {
    await this.ready;
    await this.storage.set(key, data);
  }

  public async retrieve(key: string): Promise<string> {
    await this.ready;
    const value = await this.storage.get(key);
    if (value != undefined) return value;
    return '';
  }

  public async delete(key: string): Promise<void> {
    await this.ready;
    await this.storage.remove(key);
  }

  public async clear(): Promise<void> {
    await this.ready;
    await this.storage.clear();
  }

  public async keys(): Promise<string[]> {
    await this.ready;
    return this.storage.keys().catch(() => []);
  }
}
