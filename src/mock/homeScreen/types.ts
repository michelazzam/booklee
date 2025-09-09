export type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
  description?: string;
};
export type ServiceCategory = {
  id: string;
  name: string;
  services: Service[];
};

export type Store = {
  id: string;
  tag: string;
  name: string;
  city: string;
  image: string;
  rating: number;
  about?: string;
  images?: string[];
  provider?: string;
  isFavorite?: boolean;
  openingHours?: string;
  serviceCategories?: ServiceCategory[];
};
