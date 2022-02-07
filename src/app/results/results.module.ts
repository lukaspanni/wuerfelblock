import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultsPageRoutingModule } from './results-routing.module';

import { ResultsPage } from './results.page';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ResultsPageRoutingModule],
  declarations: [ResultsPage, LeaderboardComponent]
})
export class ResultsPageModule {}
