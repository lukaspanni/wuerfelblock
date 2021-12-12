import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1PageModule } from '../tab1/tab1.module';
import { TabContainerPage } from './tab-container.page';

const routes: Routes = [
  {
    path: '',
    component: TabContainerPage,
    children: [
      {
        path: 'tab1',
        loadChildren: (): Promise<void | Tab1PageModule> => import('../tab1/tab1.module').then((m) => m.Tab1PageModule)
      },
      {
        path: '',
        redirectTo: '/games/tab1',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class TabContainerPageRoutingModule {}
