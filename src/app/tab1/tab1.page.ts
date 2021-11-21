import { Component, ViewEncapsulation } from '@angular/core';
import { Category } from '../model/category';
import { Player } from '../model/player';
import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab1Page {
  public get players(): Player[] {
    return this.playerService.players;
  }

  public get topCategories(): Category[] {
    return this.gameService.singleNumberCategories;
  }

  public get bottomCategories(): Category[] {
    return this.gameService.complexCategories;
  }

  constructor(
    private playerService: PlayerService,
    private gameService: GameService
  ) {}
}
