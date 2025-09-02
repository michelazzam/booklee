export type ResSuccessType<T> = T & {
  message: string | null;
};

export type ResErrorType<
  T extends object = {
    [Key: string]: string[];
  }
> = {
  message: string;
  status?: number;
  errors: {
    [Key in keyof T]?: string[];
  };
};

export type PaginatedResType<T> = {
  data: T[];
  pagination: {};
};
