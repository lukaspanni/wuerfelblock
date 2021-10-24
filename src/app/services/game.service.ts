import { Injectable } from '@angular/core';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _gameCategories: Category[] = [
    new Category('Einser'),
    new Category('Zweier'),
    new Category('Dreier'),
    new Category('Vierer'),
    new Category('Fünfer'),
    new Category('Sechser'),
    new Category(),
    new Category('Dreierpasch'),
    new Category('Viererpasch'),
    new Category('Full House'),
    new Category('Kleine Straße'),
    new Category('Große Straße'),
    new Category('Fünferpasch'),
    new Category('Chance'),
    new Category(),
  ];

  public get gameCategories(): Category[] {
    return this._gameCategories;
  }

  constructor() {}
}
