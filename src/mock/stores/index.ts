import { type Store } from './types';

export const hairAndStyling: Store[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    name: 'Luxe Locks',
    city: 'Beirut',
    rating: 4.0,
    tag: '1 free service with every sale',
    isFavorite: false,
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    ],
    openingHours: 'OPENS SOON @ 09:00',
    provider: 'Beirut',
    about:
      'Luxe Locks is your ultimate destination for premium hairstyling and beauty care in Beirut. We provide expert services tailored to enhance your style.',
    serviceCategories: {
      id: 'hair-styling',
      name: 'HAIR & STYLING',
      services: [
        {
          id: 'blow-dry',
          name: 'Blow-dry',
          price: 'Starting 10$',
          duration: '45 min',
        },
        {
          id: 'hairstyle',
          name: 'Hairstyle',
          price: '15$',
          duration: '45 min',
        },
        {
          id: 'caviar-treatment',
          name: 'Caviar Treatment',
          price: '25$',
          duration: '60 min',
          description:
            'Mask made with caviar extract is applied to the hair, then left to absorb before rinsing and styling.',
        },
      ],
    },
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    name: 'Hair Couture',
    city: 'Saida',
    rating: 4.5,
    tag: 'Exclusive discounts this month',
    isFavorite: false,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    name: 'Cedar Salon',
    city: 'Jounieh',
    rating: 4.2,
    tag: '1 free service with every sale',
    isFavorite: true,
  },
];

export const nails: Store[] = [
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    name: 'Serenity Spa',
    city: 'Beirut',
    rating: 4.7,
    tag: 'Special offer on manicure',
    isFavorite: false,
    about: 'Serenity Spa offers luxurious nail and spa treatments to pamper and rejuvenate.',
    serviceCategories: {
      id: 'nails',
      name: 'NAILS',
      services: [
        {
          id: 'manicure',
          name: 'Classic Manicure',
          price: '12$',
          duration: '30 min',
        },
        {
          id: 'pedicure',
          name: 'Pedicure',
          price: '15$',
          duration: '40 min',
        },
      ],
    },
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    name: 'Cedar Bliss Spa',
    city: 'Jounieh',
    rating: 4.5,
    tag: 'Get 20% off this week',
    isFavorite: false,
  },
];

export const barber: Store[] = [
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
    name: 'Classic Cuts',
    city: 'Beirut',
    rating: 4.6,
    tag: 'Discount for students',
    isFavorite: false,
    about: 'Classic Cuts specializes in modern and traditional men’s grooming services.',
    serviceCategories: {
      id: 'barber',
      name: 'BARBER SERVICES',
      services: [
        {
          id: 'mens-haircut',
          name: "Men's Haircut",
          price: '10$',
          duration: '30 min',
        },
        {
          id: 'beard-trim',
          name: 'Beard Trim',
          price: '5$',
          duration: '15 min',
        },
      ],
    },
  },
];

export const eyebrowsEyelashes: Store[] = [
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    name: 'Harmony Haven Spa',
    city: 'Kasslik',
    rating: 4.9,
    tag: 'Premium eyelash extensions',
    isFavorite: false,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    ],
    openingHours: 'OPENS SOON @ 09:00',
    provider: 'Kasslik',
    about:
      'Welcome to Harmony Haven Spa, where tranquility meets beauty. Our expert team provides exceptional spa services in a serene environment designed to rejuvenate your mind, body, and soul.',
    serviceCategories: {
      id: 'eyebrows',
      name: 'EYEBROWS & EYELASHES',
      services: [
        {
          id: 'eyebrow-shaping',
          name: 'Eyebrow Shaping',
          price: '8$',
          duration: '20 min',
        },
        {
          id: 'eyelash-extensions',
          name: 'Eyelash Extensions',
          price: '25$',
          duration: '60 min',
          description: 'Semi-permanent lashes applied for a natural or glam look.',
        },
      ],
    },
  },
];
