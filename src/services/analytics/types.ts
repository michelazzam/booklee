export type AnalyticsPeriod = '7d' | '3m' | '1y';

export type AnalyticsSeriesItem = {
  start: string;
  label: string;
  value: number;
};

export type AnalyticsServiceItem = {
  serviceId: string;
  name: string;
  revenue: number;
  appointments: number;
};

/*** Get Analytics Request Type ***/
export type GetAnalyticsReqType = {
  period?: AnalyticsPeriod;
  locationId?: string;
  employeeId?: string;
};

/*** Get Analytics Response Type ***/
export type GetAnalyticsResType = {
  ok: boolean;
  period: string;
  granularity: string;
  range: {
    start: string;
    end: string;
  };
  revenue: {
    total: number;
    series: AnalyticsSeriesItem[];
  };
  appointments: {
    total: number;
    series: AnalyticsSeriesItem[];
  };
  services: AnalyticsServiceItem[];
};

