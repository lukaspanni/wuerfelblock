import { Platform } from '@ionic/angular';
import { BrowserPersistenceService } from './browser-persistence.service';
import { MobilePersistenceService } from './mobile-persistence.service';
import { PersistenceService } from './persistence.service';
import { Storage } from '@ionic/storage-angular';

let persistenceService;

export const persistenceServiceFactory = (platform: Platform, storage: Storage): PersistenceService => {
  if (persistenceService === undefined)
    if (platform.is('cordova') && platform.is('mobile')) persistenceService = new MobilePersistenceService(storage);
    else persistenceService = new BrowserPersistenceService();

  return persistenceService;
};
