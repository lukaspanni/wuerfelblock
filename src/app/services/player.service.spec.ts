import { TestBed } from '@angular/core/testing';
import { Player } from '../model/player';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('addPlayers single player should append to player Array', () => {
    expect(service.players.length).toBe(0);
    const player = new Player('TEST');
    service.addPlayers(player);
    const players = service.players;

    expect(players.length).toBe(1);
    expect(players).toEqual([player]);
  });

  it('addPlayers multiple players should append to player Array', () => {
    expect(service.players.length).toBe(0);
    const expectedPlayers = [new Player('TEST'), new Player('TEST2')];
    service.addPlayers(...expectedPlayers);
    const players = service.players;

    expect(players.length).toBe(2);
    expect(players).toEqual(expectedPlayers);
  });

  it('completeSetup should not complete without players', async () => {
    expect(service.players.length).toBe(0);
    expect(service.setupComplete).toBeFalse();

    await service.completeSetup();
    expect(service.setupComplete).toBeFalse();
  });

  it('completeSetup should complete with players set', async () => {
    expect(service.players.length).toBe(0);
    expect(service.setupComplete).toBeFalse();
    service.addPlayers(new Player('TEST'));

    await service.completeSetup();
    expect(service.setupComplete).toBeTrue();
  });

  it('reset should reset properties', async () => {
    service.addPlayers(new Player('TEST'));
    await service.completeSetup();
    expect(service.players.length).toBe(1);
    expect(service.setupComplete).toBeTrue();

    service.reset();
    expect(service.players.length).toBe(0);
    expect(service.setupComplete).toBeFalse();
  });
});
