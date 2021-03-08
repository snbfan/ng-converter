import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { WindowService } from '../../core/services/window.service';

describe('Component: ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  const innerWidth = 100;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChartComponent
      ],
      providers: [
        ChartComponent,
        { provide: WindowService, useValue: { windowRef: { innerWidth }}}
      ]
    }).overrideComponent(ChartComponent, {
      set: {
        template: '<h1>Test ChartComponent</h1>',
      },
    });

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
  });

  describe('Sanity check:', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have class properties set up correctly', () => {
      expect(component.label).toBeUndefined();
      expect(component.width).toBeUndefined();
      expect(component.chartData).toBeUndefined();
    });
  });

  describe('method: onInit', () => {
    it('should assign values correctly OnInit', () => {
      const chartData = [{ name: 'test' }];
      component.chartData = chartData;
      component.ngOnInit();

      const expectedLabel = `Exchange rate history for ${chartData[0].name} currency pair`;

      expect(component.label).toEqual(expectedLabel);
      expect(component.width).toEqual(innerWidth - 20);
    });
  });
});
