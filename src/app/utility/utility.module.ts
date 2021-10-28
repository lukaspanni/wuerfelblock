import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnforceInputMaxDirective } from './enforce-input-max.directive';
import { HideZeroPipe } from './hide-zero.pipe';



@NgModule({
  declarations: [
    EnforceInputMaxDirective,
    HideZeroPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [EnforceInputMaxDirective, HideZeroPipe]
})
export class UtilityModule { }
