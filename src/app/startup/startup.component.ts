import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent {
  constructor(private router: Router) {}

  public startSetup(): void {
    this.router.navigateByUrl('/setup');
  }

  public showResults(): void {
    this.router.navigateByUrl('/results');
  }
}
