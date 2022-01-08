import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupPage } from './setup.page';

const routes: Routes = [
  {
    path: '',
    component: SetupPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupPageRoutingModule {}
