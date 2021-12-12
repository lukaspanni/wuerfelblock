import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SetupCompleteGuard } from './setup-complete.guard';

describe('SetupCompleteGuard', () => {
  let guard: SetupCompleteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(SetupCompleteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
