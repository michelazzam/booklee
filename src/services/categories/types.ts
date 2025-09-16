/*** Category types ***/

export type Category = {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
};

/*** API Response types ***/
export type GetCategoriesResType = {
  categories: Category[];
};

/*** Request types ***/
export type GetCategoriesReqType = {
  // Add any query parameters if needed
};
