import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Category } from '../model/category';
import { Player } from '../model/player';
import { resultsStorageKey } from '../results/results.page';
import { GameService } from '../services/game.service';
import { PersistenceService } from '../services/persistence/persistence.service';
import { PlayerService } from '../services/player.service';
import { CanLeaveGame } from './keep-game-active.guard';
@Component({
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GamePage implements CanLeaveGame {
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

  public get bonusCategory(): Category {
    return this.gameService.bonusCategory;
  }

  public get gameFinished(): boolean {
    return this.playerService.players.every(
      (player) => player.finishedCategoriesCount == this.gameService.categoryCount
    );
  }

  constructor(
    private playerService: PlayerService,
    private gameService: GameService,
    private persistenceService: PersistenceService,
    private platform: Platform
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnload(): boolean {
    return this.canLeave();
  }

  public canLeave(): boolean {
    return Math.max(...this.players.map((player) => player.totalPoints)) < 1;
  }

  public currentPlacement(player: Player): number {
    const sortedPoints = new Set(this.playerService.players.map((p) => Number(p.totalPoints)).sort((a, b) => b - a));
    return Array.from(sortedPoints).indexOf(player.totalPoints) + 1;
  }

  public subTotalChange(player: Player): void {
    if (player.subTotal(this.topCategories) >= this.gameService.bonusThreshold)
      player.setPoints(this.gameService.bonusCategory, this.gameService.bonusCategory.fixedPoints);
    else player.setPoints(this.gameService.bonusCategory, 0);
  }

  public async saveResults(): Promise<void> {
    const data = this.playerService.export();
    const key = resultsStorageKey + '_' + new Date().getTime();
    if (!this.platform.is('cordova')) {
      //download results
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = key;
      a.click();
      return;
    }

    //TODO: maybe push to existing results array
    // store results on device
    await this.persistenceService.store(key, data);
  }
}
