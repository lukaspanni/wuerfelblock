import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
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
  private _resultsStored = false;
  private _inputDisabled = false; // maybe provide reset

  constructor(
    private playerService: PlayerService,
    private gameService: GameService,
    private persistenceService: PersistenceService,
    private alertController: AlertController
  ) {}

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
    return this.players.every((player) => player.finishedCategoriesCount >= this.gameService.categoryCount);
  }

  public get resultsStored(): boolean {
    return this._resultsStored;
  }

  public get inputDisabled(): boolean {
    return this._inputDisabled;
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnload(): boolean {
    return this.canLeave();
  }

  public canLeave(): boolean {
    return Math.max(...this.players.map((player) => player.totalPoints)) < 1;
  }

  public currentPlacement(player: Player): number {
    const sortedPoints = new Set(this.players.map((p) => Number(p.totalPoints)).sort((a, b) => b - a));
    return Array.from(sortedPoints).indexOf(player.totalPoints) + 1;
  }

  public subTotalChange(player: Player): void {
    if (player.subTotal(this.topCategories) >= this.gameService.bonusThreshold)
      player.setPoints(this.gameService.bonusCategory, this.gameService.bonusCategory.fixedPoints);
    else player.setPoints(this.gameService.bonusCategory, 0);
  }

  public async storeResults(): Promise<void> {
    this._resultsStored = false;
    const data = this.playerService.export();
    const key = resultsStorageKey + '_' + new Date().getTime();
    await this.persistenceService.store(key, data);

    await this.showStoredAlert();
    this._inputDisabled = true;
    this._resultsStored = true;
  }

  private async showStoredAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Ergebnisse gespeichert',
      message: 'Die aktuellen Ergebnisse wurden erfolgreich gespeichert',
      buttons: ['OK']
    });

    await alert.present();
  }
}
