import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            IonicStorageModule.forRoot(
              {
                name: '__mydb',
                driverOrder: ['indexeddb', 'sqlite', 'websql']
              }
            ),
            HttpClientModule,
            AppRoutingModule
          ],
  providers: [StatusBar,
              SplashScreen,
             {provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Network],
  bootstrap: [AppComponent],
})
export class AppModule {}
