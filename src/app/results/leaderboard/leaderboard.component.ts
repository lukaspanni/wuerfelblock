import { Component, Input, OnInit } from '@angular/core';
import { ResultEntry } from '../results.page';

export type LeaderboardEntry = ResultEntry & { placement: number };
export type Leaderboard = LeaderboardEntry[];

@Component({
  selector: 'wb-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  @Input() public leaderboardData: Leaderboard = [];
  @Input() public initialSize = 3;
  @Input() public incrementSize = 3;

  private startIndex = 0;
  private _endIndex = 0;

  public get showDisplayMoreButton(): boolean {
    return this.endIndex - this.startIndex < this.leaderboardData.length;
  }

  public get showDisplayLessButton(): boolean {
    return this.initialSize < this.leaderboardData.length && !this.showDisplayMoreButton;
  }

  public get leaderboardDisplayData(): Leaderboard {
    return this.leaderboardData.slice(this.startIndex, this.endIndex);
  }

  private get endIndex(): number {
    return this._endIndex;
  }

  private set endIndex(index: number) {
    if (index < this.startIndex) return;
    if (index > this.leaderboardData.length) index = this.leaderboardData.length;
    this._endIndex = index;
  }

  constructor() {}

  public ngOnInit(): void {
    this.endIndex = this.initialSize;
  }

  public displayMore(): void {
    this.endIndex = this.endIndex + this.incrementSize;
  }

  public displayInitial(): void {
    this.endIndex = this.initialSize;
  }
}
