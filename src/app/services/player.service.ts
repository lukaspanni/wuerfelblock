import { Injectable } from '@angular/core';
import { Player } from '../model/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _players: Player[] = [];
  private _setupComplete = false;

  public get players(): Player[] {
    return this._players;
  }

  public get setupComplete(): boolean {
    return this._setupComplete;
  }

  constructor() {}

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
    const exportData = this.players.map((p) => ({ player: p.name, points: p.totalPoints }));
    return JSON.stringify(exportData);
  }
}
