import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideZero'
})
export class HideZeroPipe implements PipeTransform {

  transform(value: number): string {
    if(value === 0) return ' ';
    return value.toString();
  }

}
