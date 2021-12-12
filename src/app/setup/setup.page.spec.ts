import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { SetupPage } from './setup.page';

describe('SetupPage', () => {
  let component: SetupPage;
  let fixture: ComponentFixture<SetupPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SetupPage],
        imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule]
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
