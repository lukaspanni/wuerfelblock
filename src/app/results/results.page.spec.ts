import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { PersistenceService } from '../services/persistence/persistence.service';

import { ResultsPage } from './results.page';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;
  let persistenceSpy: PersistenceService;

  beforeEach(
    waitForAsync(() => {
      persistenceSpy = jasmine.createSpyObj('PersistenceService', ['store', 'retrieve', 'keys']);
      TestBed.configureTestingModule({
        declarations: [ResultsPage],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{ provide: PersistenceService, useValue: persistenceSpy }]
      }).compileComponents();

      fixture = TestBed.createComponent(ResultsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
