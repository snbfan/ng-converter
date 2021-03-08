import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartComponent } from './chart.component';

@NgModule({
  imports: [
    BrowserModule,
    NgxChartsModule,
  ],
  exports: [
    ChartComponent
  ],
  declarations: [
    ChartComponent
  ]
})
export class ChartModule { }
