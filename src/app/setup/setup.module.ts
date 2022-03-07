import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupPageRoutingModule } from './setup-routing.module';

import { SetupPage } from './setup.page';
import { UtilityModule } from '../utility/utility.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SetupPageRoutingModule, UtilityModule],
  declarations: [SetupPage]
})
export class SetupPageModule {}
