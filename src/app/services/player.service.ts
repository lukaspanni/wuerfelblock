import { Injectable } from '@angular/core';
import { Player } from '../model/player';
import { GameResult as GameResults } from '../results/results.page';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _players: Player[] = [];
  private _setupComplete = false;

  constructor() {}

  public get players(): Player[] {
    return this._players;
  }

  public get setupComplete(): boolean {
    return this._setupComplete;
  }

  public addPlayers(...players: Player[]): void {
    this._players.push(...players);
  }

  public async completeSetup(): Promise<void> {
    if (this.players.length < 1) return;
    this._setupComplete = true;
  }

  public reset(): void {
    this._players = [];
    this._setupComplete = false;
  }

  public export(): string {
    //TODO: - allow export with placement
    //TODO: - allow export in other formats than json
    const playerData = this.players
      .sort((a, b) => a.totalPoints - b.totalPoints)
      .map((p) => ({ player: p.name, points: p.totalPoints }));
    const exportData: GameResults = { date: new Date(), points: playerData };
    return JSON.stringify(exportData);
  }
}
