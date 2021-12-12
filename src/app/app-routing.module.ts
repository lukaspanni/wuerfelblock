import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetupCompleteGuard } from './setup/setup-complete.guard';
import { SetupPageModule } from './setup/setup.module';
import { StartupComponent } from './startup/startup.component';
import { TabContainerPageModule } from './tab-container/tab-container.module';

const routes: Routes = [
  {
    path: 'games',
    loadChildren: (): Promise<TabContainerPageModule | void> =>
      import('./tab-container/tab-container.module').then((m) => m.TabContainerPageModule),
    canActivate: [SetupCompleteGuard]
  },
  {
    path: 'setup',
    loadChildren: (): Promise<SetupPageModule | void> => import('./setup/setup.module').then((m) => m.SetupPageModule)
  },
  {
    path: 'startup',
    component: StartupComponent
  },
  {
    path: '',
    redirectTo: 'startup',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
