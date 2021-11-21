import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { UtilityModule } from '../utility/utility.module';
import { CategoryDisplayComponent } from './category-display/category-display.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    UtilityModule,
  ],
  declarations: [Tab1Page, CategoryDisplayComponent],
})
export class Tab1PageModule {}
