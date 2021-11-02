import { IonCheckbox, IonInput } from '@ionic/angular';
import { Category } from './category';

export class Points {
  private _value: number;

  public get value(): number {
    return this._value;
  }

  constructor(value: number) {
    if (value > 0) {this._value = value;}
    else {this._value = 0;}
  }
}

export class Player {
  private points: Map<Category, Points> = new Map<Category, Points>();

  constructor(public name: string) {}

  public getPoints(category: Category): number {
    if (category.description == null || !this.points.has(category)) {return 0;} //invalid for filler categories
    return this.points.get(category).value;
  }

  public setPoints(category: Category, eventTarget: EventTarget): void {
    if (category.description == null) {return;} // also invalid for filler categories
    const input = eventTarget as unknown as IonInput;
    const points = Number(input.value);
    // do not validate because otherwise enforcing in ui wont work
    // better solution for later: two step process, one version (with invalid values allowed) for ui and one valid version for "backend"
    this.points.set(category, new Points(points));
  }

  public setFixedPoints(category: Category, eventTarget: EventTarget): void {
    if (category.fixedPoints == undefined) {return;} //TODO: maybe throw error
    if (category.description == null) {return;} // also invalid for filler categories
    const input = eventTarget as unknown as IonCheckbox;
    if (!input.checked) {
      this.points.set(category, new Points(0));
    } else {this.points.set(category, new Points(category.fixedPoints));}
  }

  public get totalPoints(): number {
    let sum = 0;
    this.points.forEach((value) => (sum += value.value));
    return sum;
  }
}
