import { EnforceInputMaxDirective } from './enforce-input-max.directive';

describe('MaxValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new EnforceInputMaxDirective();
    expect(directive).toBeTruthy();
  });
});
