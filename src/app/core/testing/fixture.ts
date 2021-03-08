export const apiRatesResponse = {
  rates: {
    CAD: 1.516, HKD: 9.2695, ISK: 152.9, PHP: 58.048, DKK: 7.4363,
    HUF: 366.29, CZK: 26.303, AUD: 1.5565, RON: 4.8813, SEK: 10.1863,
    IDR: 17184.09, INR: 87.2305, BRL: 6.7979, RUB: 88.8807, HRK: 7.5745,
    JPY: 129.3, THB: 36.422, CHF: 1.1066, SGD: 1.6008, PLN: 4.5748, BGN: 1.9558,
    TRY: 8.9502, CNY: 7.7489, NOK: 10.211, NZD: 1.6737, ZAR: 18.2619, USD: 1.1938,
    MXN: 25.3204, ILS: 3.9606, GBP: 0.863, KRW: 1347.11, MYR: 4.8635
  },
  base: 'EUR',
  date: '2000-01-01'
};

export const apiHistoryResponse = {
  rates: {
    '2000-01-02': { GBP: 0.1 },
    '2000-01-03': { GBP: 0.2 },
    '2000-01-04': { GBP: 0.3 },
    '2000-01-05': { GBP: 0.4 },
    '2000-01-06': { GBP: 0.5 }
  },
  start_at: '2000-01-01',
  base: 'EUR',
  end_at: '2000-01-07'
};

export const apiHistoryReponseProcessed = [{
  name: 'EUR-GBP',
  series: [
    {name: '2000-01-02', value: 0.1 },
    {name: '2000-01-03', value: 0.2 },
    {name: '2000-01-04', value: 0.3 },
    {name: '2000-01-05', value: 0.4 },
    {name: '2000-01-06', value: 0.5 }
  ]
}];

export const validFormData = {
  amount: 1,
  fromCurrency: 'EUR',
  toCurrency: 'GBP'
};

