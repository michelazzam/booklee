import { z } from 'zod';
import { isValidPhoneNumber, getCountryByCca2 } from 'react-native-international-phone-number';

import type { LoginReqType, SignUpReqType } from '~/src/services';

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

export const loginSchema: z.ZodType<LoginReqType> = z
  .object({
    password: passwordValidation(),
    phone: phoneNumberValidation().optional(),
    email: z
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' })
      .optional(),
  })
  .refine(
    (data) => {
      return data.email || data.phone;
    },
    {
      path: ['email'],
      message: 'Either email or phone number is required',
    }
  );

export const signupSchema: z.ZodType<SignUpReqType> = z
  .object({
    password: passwordValidation(),
    phone: phoneNumberValidation(),
    salonName: z.string().optional(),
    invitationKey: z.string().optional(),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
    email: z
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' }),
    firstName: z
      .string()
      .min(1, { message: 'First name is required' })
      .min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z
      .string()
      .min(1, { message: 'Last name is required' })
      .min(2, { message: 'Last name must be at least 2 characters' }),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return passwordMatchValidation(password, confirmPassword);
    },
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    }
  );
