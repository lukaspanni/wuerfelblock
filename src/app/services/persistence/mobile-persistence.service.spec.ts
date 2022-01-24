import { TestBed } from '@angular/core/testing';

import { MobilePersistenceService } from './mobile-persistence.service';

describe('MobilePersistenceService', () => {
  let service: MobilePersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobilePersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
