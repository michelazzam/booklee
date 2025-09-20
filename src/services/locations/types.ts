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
  price?: string;
  tags: string[];
  rating?: number;
  photos?: string[];
  geo?: LocationGeolocationType;
};
export type LocationCategoryType = {
  _id: string;
  title: string;
  slug: string;
  locations: LocationType[];
};
export type LocationServiceType = {
  _id: string;
  duration: string;
  service: {
    _id: string;
    name: string;
    slug: string;
  };
  price: {
    min: number;
    max: number;
    type: string;
    value: number;
  };
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
  geo: LocationGeolocationType;
  category: LocationCategoryType;
  locationServices: LocationServiceType[];
  operatingHours: LocationOperatingHoursType;
};

/*** Get Locations API Types ***/
export type GetLocationsReqType = {
  lat?: number;
  lng?: number;
  slug?: string;
  city?: string;
  sort?: string;
  unit?: string;
  title?: string;
  order?: string;
  limit?: number;
  main?: boolean;
  fields?: string;
  category?: string;
  distance?: number;
  bookable?: boolean;
  price_min?: number;
  price_max?: number;
  defaults?: boolean;
  rating_min?: number;
  categories?: boolean;
  title_starts_with?: string;
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
