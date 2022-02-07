/* eslint-disable @typescript-eslint/dot-notation */

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { ResultsAvailableGuard } from './results-available.guard';

describe('ResultsAvailableGuard', () => {
  let guard: ResultsAvailableGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(ResultsAvailableGuard);
    environment.production = true;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate should return true if platform is cordova', () => {
    guard['platform'] = {
      is: (value) => {
        expect(value).toBe('cordova');
        return true;
      }
    } as Platform;
    expect(guard.canActivate(undefined, undefined)).toBe(true);
  });

  it('canLoad should return true if platform is cordova', () => {
    guard['platform'] = {
      is: (value) => {
        expect(value).toBe('cordova');
        return true;
      }
    } as Platform;
    expect(guard.canLoad(undefined, undefined)).toBe(true);
  });

  it('canActivate should return false if platform is not cordova', () => {
    guard['platform'] = {
      is: (value) => {
        expect(value).toBe('cordova');
        return false;
      }
    } as Platform;
    expect(guard.canActivate(undefined, undefined)).toBe(false);
  });

  it('canLoad should return false if platform is not cordova', () => {
    guard['platform'] = {
      is: (value) => {
        expect(value).toBe('cordova');
        return false;
      }
    } as Platform;
    expect(guard.canLoad(undefined, undefined)).toBe(false);
  });
});
