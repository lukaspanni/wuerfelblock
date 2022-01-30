import { Injectable } from '@angular/core';
import { Category, Predicate } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  //TODO: Rename to CategoryService or combine with PlayerService to new GameService?

  private _bonusCategory = new Category('Bonus', 35, '35 Punkte bei 63 oder mehr', 35);
  private _bonusThreshold = 63;

  private _singleNumberCategories: Category[] = [
    new Category('Einser', 5, 'alle Einser', undefined, getDefaultInputValidation(1)),
    new Category('Zweier', 10, 'alle Zweier', undefined, getDefaultInputValidation(2)),
    new Category('Dreier', 15, 'alle Dreier', undefined, getDefaultInputValidation(3)),
    new Category('Vierer', 20, 'alle Vierer', undefined, getDefaultInputValidation(4)),
    new Category('Fünfer', 25, 'alle Fünfer', undefined, getDefaultInputValidation(5)),
    new Category('Sechser', 30, 'alle Sechser', undefined, getDefaultInputValidation(6))
  ];

  private _complexCategories: Category[] = [
    new Category('Dreierpasch', 30, 'alles zählt', undefined, (input: number): boolean => input >= 5),
    new Category('Viererpasch', 30, 'alles zählt', undefined, (input: number): boolean => input >= 5),
    new Category('Full House', 25, '25 Punkte', 25),
    new Category('Kleine Straße', 30, '30 Punkte', 30),
    new Category('Große Straße', 40, '40 Punkte', 40),
    new Category('Fünferpasch', 50, '50 Punkte', 50),
    new Category('Chance', 30, 'alles zählt', undefined, (input: number): boolean => input >= 5)
  ];

  public get singleNumberCategories(): Category[] {
    return this._singleNumberCategories;
  }

  public get complexCategories(): Category[] {
    return this._complexCategories;
  }

  public get bonusCategory(): Category {
    return this._bonusCategory;
  }

  public get bonusThreshold(): number {
    return this._bonusThreshold;
  }

  public get categoryCount(): number {
    return this._complexCategories.length + this._singleNumberCategories.length + 1;
  }

  constructor() {}
}

const getDefaultInputValidation =
  (base: number): Predicate =>
  (input: number): boolean =>
    input % base === 0;
