import { Injectable } from '@angular/core';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class MobilePersistenceService extends PersistenceService {
  constructor() {
    super();
  }

  public store(key: string, data: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public retrieve(key: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
