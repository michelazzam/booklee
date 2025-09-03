export interface Salon {
  id: string;
  image: string;
  name: string;
  city: string;
  rating: number;
  tag: string;
  isFavorited?: boolean;
}

export const mockSalons = {
  hairAndStyling: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
      name: 'Luxe Locks',
      city: 'Beirut',
      rating: 4.0,
      tag: '1 free service with every sale',
      isFavorited: false,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
      name: 'Hair Couture',
      city: 'Saida',
      rating: 4.5,
      tag: '1 free service with every sale',
      isFavorited: false,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
      name: 'Cedar Salon',
      city: 'Jounieh',
      rating: 4.2,
      tag: '1 free service with every sale',
      isFavorited: true,
    },
  ],
  nails: [
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      name: 'Serenity Spa',
      city: 'Beirut',
      rating: 4.7,
      tag: '1 free service with every sale',
      isFavorited: false,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      name: 'Cedar Bliss Spa',
      city: 'Jounieh',
      rating: 4.5,
      tag: '1 free service with every sale',
      isFavorited: false,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      name: 'Luxe Nails',
      city: 'Beirut',
      rating: 4.3,
      tag: '1 free service with every sale',
      isFavorited: true,
    },
  ],
  barber: [
    {
      id: '7',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
      name: 'Classic Cuts',
      city: 'Beirut',
      rating: 4.6,
      tag: '1 free service with every sale',
      isFavorited: false,
    },
    {
      id: '8',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
      name: "Gentleman's Grooming",
      city: 'Saida',
      rating: 4.4,
      tag: '1 free service with every sale',
      isFavorited: false,
    },
  ],
};
