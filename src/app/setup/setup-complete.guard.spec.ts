import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { PlayerService } from '../services/player.service';

import { SetupCompleteGuard } from './setup-complete.guard';

describe('SetupCompleteGuard', () => {
  let guard: SetupCompleteGuard;
  let playerServiceSpy: PlayerService;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    playerServiceSpy = jasmine.createSpyObj('PlayerService', [], ['setupComplete']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: PlayerService, useValue: playerServiceSpy }]
    });
    guard = TestBed.inject(SetupCompleteGuard);
    navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate should return true in debug-mode', () => {
    environment.production = false;
    expect(guard.canActivate(undefined, undefined)).toBeTrue();
  });

  it('canActivate should return true if setupCompleted', () => {
    (Object.getOwnPropertyDescriptor(playerServiceSpy, 'setupComplete').get as jasmine.Spy).and.returnValue(true);
    environment.production = true;
    expect(guard.canActivate(undefined, undefined)).toBeTrue();
  });

  it('canActivate should return false and redirect if setup not completed', () => {
    (Object.getOwnPropertyDescriptor(playerServiceSpy, 'setupComplete').get as jasmine.Spy).and.returnValue(false);
    navigateSpy.and.returnValue(Promise.resolve(true));
    environment.production = true;
    expect(guard.canActivate(undefined, undefined)).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/setup']);
  });
});
