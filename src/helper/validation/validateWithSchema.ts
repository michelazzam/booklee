import { z } from "zod";

import { type ValidationResultType } from "./types";

/**
 * Generic validation function using Zod schemas
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result with success status, valid data, or error messages
 */
export async function validateWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): Promise<ValidationResultType<T>> {
  try {
    const validData = await schema.parseAsync(data);

    return {
      success: true,
      data: validData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {} as Record<string, string>;

      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return {
        success: false,
        errors: errors as Partial<Record<keyof T, string>>,
      };
    }

    // Fallback for unexpected errors
    return {
      success: false,
      errors: { _form: "An unexpected error occurred" } as Partial<
        Record<keyof T, string>
      >,
    };
  }
}
