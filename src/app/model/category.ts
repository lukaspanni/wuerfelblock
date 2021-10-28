export class Category {
  public filler: boolean;

  constructor(
    public description?: string,
    public maxPoints?: number,
    public fixedPoints?: number
  ) {
    this.filler = description === undefined;
  }

  public equals(other: Category): boolean {
    return this.description === other.description;
  }
}
