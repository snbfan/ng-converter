import { Component, Input, OnInit } from '@angular/core';
import { WindowService } from '../../core/services/window.service';

@Component({
  selector: 'app-converter-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartData: any;
  public label: string;
  public width: number;

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    this.width = this.windowService.windowRef.innerWidth - 20;
    this.label = `Exchange rate history for ${this.chartData[0].name} currency pair`;
  }
}
