import { z } from 'zod';

import { validateWithSchema } from '../validateWithSchema';

import { type ValidationResultType } from '../types';
import type { LoginReqType, SignUpReqType } from '~/src/services';

import { loginSchema, signupSchema } from './schema';

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
