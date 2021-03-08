import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ConverterComponent } from './converter.component';
import { ChartModule } from '../chart/chart.module';

@NgModule({
  declarations: [
    ConverterComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [
    ConverterComponent,
  ],
})
export class ConverterModule { }
