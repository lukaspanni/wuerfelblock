import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() public title: string;
  @Input() public backButtonDefaultHref = '/';
  @Input() public hideSettingsButton: boolean;

  constructor(private router: Router) {}

  public ngOnInit(): void {
    this.hideSettingsButton = this.hideSettingsButton !== undefined;
  }

  public navigateToSettings(): void {
    //workaround because routerLink="/settings" is not working
    this.router.navigateByUrl('/settings');
  }
}
