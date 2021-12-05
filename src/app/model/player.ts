import { IonCheckbox, IonInput } from '@ionic/angular';
import { Category } from './category';

export class Points {
  private _value: number;

  public get value(): number {
    return this._value;
  }

  constructor(value: number) {
    if (value > 0) {
      this._value = value;
    } else {
      this._value = 0;
    }
  }
}

export class Player {
  private points: Map<Category, Points> = new Map<Category, Points>();

  constructor(public name: string) {}

  public getPoints(category: Category): number {
    if (!this.points.has(category)) {
      return 0;
    }
    return this.points.get(category).value;
  }

  public setPoints(category: Category, points: number) {
    this.points.set(category, new Points(points));
  }

  //TODO: Extract UI-Methods from model
  public setPointsUI(category: Category, eventTarget: EventTarget): void {
    const input = eventTarget as unknown as IonInput;
    const points = Number(input.value);
    if (!category.inputValidation(points)) {
      console.log('INVALID', points, category);
      input.value = '';
      return;
    }
    // do not validate because otherwise enforcing in ui wont work
    // better solution for later: two step process, one version (with invalid values allowed) for ui and one valid version for "backend"
    this.setPoints(category, points);
  }

  public get totalPoints(): number {
    let sum = 0;
    this.points.forEach((value) => (sum += value.value));
    return sum;
  }

  public subTotal(categories: Category[]): number {
    let sum = 0;
    this.points.forEach((value, key) => {
      if (categories.includes(key)) {
        sum += value.value;
      }
    });
    return sum;
  }
}
