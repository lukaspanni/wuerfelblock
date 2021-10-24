import { IonInput } from '@ionic/angular';
import { Category } from './category';

export class Points {
  private _value: number;

  public get value(): number {
    return this._value;
  }

  constructor(value: number) {
    if (value > 0) this._value = value;
    else this._value = 0;
  }
}

export class Player {
  private points: Map<Category, Points> = new Map<Category, Points>();

  constructor(public name: string) {}

  public getPoints(category: Category): number {
    if (category.description == null || !this.points.has(category)) return 0; //invalid for filler categories
    return this.points.get(category).value;
  }

  public setPoints(category: Category, eventTarget: EventTarget): void {
    const input = eventTarget as unknown as IonInput;
    const points = Number(input.value);
    if (category.description == null) return; // also invalid for filler categories
    this.points.set(category, new Points(points)); //TODO: validate
  }

  public get totalPoints(): number {
    let sum = 0;
    this.points.forEach((value) => (sum += value.value));
    return sum;
  }
}
