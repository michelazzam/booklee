/*** Favorite types ***/
export type Favorite = {
  _id: string;
  slug: string;
  name: string;
  logo: string;
  city: string;
  tags: string[];
};

/*** Add to favorites request type ***/
export type AddToFavoritesReqType = {
  locationId: string;
};

/*** Add to favorites response type ***/
export type AddToFavoritesResType = {
  ok: boolean;
  message?: string;
};

/*** Get favorites response type ***/
export type GetFavoritesResType = {
  ok: boolean;
  favorites: Favorite[];
};

/*** Remove from favorites request type ***/
export type RemoveFromFavoritesReqType = {
  locationId: string;
};

/*** Remove from favorites response type ***/
export type RemoveFromFavoritesResType = {
  ok: boolean;
  message?: string;
};
