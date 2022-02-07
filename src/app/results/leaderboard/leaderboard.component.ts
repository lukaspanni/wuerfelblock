import { Component, Input } from '@angular/core';
import { ResultEntry } from '../results.page';

export type LeaderboardEntry = ResultEntry & { placement: number };
export type Leaderboard = LeaderboardEntry[];

@Component({
  selector: 'wb-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  @Input() public leaderboardData: Leaderboard = [];

  constructor() {}
}
