import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GameModule } from './game/game.module';
import { ResultsPageModule } from './results/results.module';
import { SetupCompleteGuard } from './setup/setup-complete.guard';
import { SetupPageModule } from './setup/setup.module';
import { StartupComponent } from './startup/startup.component';

const routes: Routes = [
  {
    path: 'game',
    loadChildren: (): Promise<GameModule | void> => import('./game/game.module').then((m) => m.GameModule),
    canActivate: [SetupCompleteGuard]
  },
  {
    path: 'setup',
    loadChildren: (): Promise<SetupPageModule | void> => import('./setup/setup.module').then((m) => m.SetupPageModule)
  },
  {
    path: 'results',
    loadChildren: (): Promise<ResultsPageModule | void> =>
      import('./results/results.module').then((m) => m.ResultsPageModule)
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
