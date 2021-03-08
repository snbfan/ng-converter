import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { ConverterComponent } from './converter.component';

import { BackendCommunicationService } from '../../core/services/backend-communication.service';
import { apiRatesResponse, validFormData } from '../../core/testing/fixture';

describe('Component: ConverterComponent', () => {
  let component: ConverterComponent;
  let fixture: ComponentFixture<ConverterComponent>;
  let getExchangeRatesSpy: jasmine.Spy;
  let getExchangeHistorySpy: jasmine.Spy;

  beforeEach(async () => {
    const service = jasmine.createSpyObj('BackendCommunicationService', [
      'getExchangeRates',
      'getExchangeHistory'
    ]);

    apiRatesResponse.rates[apiRatesResponse.base] = 1;
    getExchangeRatesSpy = service.getExchangeRates.and.returnValue(of(apiRatesResponse));
    getExchangeHistorySpy = service.getExchangeHistory.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      declarations: [
        ConverterComponent
      ],
      providers: [
        ConverterComponent,
        FormBuilder,
        { provide: BackendCommunicationService, useValue: service }
      ]
    }).overrideComponent(ConverterComponent, {
      set: {
        template: '<h1>Test ConverterComponent</h1>',
      },
    });

    fixture = TestBed.createComponent(ConverterComponent);
    component = fixture.componentInstance;
  });

  describe('Sanity check', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have class properties set up correctly', () => {
      expect(component.form).toBeUndefined();
      expect(component.convertedResult).toBeUndefined();
      expect(component.rates).toBeUndefined();
      expect(component.exchangeHistory$).toBeUndefined();
      expect(component.amount).toBeUndefined();
      expect(component.fromCurrency).toBeUndefined();
      expect(component.toCurrency).toBeUndefined();
    });
  });

  describe('method: onInit', () => {
    it('should set form correctly OnInit', () => {
      component.ngOnInit();
      expect(getExchangeRatesSpy).toHaveBeenCalled();
      expect(component.form).toBeDefined();
      expect(component.form.valid).toBeFalsy();
      expect(component.form instanceof FormGroup).toBeTrue();
      expect(component.amount instanceof FormControl).toBeTrue();
      expect(component.fromCurrency instanceof FormControl).toBeTrue();
      expect(component.toCurrency instanceof FormControl).toBeTrue();
      expect(component.fromCurrency.value).toEqual(apiRatesResponse.base);
      expect(component.rates).toBeDefined();
    });
  });

  describe('method: createForm', () => {
    it('should return the variable of correct value when called', () => {
      const form = component.createForm();
      expect(form).toBeDefined();
      expect(form instanceof FormGroup).toBeTrue();
    });
  });

  describe('method: submit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return false if form is not valid', () => {
      const result = component.submit();
      expect(result).toBeFalsy();
    });

    it('should call component methods of component if form is valid', () => {
      const spy1 = spyOn(component, 'convertCurrencies');
      const spy2 = spyOn(component, 'showExchangeHistory');

      component.form.setValue(validFormData);
      component.submit();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('Converter form', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should stay invalid - one of the fields is not set', () => {
      component.form.setValue({
        ...validFormData,
        ...{ toCurrency: null }
      });
      expect(component.form.valid).toBeFalse();
    });

    it('should stay invalid - amount is not valid, case 1', () => {
      component.form.setValue({
        ...validFormData,
        ...{ amount: '1-00-0'}
      });
      expect(component.form.valid).toBeFalsy();
    });

    it('should stay invalid - amount is not valid, case 2', () => {
      component.form.setValue({
        ...validFormData,
        ...{ amount: 'asdf'}
      });
      expect(component.form.valid).toBeFalsy();
    });

    it('should become valid if valid input provided', () => {
      component.form.setValue(validFormData);
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('method: convertCurrencies', () => {
    it('should correctly set convertedResult', () => {
      component.ngOnInit();
      component.form.setValue(validFormData);

      const { rates } = apiRatesResponse;
      const converted = (validFormData.amount /
        rates[validFormData.fromCurrency] * rates[validFormData.toCurrency]).toFixed(2);

      component.convertCurrencies();

      const expected = validFormData.toCurrency + ' ' + converted;
      expect(component.convertedResult).toEqual(expected);
    });
  });

  describe('method: showExchangeHistory', () => {
    it('should call getExchangeHistory() method with correct values', () => {
      component.ngOnInit();
      component.form.setValue(validFormData);

      const expectedParams = [validFormData.fromCurrency, validFormData.toCurrency];

      component.showExchangeHistory();
      expect(getExchangeHistorySpy).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('method: swapCurrencies', () => {
    it(`should correctly swap currencies' values`, () => {
      component.ngOnInit();
      component.form.setValue(validFormData);

      component.swapCurrencies();

      expect(component.fromCurrency.value).toEqual(validFormData.toCurrency);
      expect(component.toCurrency.value).toEqual(validFormData.fromCurrency);
    });
  });
});
