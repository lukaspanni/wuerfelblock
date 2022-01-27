import { TestBed } from '@angular/core/testing';

import { KeepGameActiveGuard } from './keep-game-active.guard';

describe('KeepGameActiveGuard', () => {
  let guard: KeepGameActiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(KeepGameActiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
