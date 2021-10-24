import { Injectable } from '@angular/core';
import { Player } from '../model/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private _players: Player[] = [
    new Player('Spieler 1'),
    new Player('Spieler 2'),
    new Player('Spieler 3'),
    new Player('Spieler 4'),
    new Player('Spieler 5'),
    new Player('Spieler 6'),
  ];

  public get players(): Player[] {
    return this._players;
  }

  constructor() {}
}
