import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { BackendCommunicationService } from './backend-communication.service';
import { SessionStorageService } from './session-storage.service';
import { apiHistoryReponseProcessed, apiHistoryResponse, apiRatesResponse } from '../testing/fixture';
import { CurrencyPair } from '../../types';

describe('Service: Backend Communication Service', () => {
  let backendCommunicationService: BackendCommunicationService;
  let sessionStorageSerive: SessionStorageService;
  let httpClientSpy: { get: jasmine.Spy };
  const currencyPair = ['EUR', 'GBP'];

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    sessionStorageSerive = new SessionStorageService();
    backendCommunicationService = new BackendCommunicationService(httpClientSpy as any, sessionStorageSerive);
  });

  describe('method: getExchangeRates', () => {
    it('should return Observable', () => {
      httpClientSpy.get.and.returnValue(of(null));
      const result = backendCommunicationService.getExchangeRates();
      expect(result instanceof Observable).toBeTruthy();
    });

    it('shouhld fetch data from remote api and process it', () => {
      httpClientSpy.get.and.returnValue(of(apiRatesResponse));
      backendCommunicationService.getExchangeRates().subscribe((res) => {
        expect(res).toBeTruthy();
        expect(res.rates[res.base]).toEqual(1);
      });
    });
  });

  describe('method: getExchangeHistory', () => {
    it('should return Observable', () => {
      spyOn(backendCommunicationService, 'getExchangeHistory').and.returnValue(of([]));
      const result = backendCommunicationService.getExchangeHistory(currencyPair as CurrencyPair);
      expect(result instanceof Observable).toBeTruthy();
    });

    it('should call sessionStorageService.getItem method', () => {
      const getItemSpy = spyOn(sessionStorageSerive, 'getItem').and.returnValue(1);
      backendCommunicationService.getExchangeHistory(currencyPair as CurrencyPair);
      expect(getItemSpy).toHaveBeenCalledWith(currencyPair.join('-'));
    });

    it('should check if sessionStorage contains data and return it', () => {
      const expected = 2;
      spyOn(sessionStorageSerive, 'getItem').and.returnValue(expected);

      backendCommunicationService.getExchangeHistory(currencyPair as CurrencyPair)
        .subscribe((res) => {
          expect(res).toEqual(expected as any);
        });
    });

    it('should call fetchHistoryFromRemote if sessionStorage is empty', () => {
      spyOn(sessionStorageSerive, 'getItem').and.returnValue(null);
      const fetchHistoryFromRemoteSpy = spyOn(backendCommunicationService, 'fetchHistoryFromRemote');
      backendCommunicationService.getExchangeHistory(currencyPair as CurrencyPair);

      expect(fetchHistoryFromRemoteSpy).toHaveBeenCalledWith(currencyPair as CurrencyPair);
    });
  });

  describe('method: fetchHistoryFromRemote', () => {
    it('should return Observable', () => {
      spyOn(backendCommunicationService, 'fetchHistoryFromRemote').and.returnValue(of([]));
      const result = backendCommunicationService.fetchHistoryFromRemote(currencyPair as CurrencyPair);

      expect(result instanceof Observable).toBeTruthy();
    });

    it('should call backend url with correct params', () => {
      const now = Date.now();
      const url = 'https://api.exchangeratesapi.io/history';
      const params = new HttpParams()
        .set('start_at', new Date(now - 86400 * 7 * 1000).toLocaleDateString('en-NL').split('/').reverse().join('-'))
        .set('end_at', new Date(now).toLocaleDateString('en-NL').split('/').reverse().join('-'))
        .set('symbols', currencyPair[1])
        .set('base', currencyPair[0]);

      httpClientSpy.get.and.returnValue(of(apiHistoryResponse));
      backendCommunicationService.fetchHistoryFromRemote(currencyPair as CurrencyPair);

      expect(httpClientSpy.get).toHaveBeenCalledWith(url, { params });
    });

    it('should store retrieved data in sessionStorage', () => {
      const setItemSpy = spyOn(sessionStorageSerive, 'setItem');
      httpClientSpy.get.and.returnValue(of(apiHistoryResponse));

      backendCommunicationService.fetchHistoryFromRemote(currencyPair as CurrencyPair)
        .subscribe((res) => {
          expect(setItemSpy).toHaveBeenCalledWith(currencyPair.join('-'), apiHistoryReponseProcessed);
        });
    });
  });
});
