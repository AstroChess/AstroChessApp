import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NbThemeModule, NbLayoutModule, NbButtonModule, NbContextMenuModule, NbMenuModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbButtonModule,
    NbContextMenuModule,
    NbIconModule,
    NbEvaIconsModule,
    NbMenuModule.forRoot(),
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
