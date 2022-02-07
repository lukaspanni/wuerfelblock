/* eslint-disable @typescript-eslint/dot-notation */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Category } from 'src/app/model/category';
import { Player } from 'src/app/model/player';

import { CategoryDisplayComponent } from './category-display.component';

describe('CategoryDisplayComponent', () => {
  let component: CategoryDisplayComponent;
  let fixture: ComponentFixture<CategoryDisplayComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CategoryDisplayComponent],
        imports: [IonicModule.forRoot()]
      }).compileComponents();

      fixture = TestBed.createComponent(CategoryDisplayComponent);
      component = fixture.componentInstance;
      component.categories = [];
      component.players = [];
      component.columnWidth = 12;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getPoints should get points from player by category', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['getPoints']);
    const categories = [new Category('test', 10), new Category('test2', 10)];
    component.categories = categories;
    component.players = [playerSpy];

    component.getPoints(playerSpy, categories[0]);
    expect(playerSpy.getPoints).toHaveBeenCalledWith(categories[0]);
    component.getPoints(playerSpy, categories[1]);
    expect(playerSpy.getPoints).toHaveBeenCalledWith(categories[1]);
  });

  it('setPoints should not set points if input validation fails', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    const category = new Category('test', 10, '', undefined, (value) => {
      expect(value).toBe(10); //just check if input validation gets called correctly
      return false;
    });
    const inputSpy = jasmine.createSpyObj('IonInput', [], { value: 10 });
    component.categories = [category];
    component.players = [playerSpy];

    component.setPoints(playerSpy, category, inputSpy);
    expect(playerSpy.setPoints).not.toHaveBeenCalled();
    expect(Object.getOwnPropertyDescriptor(inputSpy, 'value').set as jasmine.Spy).toHaveBeenCalledWith(' ');
  });

  it('setPoints should not set points if input is empty', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    const category = new Category('test', 10, '', undefined, (value) => true);
    const inputSpy = jasmine.createSpyObj('IonInput', [], { value: '' });
    component.categories = [category];
    component.players = [playerSpy];

    component.setPoints(playerSpy, category, inputSpy);
    expect(playerSpy.setPoints).not.toHaveBeenCalled();
    expect(Object.getOwnPropertyDescriptor(inputSpy, 'value').set as jasmine.Spy).toHaveBeenCalledWith(' ');
  });

  it('setPoints should set points if inputValidation succeeds', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    const category = new Category('test', 10, '', undefined, (value) => value == 10);
    const inputSpy = jasmine.createSpyObj('IonInput', [], { value: '10' });
    component.categories = [category];
    component.players = [playerSpy];

    component.setPoints(playerSpy, category, inputSpy);
    expect(playerSpy.setPoints).toHaveBeenCalledWith(category, 10);
  });

  it('init should set checkboxStateMap', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    component.categories = [
      new Category('test', 10, '', 10),
      new Category('test2', 15, '', 15),
      new Category('test3', 20, '')
    ];
    component.players = [playerSpy];
    component.ngAfterViewInit();

    expect(component['checkBoxStateMap'].get(playerSpy)).toEqual(
      new Map([
        ['test', 0],
        ['test2', 0]
      ])
    );
  });

  it('checkboxClicked should set fixed points if checkbox was unchecked', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    const category = new Category('test', 10, '', 10);
    const eventSpy = jasmine.createSpyObj('Event', ['preventDefault']);
    component.categories = [category];
    component.players = [playerSpy];
    component['checkBoxStateMap'].set(playerSpy, new Map([['test', 0]])); // 0 = unchecked

    component.checkboxClicked(playerSpy, category, eventSpy);
    expect(component['checkBoxStateMap'].get(playerSpy).get('test')).toBe(1); // 1 = checked
    expect(playerSpy.setPoints).toHaveBeenCalledWith(category, 10);
  });

  it('checkboxClicked should set points to 0 if checkbox was checked', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    const category = new Category('test', 10, '', 10);
    const eventSpy = jasmine.createSpyObj('Event', ['preventDefault']);
    component.categories = [category];
    component.players = [playerSpy];
    component['checkBoxStateMap'].set(playerSpy, new Map([['test', 1]])); // 1 = checked

    component.checkboxClicked(playerSpy, category, eventSpy);
    expect(component['checkBoxStateMap'].get(playerSpy).get('test')).toBe(2); // 2 = indeterminate
    expect(playerSpy.setPoints).toHaveBeenCalledWith(category, 0);
  });

  it('checkboxClicked should set points to 0 if checkbox was indeterminate', () => {
    const playerSpy: Player = jasmine.createSpyObj('Player', ['setPoints']);
    const category = new Category('test', 10, '', 10);
    const eventSpy = jasmine.createSpyObj('Event', ['preventDefault']);
    component.categories = [category];
    component.players = [playerSpy];
    component['checkBoxStateMap'].set(playerSpy, new Map([['test', 2]])); // 2 = indeterminate

    component.checkboxClicked(playerSpy, category, eventSpy);
    expect(component['checkBoxStateMap'].get(playerSpy).get('test')).toBe(0); // 0 = unchecked
    expect(playerSpy.setPoints).toHaveBeenCalledWith(category, 0);
  });
});
