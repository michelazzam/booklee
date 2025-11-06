import { UserType } from '~/src/services/auth/types';

export const guestData: UserType = {
  id: 'guest',
  image: null,
  name: 'Guest',
  role: 'guest',
  lastName: 'Guest',
  firstName: 'Guest',
  salonName: 'Guest',
  phone: 'x-x-x-x-x-x',
  approvedByOwner: false,
  email: 'guest@booklee.com',
};
