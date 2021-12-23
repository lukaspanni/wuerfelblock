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
