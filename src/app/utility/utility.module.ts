import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnforceInputMaxDirective } from './enforce-input-max.directive';
import { HideZeroPipe } from './hide-zero.pipe';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [EnforceInputMaxDirective, HideZeroPipe, HeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [EnforceInputMaxDirective, HideZeroPipe, HeaderComponent]
})
export class UtilityModule {}
