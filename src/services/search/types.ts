/*** Search History Types ***/

export type SearchHistoryItem = {
  query: string;
  at: string;
};

export type GetSearchHistoryResType = {
  ok: boolean;
  history: SearchHistoryItem[];
};

export type SearchHistoryReqType = {
  // No specific request parameters needed for getting search history
};

/*** Search API Types ***/

export type SearchReqType = {
  query: string; // Free text to match against name, address, city, and tags
  limit?: number; // Max number of items to return (default: 20)
  page?: number; // Page number (1-based)
};

export type SearchResType = {
  ok: boolean;
  locations: import('../locations/types').DetailedLocation[];
};
