import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { ConverterComponent, ConverterModule } from './modules/converter';
import { ChartModule } from './modules/chart/chart.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ChartModule,
    CoreModule,
    ConverterModule
  ],
  bootstrap: [
    ConverterComponent,
  ]
})
export class AppModule { }
