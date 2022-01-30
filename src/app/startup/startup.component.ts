import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent {
  public get resultsLinkHidden(): boolean {
    return !this.platform.is('cordova');
  }

  constructor(private router: Router, private platform: Platform) {}

  public startSetup(): void {
    this.router.navigateByUrl('/setup');
  }

  public showResults(): void {
    this.router.navigateByUrl('/results');
  }
}
