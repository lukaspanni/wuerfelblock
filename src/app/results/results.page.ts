import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '../services/persistence/persistence.service';
import { Leaderboard, LeaderboardEntry } from './leaderboard/leaderboard.component';
export const resultsStorageKey = 'Results';

export type GameResult = {
  date: Date;
  points: ResultEntry[];
};

export type ResultEntry = {
  player: string;
  points: number;
};

@Component({
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss']
})
export class ResultsPage implements OnInit {
  public storedResults: GameResult[] = [];

  private _leaderboardTotalPoints: LeaderboardEntry[] = [];
  private _leaderboardPointsPerGame: LeaderboardEntry[] = [];
  private _leaderboardMaxPointsPerGame: LeaderboardEntry[] = [];

  public get leaderboardTotalPoints(): LeaderboardEntry[] {
    return this._leaderboardTotalPoints;
  }

  public get leaderboardPointsPerGame(): LeaderboardEntry[] {
    return this._leaderboardPointsPerGame;
  }

  public get leaderboardMaxPointsPerGame(): LeaderboardEntry[] {
    return this._leaderboardMaxPointsPerGame;
  }

  constructor(private persistenceService: PersistenceService) {}

  public async ngOnInit(): Promise<void> {
    await this.loadStoredResults();
    this.buildLeaderboards();
  }

  public async loadStoredResults(): Promise<void> {
    const keys = await this.persistenceService.keys();
    if (keys == undefined) return;
    const resultPromises = keys
      .filter((key) => key.startsWith(resultsStorageKey))
      .map((key) => this.persistenceService.retrieve(key));
    const results = await Promise.all(resultPromises);
    results
      .filter((result) => result.length > 0)
      .forEach((result) => this.storedResults.push(this.parseGameResult(result)));
  }

  public async deleteResult(result: GameResult): Promise<void> {
    const key = resultsStorageKey + '_' + result.date.getTime();
    await this.persistenceService.delete(key);
    this.storedResults = this.storedResults.filter((res) => res.date.getTime() !== result.date.getTime());
    this.buildLeaderboards();
  }

  private buildLeaderboards(): void {
    if (this.storedResults.length == 0) return;
    this.buildTotalPointsLeaderboard();
    this.buildPointsPerGameLeaderboard();
    this.buildMaxPointsPerGameLeaderboard();
  }

  private buildTotalPointsLeaderboard(): void {
    const playerTotalPoints = flattenResults(this.storedResults).reduce(
      (map, element) => map.set(element.player, (map.get(element.player) ?? 0) + element.points),
      new Map<string, number>()
    );
    this._leaderboardTotalPoints = computeLeaderboard(playerTotalPoints);
  }

  private buildPointsPerGameLeaderboard(): void {
    const playerPointsPerGame = flattenResults(this.storedResults).reduce(
      (map, element) => map.set(element.player, computeIncrementalAverage(map.get(element.player), element.points)),
      new Map<string, number>()
    );
    this._leaderboardPointsPerGame = computeLeaderboard(playerPointsPerGame);
  }

  private buildMaxPointsPerGameLeaderboard(): void {
    const playerMaxPointsPerGame = flattenResults(this.storedResults).reduce(
      (map, element) => map.set(element.player, Math.max(map.get(element.player) ?? 0, element.points)),
      new Map<string, number>()
    );
    this._leaderboardMaxPointsPerGame = computeLeaderboard(playerMaxPointsPerGame);
  }

  private parseGameResult(result: string): GameResult {
    const gameResult = JSON.parse(result);
    if (gameResult.date !== undefined) gameResult.date = new Date(gameResult.date); // ensure date type
    return gameResult as GameResult;
  }
}

const normalizeString = (input: string): string => {
  const lower = input.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const flattenResults = (results: GameResult[]): ResultEntry[] =>
  results
    .flatMap((result) => result.points)
    .map((points) => ({ player: normalizeString(points.player), points: points.points }));

const computeIncrementalAverage = (mapElement: number | undefined, points: number): number => {
  if (mapElement == undefined) return points;
  return (mapElement + points) / 2;
};

const computeLeaderboard = (pointsMap: Map<string, number>): Leaderboard => {
  const sortedEntries = Array.from(pointsMap).sort((a, b) => b[1] - a[1]);
  return sortedEntries.map((element) => ({
    player: element[0],
    points: element[1],
    placement: sortedEntries.findIndex((el) => el[1] === element[1]) + 1
  }));
};
