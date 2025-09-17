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
export type GetLocationsReqType = {
  geo?: boolean;
  distance?: number;
  category?: string;
  operatingHours?: boolean;
  locationServices?: boolean;
};
export type GetLocationsResType = {
  locations: LocationType[];
};
export type GetLocationsCategorizedResType = {
  categories: LocationCategoryType[];
};
