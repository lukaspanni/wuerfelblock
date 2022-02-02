import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ResultsAvailableGuard } from './results-available.guard';

describe('ResultsAvailableGuard', () => {
  let guard: ResultsAvailableGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(ResultsAvailableGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
