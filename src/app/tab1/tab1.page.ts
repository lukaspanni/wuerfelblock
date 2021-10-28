import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  public get players(): Player[] {
    return this.playerService.players;
  }

  public get categories(): Category[] {
    return this.gameService.gameCategories;
  }

  constructor(
    private playerService: PlayerService,
    private gameService: GameService,
  ) {
  }
}
