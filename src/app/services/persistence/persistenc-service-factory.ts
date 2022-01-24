import { Platform } from '@ionic/angular';
import { BrowserPersistenceService } from './browser-persistence.service';
import { MobilePersistenceService } from './mobile-persistence.service';
import { PersistenceService } from './persistence.service';

let persistenceService = undefined;

export const persistenceServiceFactory = (platform: Platform): PersistenceService => {
  if (persistenceService !== undefined) return persistenceService;
  if (platform.is('cordova') && platform.is('mobile')) return new MobilePersistenceService();
  return new BrowserPersistenceService();
};
