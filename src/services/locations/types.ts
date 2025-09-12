/*** Location/Store types ***/

export type OperatingHours = {
  open: string;
  close: string;
  closed: boolean;
};

export type WeeklyOperatingHours = {
  monday: OperatingHours;
  tuesday: OperatingHours;
  wednesday: OperatingHours;
  thursday: OperatingHours;
  friday: OperatingHours;
  saturday: OperatingHours;
  sunday: OperatingHours;
};

export type Service = {
  _id: string;
  name: string;
  slug: string;
};

export type Price = {
  type: 'fixed' | 'range';
  value: number;
  min?: number;
  max?: number;
};

export type LocationService = {
  id: string;
  service: Service;
  duration: number;
  price: Price;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
};

export type GeoLocation = {
  lng: number;
  lat: number;
};

export type Location = {
  _id: string;
  slug: string;
  name: string;
  operatingHours: WeeklyOperatingHours;
  locationServices: LocationService[];
  category: Category;
  geo: GeoLocation;
};

/*** API Response types ***/
export type GetLocationsResType = {
  ok: boolean;
  data: Location[];
};

/*** Request types ***/
export type GetLocationsReqType = {
  category: string;
};
