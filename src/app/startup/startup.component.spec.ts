import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { StartupComponent } from './startup.component';

describe('StartupComponent', () => {
  let component: StartupComponent;
  let fixture: ComponentFixture<StartupComponent>;
  let routerSpy: Router;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

      TestBed.configureTestingModule({
        declarations: [StartupComponent],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{ provide: Router, useValue: routerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(StartupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('startSetup should redirect to setup', () => {
    component.startSetup();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/setup');
  });
});
