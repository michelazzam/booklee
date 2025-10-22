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
  organization: string;
  geo?: LocationGeolocationType;
};
export type CategoryType = {
  _id: string;
  slug: string;
  title: string;
};
export type LocationCategoryType = CategoryType & {
  locations: LocationType[];
};
export type LocationServiceType = {
  id: string;
  duration: string;
  service: {
    _id: string;
    name: string;
    slug: string;
    category: string;
    categoryId: string;
    description: string;
  };
  price: {
    min: number;
    max: number;
    type: string;
    value: number;
  };
};
export type DetailedLocationType = LocationType & {
  main: boolean;
  phone?: string;
  address: string;
  teamSize: number;
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
export type GetLocationsCategoriesResType = {
  categories: LocationCategoryType[];
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

/*** Location Rating Types ***/
export type LocationReviewLocationType = {
  id: string;
  name: string;
  city: string;
  rating: number;
  totalReviews: number;
};
export type LocationReviewType = {
  rating: number;
  userId: string;
  message: string;
  employees: any[];
  createdAt: string;
  appointmentId: string;
  location: LocationReviewLocationType;
  organization: LocationReviewLocationType;
};
export type LocationRatingSortType = {
  dir: 'asc' | 'desc';
  sort: 'date' | 'value';
};
export type LocationRatingReqType = LocationRatingSortType & {
  limit?: number;
  locationId?: string;
  countOnly?: boolean;
};
export type LocationRatingResType = {
  ok: boolean;
  count: number;
  locationId: string;
  organizationId: string;
  reviews: LocationReviewType[];
  locations: LocationReviewLocationType[];
};

/*** Location Rating Submit API Types ***/
export type LocationRatingSubmitReqType = {
  userId: string;
  rating: number;
  message: string;
  appointmentId: string;
};
export type LocationRatingSubmitResType = {
  ok: boolean;
};

/*** Location Rating Delete API Types ***/
export type LocationRatingDeleteReqType = {
  appointmentId?: string;
};
export type LocationRatingDeleteResType = {
  ok: boolean;
};
