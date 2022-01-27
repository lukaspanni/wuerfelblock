import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GamePage } from './game.page';

import { GameRoutingModule } from './game-routing.module';
import { UtilityModule } from '../utility/utility.module';
import { CategoryDisplayComponent } from './category-display/category-display.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, GameRoutingModule, UtilityModule],
  declarations: [GamePage, CategoryDisplayComponent]
})
export class GameModule {}
