import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[max]',
})
export class EnforceInputMaxDirective implements OnChanges{
  @Input() public max: number;
  @Input() public input: number

  constructor(private element: ElementRef) {}

  public ngOnChanges(){
    if(Number(this.input) > Number(this.max)){
      //just force the element to adhere to maximum value
      this.element.nativeElement.value = this.max;
    }
  }
  
}
