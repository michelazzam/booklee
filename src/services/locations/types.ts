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
  type: 'fixed' | 'range' | 'starting';
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
  city?: string;
  logo?: string;
  rating: number;
  tags?: string[];
  // Fields that are present when defaults: 'full'
  operatingHours: WeeklyOperatingHours;
  locationServices: LocationService[];
  category: Category;
  geo: GeoLocation;
};

// Extended location type for single location API (more detailed)
export type DetailedLocation = {
  _id: string;
  slug: string;
  name: string;
  logo: string;
  address: string;
  city: string;
  phone: string;
  bookable: boolean;
  teamSize: number;
  main: boolean;
  rating: number;
  price: number;
  tags: string[];
  operatingHours: WeeklyOperatingHours;
  photos: string[];
  locationServices: LocationService[];
  categoryId: string;
  category: Category;
  geo: GeoLocation;
};

/*** API Response types ***/
// Response when categories: false (flat list)
export type GetLocationsResType = {
  ok: boolean;
  locations: Location[];
};

// Response when categories: true (grouped by categories)
export type GetLocationsByCategoriesResType = {
  ok: boolean;
  categories: {
    _id: string;
    title: string;
    slug: string;
    locations: Location[];
  }[];
};

// Response for single location API
export type GetLocationByIdResType = {
  ok: boolean;
  location: DetailedLocation;
};

/*** Request types ***/
export type GetLocationsReqType = {
  // Filter parameters
  title?: string; // Filter by name (contains, case-insensitive)
  slug?: string; // Filter by exact slug
  title_starts_with?: string; // Filter by name prefix (case-insensitive)
  category?: string; // Category slug to filter by
  city?: string; // Filter by city (case-insensitive contains)
  categories?: boolean; // If true, returns results grouped by categories; otherwise returns a flat list
  bookable?: boolean; // Filter by bookable flag
  main?: boolean; // Filter by main flag

  // Price filters
  price_min?: number; // Minimum price tier (e.g., 1..3)
  price_max?: number; // Maximum price tier (e.g., 1..3)

  // Rating filter
  rating_min?: number; // Minimum average rating (1..5)

  // Distance filters
  distance?: number; // Max distance from point; requires lat/lng. Defaults to kilometers unless unit is provided
  unit?: 'km' | 'miles'; // Unit for distance filter (default km)
  lng?: number; // Longitude; required when distance is provided or sorting by distance
  lat?: number; // Latitude; required when distance is provided or sorting by distance

  // Pagination
  limit?: number; // Max number of items to return
  page?: number; // Page number (1-based)

  // Sorting
  sort?: string; // Sort field; distance requires lat/lng
  order?: 'asc' | 'desc'; // Optional sort order override when sort has no prefix

  // Fields selection
  fields?: string; // Comma-separated list of fields to include
  defaults?: 'full' | 'minimal'; // Default field selection
};

// Request type for single location by ID
export type GetLocationByIdReqType = {
  id: string;
  byId?: boolean; // Should be true for single location API
};

// Default values for the API request
export const DEFAULT_LOCATIONS_PARAMS: Partial<GetLocationsReqType> = {
  limit: 20,
  page: 1,
  categories: true,
  unit: 'km',
  distance: 5,
  fields: '_id,slug,name,geo,distance,category,operatingHours,locationServices',
  defaults: 'full',
};

// Type guard to check if response is grouped by categories
export const isGroupedByCategories = (
  response: GetLocationsResType | GetLocationsByCategoriesResType
): response is GetLocationsByCategoriesResType => {
  return 'categories' in response;
};

// Helper function to extract all locations from either response type
export const extractAllLocations = (
  response: GetLocationsResType | GetLocationsByCategoriesResType
): Location[] => {
  if (isGroupedByCategories(response)) {
    return response.categories.flatMap((category) => category.locations);
  }
  return response.locations;
};
