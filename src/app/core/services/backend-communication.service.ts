import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiHistoryResponse, ApiRatesResponse, CurrencyPair, NgxChartDataCollection } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {
  private remoteApiHost = 'https://api.exchangeratesapi.io/';
  private ratesPath = 'latest';
  private historyPath = 'history';

  constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
  ) {}

  getExchangeRates(): Observable<ApiRatesResponse> {
    return this.http.get<ApiRatesResponse>(this.remoteApiHost + this.ratesPath).pipe(
      map(result => {
        result.rates[result.base] = 1;
        return result;
      })
    );
  }

  getExchangeHistory(currencyPair: CurrencyPair): Observable<NgxChartDataCollection[]> {
    const cachedResult = this.sessionStorageService.getItem(currencyPair.join('-'));

    if (cachedResult) {
      return of(cachedResult);
    } else {
      return this.fetchHistoryFromRemote(currencyPair);
    }
  }

  fetchHistoryFromRemote(currencyPair: CurrencyPair): Observable<NgxChartDataCollection[]> {
    const now = Date.now();
    const start = this.generateApiTimeParam(now - 86400 * 7 * 1000);
    const end = this.generateApiTimeParam(now);

    const params = new HttpParams()
      .set('start_at', start)
      .set('end_at', end)
      .set('symbols', currencyPair[1])
      .set('base', currencyPair[0]);

    return this.http.get<ApiHistoryResponse>(this.remoteApiHost + this.historyPath, { params })
      .pipe(
        catchError(error => EMPTY),
        map(res => this.transformApiData(res, currencyPair)),
        tap(res => this.sessionStorageService.setItem(currencyPair.join('-'), res)),
      );
  }

  private generateApiTimeParam(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-NL')
      .split('/').reverse().join('-');
  }

  private transformApiData(data: ApiHistoryResponse, currencyPair: CurrencyPair): NgxChartDataCollection[] {
    const series = Object.keys(data.rates).sort()
      .map(k => ({ name: k, value: data.rates[k][currencyPair[1]]}));

    return [{ name: currencyPair.join('-'), series }];
  }
}
