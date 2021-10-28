import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetupCompleteGuard } from './setup/setup-complete.guard';

const routes: Routes = [
  {
    path: 'games',
    loadChildren: () =>
      import('./tab-container/tab-container.module').then(
        (m) => m.TabContainerPageModule
      ),
    canActivate: [SetupCompleteGuard],
  },
  {
    path: 'setup',
    loadChildren: () =>
      import('./setup/setup.module').then((m) => m.SetupPageModule),
  },
  {
    path: '',
    redirectTo: 'setup',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
