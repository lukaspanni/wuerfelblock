import { Component, OnInit } from '@angular/core';
import { Player } from '../model/player';
import { PersistenceService } from '../services/persistence/persistence.service';
export const resultsStorageKey = 'Results';

export type GameResult = {
  date: Date;
  points: ResultEntry[];
};

export type ResultEntry = {
  player: string;
  points: number;
};

export type LeaderboardEntry = ResultEntry;

@Component({
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss']
})
export class ResultsPage implements OnInit {
  public storedResults: GameResult[] = [];

  private _leaderboard: LeaderboardEntry[] = [];

  public get leaderboard(): LeaderboardEntry[] {
    return this._leaderboard;
  }

  constructor(private persistenceService: PersistenceService) {}

  public async ngOnInit(): Promise<void> {
    await this.loadStoredResults();
    this.buildLeaderboard();
  }

  public async loadStoredResults(): Promise<void> {
    const keys = await this.persistenceService.keys();
    if (keys == undefined) return;
    const resultPromises = keys
      .filter((key) => key.startsWith(resultsStorageKey))
      .map((key) => this.persistenceService.retrieve(key));
    const results = await Promise.all(resultPromises);
    results.forEach((result) => this.storedResults.push(JSON.parse(result)));
  }

  private buildLeaderboard(): void {
    if (this.storedResults.length == 0) return;
    const playerTotalPoints = this.storedResults
      .flatMap((result) => result.points)
      .map((points) => ({ player: normalizeString(points.player), points: points.points }))
      .reduce(
        (map, element) => map.set(element.player, (map.get(element.player) ?? 0) + element.points),
        new Map<string, number>()
      );
    this._leaderboard = Array.from(playerTotalPoints)
      .sort((a, b) => b[1] - a[1])
      .map((element) => ({ player: element[0], points: element[1] }));
  }
}

const normalizeString = (input: string): string => {
  const lower = input.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};
