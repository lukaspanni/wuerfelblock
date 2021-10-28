import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnforceInputMaxDirective } from './enforce-input-max.directive';



@NgModule({
  declarations: [
    EnforceInputMaxDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [EnforceInputMaxDirective]
})
export class UtilityModule { }
