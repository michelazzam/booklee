import { z } from 'zod';
import { isValidPhoneNumber, getCountryByCca2 } from 'react-native-international-phone-number';

import type { UpdateUserReqType } from '~/src/services';

const passwordValidation = () => {
  return z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one capital letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    });
};
const passwordMatchValidation = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    return false;
  } else {
    return true;
  }
};
const phoneNumberValidation = () => {
  return z
    .string()
    .min(1, { message: 'Phone number is required' })
    .refine(
      (value) => {
        if (!value.includes('-')) {
          return false;
        }

        const [cca2, phoneNumber] = value.split('-');
        const countryInfo = getCountryByCca2(cca2);

        if (!countryInfo || !phoneNumber) {
          return false;
        }

        return isValidPhoneNumber(phoneNumber, countryInfo);
      },
      {
        message: 'Please enter a valid phone number',
      }
    );
};

export const updateUserSchema: z.ZodType<UpdateUserReqType> = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  image: z.string().optional().nullable(),
  phone: phoneNumberValidation().optional(),
});
