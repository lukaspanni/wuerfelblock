import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlayerService } from '../services/player.service';

@Injectable({
  providedIn: 'root',
})
export class SetupCompleteGuard implements CanActivate {
  constructor(private router: Router, private playerService: PlayerService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!environment.production) return true;
    //Only allow to go to game if setup is complete
    if (!this.playerService.setupComplete)
      this.router.navigate(['/setup']);

    return true;
  }
}
