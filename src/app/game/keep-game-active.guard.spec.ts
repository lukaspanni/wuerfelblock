import { TestBed } from '@angular/core/testing';

import { CanLeaveGame, KeepGameActiveGuard } from './keep-game-active.guard';

describe('KeepGameActiveGuard', () => {
  let guard: KeepGameActiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(KeepGameActiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canDeactivate should return true if called without component', () => {
    expect(guard.canDeactivate(undefined, undefined, undefined, undefined)).toBeTrue();
  });

  it('canDeactivate should return true if component canLeave returns true', () => {
    const component: CanLeaveGame = { canLeave: () => true };
    expect(guard.canDeactivate(component, undefined, undefined, undefined)).toBeTrue();
  });

  it('canDeactivate should show confirm if component canLeave returns false', () => {
    const component: CanLeaveGame = { canLeave: () => false };
    const confirmSpy = spyOn(window, 'confirm');
    guard.canDeactivate(component, undefined, undefined, undefined);
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('canDeactivate should return confirm-result', () => {
    const component: CanLeaveGame = { canLeave: () => false };
    const confirmSpy = spyOn(window, 'confirm');
    confirmSpy.and.returnValue(false);
    expect(guard.canDeactivate(component, undefined, undefined, undefined)).toBeFalse();
    confirmSpy.and.returnValue(true);
    expect(guard.canDeactivate(component, undefined, undefined, undefined)).toBeTrue();
  });
});
