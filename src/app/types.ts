export interface ApiRatesCollection {
  [key: string]: number;
}

export interface ApiRatesResponse {
  base: string;
  date: string;
  rates: ApiRatesCollection;
}

export interface ApiHistoryResponse {
  base: string;
  end_at: string;
  start_at: string;
  rates: { [key: string]: ApiRatesCollection };
}

export type CurrencyPair = [string, string];

export interface NgxChartDataCollection {
  name: string;
  series: { name: string, value: number }[];
}
