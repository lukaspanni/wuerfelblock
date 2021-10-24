export class Category {
  constructor(public description?: string) {}

  public equals(other: Category): boolean {
    return this.description === other.description;
  }
}
