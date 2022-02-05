import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { Player } from '../model/player';
import { PersistenceService } from '../services/persistence/persistence.service';

import { GamePage } from './game.page';

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;
  let persistenceSpy: PersistenceService;

  beforeEach(
    waitForAsync(() => {
      persistenceSpy = jasmine.createSpyObj('PersistenceService', ['store', 'retrieve']);
      TestBed.configureTestingModule({
        declarations: [GamePage],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{ provide: PersistenceService, useValue: persistenceSpy }]
      }).compileComponents();

      fixture = TestBed.createComponent(GamePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('canLeave should return true if all players have 0 points', () => {
    const player1 = { totalPoints: 0 };
    const player2 = { totalPoints: 0 };
    spyOnProperty(component, 'players').and.returnValue([player1, player2]);

    expect(component.canLeave()).toBeTrue();
  });

  it('canLeave should return false if not all players have 0 points', () => {
    const player1 = { totalPoints: 1 };
    const player2 = { totalPoints: 0 };
    spyOnProperty(component, 'players').and.returnValue([player1, player2]);

    expect(component.canLeave()).toBeFalse();
  });

  it('gameFinished should return true if every player has finished all categories', () => {
    const player1 = { finishedCategoriesCount: 10 };
    const player2 = { finishedCategoriesCount: 10 };
    (component['gameService'] as any) = { categoryCount: 10 };
    spyOnProperty(component, 'players').and.returnValue([player1, player2]);
    expect(component.gameFinished).toBeTrue();
  });

  it('gameFinished should return false if not every player has finished all categories', () => {
    const player1 = { finishedCategoriesCount: 9 };
    const player2 = { finishedCategoriesCount: 10 };
    (component['gameService'] as any) = { categoryCount: 10 };
    spyOnProperty(component, 'players').and.returnValue([player1, player2]);
    expect(component.gameFinished).toBeFalse();
  });

  it('currentPlacement should return placement determined by totalPoints', () => {
    const player1 = { totalPoints: 9 } as Player;
    const player2 = { totalPoints: 10 } as Player;
    spyOnProperty(component, 'players').and.returnValue([player1, player2]);
    expect(component.currentPlacement(player1)).toBe(2);
    expect(component.currentPlacement(player2)).toBe(1);
  });

  it('currentPlacement should return same placement for equal totalPoints', () => {
    const player1 = { totalPoints: 10 } as Player;
    const player2 = { totalPoints: 10 } as Player;
    const player3 = { totalPoints: 12 } as Player;
    spyOnProperty(component, 'players').and.returnValue([player1, player2, player3]);
    expect(component.currentPlacement(player1)).toBe(2);
    expect(component.currentPlacement(player2)).toBe(2);
  });
});
