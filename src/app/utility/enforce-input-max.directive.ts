import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * Enforce number input to be between 0 and max
 */
@Directive({
  selector: '[max]',
})
export class EnforceInputMaxDirective implements OnChanges{
  @Input() public max: number;
  @Input() public input: number

  constructor(private element: ElementRef) {}

  public ngOnChanges(){
    console.log(`${this.input}: ${this.max}`)
    if(Number(this.input) > Number(this.max)){
      //just force the element to adhere to maximum value
      this.element.nativeElement.value = this.max;
    }
    // if(Number(this.input) < 0){
    //   this.element.nativeElement.value = 0;
    //   return;
    // }
  }
  
}
