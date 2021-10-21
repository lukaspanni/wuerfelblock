import { Component } from '@angular/core';
import { Category } from '../model/category';
import { Player } from '../model/player';
import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  public players: Player[] = [
    { name: 'Spieler 1' },
    { name: 'Spieler 2' },
    { name: 'Spieler 3' },
    { name: 'Spieler 4' },
    { name: 'Spieler 5' },
    { name: 'Spieler 6' },
  ];

  public categories: Category[] = [
    { description: 'Einser' },
    { description: 'Zweier' },
    { description: 'Dreier' },
    { description: 'Vierer' },
    { description: 'Fünfer' },
    { description: 'Sechser' },
    {},
    { description: 'Dreierpasch' },
    { description: 'Viererpasch' },
    { description: 'Full House' },
    { description: 'Kleine Straße' },
    { description: 'Große Straße' },
    { description: 'Fünferpasch' },
    { description: 'Chance' },
    {},
    { description: 'Summe' },
  ];

  constructor(playerService: PlayerService, gameService: GameService) {}
}
