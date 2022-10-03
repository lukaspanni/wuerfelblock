import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetupCompleteGuard } from './setup/setup-complete.guard';
import { StartupComponent } from './startup/startup.component';

const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then((m) => m.GameModule),
    canActivate: [SetupCompleteGuard]
  },
  {
    path: 'setup',
    loadChildren: () => import('./setup/setup.module').then((m) => m.SetupPageModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./results/results.module').then((m) => m.ResultsPageModule)
  },
  {
    path: 'startup',
    component: StartupComponent
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsPageModule)
  },
  {
    path: '**',
    redirectTo: 'startup',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
