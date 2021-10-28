import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Player } from '../model/player';
import { PlayerService } from '../services/player.service';

type SetupPlayer = {
  name: string;
};

@Component({
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage {
  public setupPlayers: SetupPlayer[] = [
    { name: '' },
    { name: '' },
    { name: '' },
  ];

  public get playerValid(): boolean {
    return this.playerCount > 0;
  }

  private get players(): Set<SetupPlayer> {
    return new Set(this.setupPlayers.filter((player) => player.name !== ''));
  }

  private get playerCount(): number {
    return this.players.size;
  }

  constructor(
    private playerService: PlayerService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.playerService.reset(); // make sure to start a new game
  }

  public addPlayer(): void {
    this.setupPlayers.push({ name: '' });
  }

  public removePlayer(index: number): void {
    if (
      Number.isInteger(index) &&
      this.setupPlayers.length > index &&
      index >= 0
    ) {
      this.setupPlayers.splice(index, 1);
    }
  }

  public async completePlayerSetup(): Promise<void> {
    enum AlertActionRole {
      ok = 'ok',
      cancel = 'cancel',
    }
    if (this.playerCount === 1) {
      const alert = await this.alertController.create({
        header: 'Warnung',
        subHeader: 'Nur ein Spieler hinzugefügt',
        message: 'Wirklich alleine spielen?',
        buttons: [
          { text: 'Nein', role: AlertActionRole.cancel },
          { text: 'Ja', role: AlertActionRole.ok },
        ],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role === AlertActionRole.cancel) {
        if (this.setupPlayers.length === 1) {
          this.addPlayer();
        }
        return;
      }
    }
    this.playerService.addPlayers(
      ...this.setupPlayers.filter(player => player.name !== '').map((player) => new Player(player.name))
    );
    this.playerService.completeSetup();
    this.router.navigateByUrl('games/tab1');
  }
}
