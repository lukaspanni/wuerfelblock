import { Component, ViewEncapsulation } from '@angular/core';
import { Category } from '../model/category';
import { Player } from '../model/player';
import { GameService } from '../services/game.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab1Page {
  public bonus = new Category('Bonus', 35, 35);
  private bonusThreshold = 63;

  public get players(): Player[] {
    return this.playerService.players;
  }

  public get topCategories(): Category[] {
    return this.gameService.singleNumberCategories;
  }

  public get bottomCategories(): Category[] {
    return this.gameService.complexCategories;
  }

  public get columnWidth(): number {
    return 12 / (this.players.length + 1);
  }

  constructor(private playerService: PlayerService, private gameService: GameService) {}

  public currentPlacement(player: Player): number {
    const uniquePoints = new Set(this.playerService.players.map((player) => player.totalPoints));
    const pointsSorted = Array.from(uniquePoints).sort().reverse();
    return pointsSorted.indexOf(player.totalPoints) + 1;
  }

  public subTotalChange(player: Player): void {
    if (player.subTotal(this.topCategories) >= this.bonusThreshold)
      player.setPoints(this.bonus, this.bonus.fixedPoints);
    else player.setPoints(this.bonus, 0);
  }
}
