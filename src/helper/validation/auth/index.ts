import { z } from 'zod';

import { validateWithSchema } from '../validateWithSchema';

import type { LoginReqType, SignUpReqType, ResetPasswordReqType } from '~/src/services';
import { type ValidationResultType } from '../types';

import { loginSchema, resetPasswordSchema, signupSchema } from './schema';

export async function validateLogin(
  data: LoginReqType
): Promise<ValidationResultType<z.infer<typeof loginSchema>>> {
  return await validateWithSchema(loginSchema, data);
}

export async function validateSignup(
  data: SignUpReqType
): Promise<ValidationResultType<z.infer<typeof signupSchema>>> {
  return await validateWithSchema(signupSchema, data);
}

export async function validateResetPassword(
  data: ResetPasswordReqType
): Promise<ValidationResultType<z.infer<typeof resetPasswordSchema>>> {
  return await validateWithSchema(resetPasswordSchema, data);
}
