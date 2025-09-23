/*** Location Types ***/
export type LocationGeolocationType = {
  lng: number;
  lat: number;
};
export type LocationOperatingHoursType = {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
};
export type LocationType = {
  _id: string;
  slug: string;
  name: string;
  logo: string;
  city: string;
  tags: string[];
};
export type LocationCategoryType = {
  _id: string;
  title: string;
  slug: string;
  locations: LocationType[];
};
export type DetailedLocationType = {
  _id: string;
  slug: string;
  name: string;
  city: string;
  logo?: string;
  price: string;
  main: boolean;
  phone?: string;
  rating: number;
  tags: string[];
  address: string;
  teamSize: number;
  photos: string[];
  bookable: boolean;
  categoryId: string;
  locationServices: LocationService[];
  geo: LocationGeolocationType;
  category: LocationCategoryType;
  operatingHours: LocationOperatingHoursType;
};

/*** Get Locations API Types ***/
export type GetLocationsReqType = {
  city?: string;
  geo?: boolean;
  distance?: number;
  category?: string;
  bookable?: boolean;
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  operatingHours?: boolean;
  locationServices?: boolean;
};
export type GetLocationsResType = {
  locations: LocationType[];
};
export type GetLocationsCategorizedResType = {
  categories: LocationCategoryType[];
};
export type GetLocationByIdResType = {
  ok: boolean;
  location: DetailedLocationType;
};

/*** Search History Types ***/
export type SearchHistoryType = {
  at: string;
  query: string;
};
export type GetSearchHistoryResType = {
  ok: boolean;
  history: SearchHistoryType[];
};

/*** Search API Types ***/
export type SearchReqType = {
  query: string;
  page?: number;
  limit?: number;
};
export type SearchResType = {
  ok: boolean;
  locations: DetailedLocationType[];
};

/*** Delete Search History API Types ***/
export type DeleteSearchHistoryResType = {
  ok: boolean;
};

/*** Location Service Types ***/
export type LocationService = {
  id: string;
  service: {
    name: string;
  };
  price: {
    type: 'fixed' | 'range' | 'starting';
    value?: number;
    min?: number;
    max?: number;
  };
  duration: number;
};
