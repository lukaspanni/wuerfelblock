import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { PersistenceService } from '../services/persistence/persistence.service';

import { SetupPage } from './setup.page';

describe('SetupPage', () => {
  let component: SetupPage;
  let fixture: ComponentFixture<SetupPage>;
  let persistenceSpy: PersistenceService;

  beforeEach(
    waitForAsync(() => {
      persistenceSpy = jasmine.createSpyObj('PersistenceService', ['store', 'retrieve', 'clear']);
      TestBed.configureTestingModule({
        declarations: [SetupPage],
        imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule],
        providers: [{ provide: PersistenceService, useValue: persistenceSpy }]
      }).compileComponents();

      fixture = TestBed.createComponent(SetupPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
