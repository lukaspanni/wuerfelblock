import { HideZeroPipe } from './hide-zero.pipe';

describe('HideZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new HideZeroPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform should return space if value is 0', () => {
    const pipe = new HideZeroPipe();
    expect(pipe.transform(0)).toBe(' ');
  });

  it('transform should return string-value if value is not 0', () => {
    const pipe = new HideZeroPipe();
    expect(pipe.transform(10)).toBe('10');
  });
});
