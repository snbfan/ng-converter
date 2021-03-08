import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject} from 'rxjs';
import { catchError, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';

import { BackendCommunicationService} from '../../core/services/backend-communication.service';
import { ApiRatesCollection, CurrencyPair, NgxChartDataCollection } from '../../types';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public amount: FormControl;
  public fromCurrency: FormControl;
  public toCurrency: FormControl;

  public convertedResult: string;
  public rates: ApiRatesCollection;
  public exchangeHistory$: Observable<NgxChartDataCollection[]>;
  public labels = {
    title: 'Currency Converter',
    amount: 'Amount:',
    from: 'From:',
    to: 'To:',
    error_required: 'Amount is required',
    error_amount: `That's not a valid amount`,
    converted_amount: 'Converted amount: ',
    swap_currencies: 'Swap currencies'
  };

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private backendCommunicationService: BackendCommunicationService
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.backendCommunicationService.getExchangeRates().pipe(
      catchError((error) => {
        this.form.disable();
        return EMPTY;
      }),
      map(result => {
        this.rates = result.rates;
        this.fromCurrency.setValue(result.base);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  createForm(): FormGroup {
    this.amount = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\d\.\,]+$/)
    ]);
    this.fromCurrency = new FormControl(null, Validators.required);
    this.toCurrency = new FormControl(null, Validators.required);

    return this.formBuilder.group({
      amount: this.amount,
      fromCurrency: this.fromCurrency,
      toCurrency: this.toCurrency,
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.convertCurrencies();
    this.showExchangeHistory();
  }

  convertCurrencies(): void {
    const amount = parseFloat(this.form.value.amount);
    const toCurrency = this.form.value.toCurrency;
    const fromCurrency = this.form.value.fromCurrency;
    const convertedAmount = (amount / this.rates[fromCurrency] * this.rates[toCurrency]).toFixed(2);

    this.convertedResult = `${toCurrency} ${convertedAmount}`;
  }

  showExchangeHistory(): void {
    const currencyPair = [this.form.value.fromCurrency, this.form.value.toCurrency] as CurrencyPair;
    this.exchangeHistory$ = this.backendCommunicationService.getExchangeHistory(currencyPair)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      );
  }

  swapCurrencies(): void {
    const [fromCurrency, toCurrency] = [this.form.value.fromCurrency, this.form.value.toCurrency];
    this.fromCurrency.setValue(toCurrency);
    this.toCurrency.setValue(fromCurrency);
  }
}
