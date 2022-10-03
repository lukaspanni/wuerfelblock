export class Points {
  private _value: number;

  constructor(value: number) {
    if (value > 0) this._value = value;
    else this._value = 0;
  }

  public get value(): number {
    return this._value;
  }
}
