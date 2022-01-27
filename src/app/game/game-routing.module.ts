import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeepGameActiveGuard } from './keep-game-active.guard';
import { GamePage } from './game.page';

const routes: Routes = [
  {
    path: '',
    component: GamePage,
    canDeactivate: [KeepGameActiveGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
