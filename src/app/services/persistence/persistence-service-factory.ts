import { Platform } from '@ionic/angular';
import { BrowserPersistenceService } from './browser-persistence.service';
import { MobilePersistenceService } from './mobile-persistence.service';
import { PersistenceService } from './persistence.service';

let persistenceService;

export const persistenceServiceFactory = (platform: Platform): PersistenceService => {
  if (persistenceService === undefined)
    if (platform.is('cordova') && platform.is('mobile')) persistenceService = new MobilePersistenceService();
    else persistenceService = new BrowserPersistenceService();

  return persistenceService;
};
