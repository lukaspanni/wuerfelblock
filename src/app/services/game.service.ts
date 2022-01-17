import { Injectable } from '@angular/core';
import { Category, Predicate } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _bonusCategory = new Category('Bonus', 35, undefined, 35);
  private _bonusThreshold = 63;

  private _singleNumberCategories: Category[] = [
    new Category('Einser', 5, undefined, undefined, getDefaultInputValidation(1)),
    new Category('Zweier', 10, undefined, undefined, getDefaultInputValidation(2)),
    new Category('Dreier', 15, undefined, undefined, getDefaultInputValidation(3)),
    new Category('Vierer', 20, undefined, undefined, getDefaultInputValidation(4)),
    new Category('Fünfer', 25, undefined, undefined, getDefaultInputValidation(5)),
    new Category('Sechser', 30, undefined, undefined, getDefaultInputValidation(6))
  ];

  private _complexCategories: Category[] = [
    new Category('Dreierpasch', 30, undefined, undefined, (input: number): boolean => input >= 5),
    new Category('Viererpasch', 30, undefined, undefined, (input: number): boolean => input >= 5),
    new Category('Full House', 25, undefined, 25),
    new Category('Kleine Straße', 30, undefined, 30),
    new Category('Große Straße', 40, undefined, 40),
    new Category('Fünferpasch', 50, undefined, 50),
    new Category('Chance', 30, undefined, undefined, (input: number): boolean => input >= 5)
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

  constructor() {}
}

const getDefaultInputValidation =
  (base: number): Predicate =>
  (input: number): boolean =>
    input % base === 0;
