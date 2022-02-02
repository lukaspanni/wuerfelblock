import { Category } from './category';
import { Points } from './points';

export class Player {
  private points: Map<Category, Points> = new Map<Category, Points>();

  constructor(public name: string) {}

  public getPoints(category: Category): number {
    if (!this.points.has(category)) return 0;

    return this.points.get(category).value;
  }

  public get finishedCategoriesCount(): number {
    return this.points.size;
  }

  public setPoints(category: Category, points: number): void {
    if (!category.inputValidation(points)) throw new RangeError('Supplied points value is invalid for this category');
    this.points.set(category, new Points(points));
  }

  public get totalPoints(): number {
    let sum = 0;
    this.points.forEach((value) => (sum += value.value));
    return sum;
  }

  public subTotal(categories: Category[]): number {
    let sum = 0;
    this.points.forEach((value, key) => {
      if (categories.includes(key)) sum += value.value;
    });
    return sum;
  }
}
