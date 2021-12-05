import { Injectable } from '@angular/core';
import { Category, Predicate } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _singleNumberCategories: Category[] = [
    new Category('Einser', 5, undefined, getDefaultInputValidation(1)),
    new Category('Zweier', 10, undefined, getDefaultInputValidation(2)),
    new Category('Dreier', 15, undefined, getDefaultInputValidation(3)),
    new Category('Vierer', 20, undefined, getDefaultInputValidation(4)),
    new Category('Fünfer', 25, undefined, getDefaultInputValidation(5)),
    new Category('Sechser', 30, undefined, getDefaultInputValidation(6)),
  ];

  private _complexCategories: Category[] = [
    new Category('Dreierpasch', 30),
    new Category('Viererpasch', 30),
    new Category('Full House', 25, 25),
    new Category('Kleine Straße', 30, 30),
    new Category('Große Straße', 40, 40),
    new Category('Fünferpasch', 50, 50),
    new Category('Chance', 30, 30),
  ];

  public get singleNumberCategories(): Category[] {
    return this._singleNumberCategories;
  }

  public get complexCategories(): Category[] {
    return this._complexCategories;
  }

  constructor() {}
}

const getDefaultInputValidation =
  (base: number): Predicate =>
  (input: number): boolean =>
    input % base === 0;
