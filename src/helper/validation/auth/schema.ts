import { z } from 'zod';

import type { LoginReqType, ResetPasswordReqType, SignUpReqType } from '~/src/services';

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

export const loginSchema: z.ZodType<LoginReqType> = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
  email: z
    .email({ message: 'Please enter a valid email address' })
    .min(1, { message: 'Email is required' }),
});

export const signupSchema: z.ZodType<SignUpReqType> = z
  .object({
    password: passwordValidation(),
    salonName: z.string().optional(),
    invitationKey: z.string().optional(),
    role: z.string().min(1, { message: 'Role is required' }),
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

export const resetPasswordSchema: z.ZodType<ResetPasswordReqType> = z
  .object({
    password: passwordValidation(),
    otp: z.string().min(1, { message: 'OTP is required' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
    email: z
      .email({ message: 'Please enter a valid email address' })
      .min(1, { message: 'Email is required' }),
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
