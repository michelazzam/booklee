import { z } from 'zod';

import { validateWithSchema } from '../validateWithSchema';

import { type ValidationResultType } from '../types';
import type { UpdateUserReqType } from '~/src/services';

import { updateUserSchema } from './schema';

export async function validateUpdateUser(
  data: UpdateUserReqType
): Promise<ValidationResultType<z.infer<typeof updateUserSchema>>> {
  return await validateWithSchema(updateUserSchema, data);
}
