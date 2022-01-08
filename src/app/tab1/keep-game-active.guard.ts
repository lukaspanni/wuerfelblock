import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanLeaveGame {
  canLeave(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class KeepGameActiveGuard implements CanDeactivate<CanLeaveGame> {
  canDeactivate(
    component: CanLeaveGame,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component == undefined) return true;
    if (!component.canLeave()) return confirm('Seite wirklich verlassen?');
  }
}
