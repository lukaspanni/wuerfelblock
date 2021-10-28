import { Injectable } from '@angular/core';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _gameCategories: Category[] = [
    new Category('Einser', 5),
    new Category('Zweier', 10),
    new Category('Dreier', 15),
    new Category('Vierer', 20),
    new Category('Fünfer', 25),
    new Category('Sechser', 30),
    new Category(),
    new Category('Dreierpasch', 30),
    new Category('Viererpasch', 30),
    new Category('Full House', undefined, 25),
    new Category('Kleine Straße', undefined, 30),
    new Category('Große Straße', undefined, 40),
    new Category('Fünferpasch', undefined, 50),
    new Category('Chance', 30),
    new Category(),
  ];

  public get gameCategories(): Category[] {
    return this._gameCategories;
  }

  constructor() {}
}
