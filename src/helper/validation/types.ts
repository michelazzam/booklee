export type ValidationResultType<T> = {
  data?: T;
  success: boolean;
  errors?: Partial<Record<keyof T, string>>;
};
