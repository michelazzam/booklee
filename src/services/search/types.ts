import type { DetailedLocation } from '../locations/types';

/*** Search History Types ***/
export type SearchHistoryItemType = {
  query: string;
  at: string;
};
export type GetSearchHistoryResType = {
  ok: boolean;
  history: SearchHistoryItemType[];
};

/*** Search API Types ***/
export type SearchReqType = {
  query: string;
  page?: number;
  limit?: number;
};
export type SearchResType = {
  ok: boolean;
  locations: DetailedLocation[];
};
