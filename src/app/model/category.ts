export type Predicate = (input: number) => boolean;

export class Category {
  constructor(
    public description: string,
    public maxPoints: number,
    public fixedPoints?: number,
    public inputValidation: Predicate = () => true
  ) {}

  public equals(other: Category): boolean {
    return this.description === other.description;
  }
}
