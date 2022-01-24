import { TestBed } from '@angular/core/testing';

import { BrowserPersistenceService } from './browser-persistence.service';

describe('BrowserPersistenceService', () => {
  let service: BrowserPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
