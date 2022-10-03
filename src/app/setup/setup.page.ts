import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Player } from '../model/player';
import { PersistenceService } from '../services/persistence/persistence.service';
import { PlayerService } from '../services/player.service';

type SetupPlayer = {
  name: string;
};

@Component({
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss']
})
export class SetupPage {
  public setupPlayers: SetupPlayer[] = [{ name: '' }, { name: '' }, { name: '' }];

  private readonly lastSetupPlayerStorageKey = 'players';

  constructor(
    private persistenceService: PersistenceService,
    private playerService: PlayerService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.loadPlayers();
  }

  public get playerValid(): boolean {
    return this.playerCount > 0;
  }

  private get playerCount(): number {
    return this.players.size;
  }

  private get players(): Set<SetupPlayer> {
    return new Set(this.setupPlayers.filter((player) => player.name !== ''));
  }

  public async loadPlayers(): Promise<void> {
    const storedPlayers = await this.persistenceService.retrieve(this.lastSetupPlayerStorageKey);
    if (storedPlayers == undefined || storedPlayers === '') return;
    const players = JSON.parse(storedPlayers);
    if (players.length > 0) {
      this.setupPlayers = [];
      players.forEach((player: SetupPlayer) => this.setupPlayers.push(player));
    }
  }

  public addPlayer(): void {
    this.setupPlayers.push({ name: '' });
  }

  public removePlayer(index: number): void {
    if (Number.isInteger(index) && this.setupPlayers.length > index && index >= 0) this.setupPlayers.splice(index, 1);
  }

  public async completePlayerSetup(): Promise<void> {
    enum AlertActionRole {
      ok = 'ok',
      cancel = 'cancel'
    }
    if (this.playerCount === 1) {
      const alert = await this.alertController.create({
        header: 'Warnung',
        subHeader: 'Nur ein Spieler hinzugefügt',
        message: 'Wirklich alleine spielen?',
        buttons: [
          { text: 'Nein', role: AlertActionRole.cancel },
          { text: 'Ja', role: AlertActionRole.ok }
        ]
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role === AlertActionRole.cancel) {
        if (this.setupPlayers.length === 1) this.addPlayer();

        return;
      }
    }
    this.playerService.reset(); // make sure to start a new game
    this.playerService.addPlayers(
      ...this.setupPlayers.filter((player) => player.name !== '').map((player) => new Player(player.name))
    );
    await this.persistenceService.store(this.lastSetupPlayerStorageKey, JSON.stringify(Array.from(this.players)));
    await this.playerService.completeSetup();
    this.router.navigateByUrl('game');
  }
}
