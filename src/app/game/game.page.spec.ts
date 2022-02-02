import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
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
});
