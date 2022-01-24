import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { persistenceServiceFactory } from './services/persistence/persistence-service-factory';
import { PersistenceService } from './services/persistence/persistence.service';
import { StartupComponent } from './startup/startup.component';

@NgModule({
  declarations: [AppComponent, StartupComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: PersistenceService, useFactory: persistenceServiceFactory, deps: [Platform] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
