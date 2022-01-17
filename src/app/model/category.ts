export type Predicate = (input: number) => boolean;

export class Category {
  constructor(
    public name: string,
    public maxPoints: number,
    public description?: string,
    public fixedPoints?: number,
    public inputValidation: Predicate = (input: number): boolean => Number(input) <= maxPoints
  ) {}

  public equals(other: Category): boolean {
    return this.name === other.name;
  }
}
