import { TextStyle } from "react-native";

export type WeightVariantType =
  | "bold"
  | "light"
  | "black"
  | "medium"
  | "regular"
  | "semiBold";

export type FontFamilyType = Record<WeightVariantType, string>;
export type FontWeightType = Record<WeightVariantType, TextStyle["fontWeight"]>;

export type TextStyleConfigType= {
  fontFamily: FontFamilyType;
  fontWeight: FontWeightType;
  defaults: {
    size: number;
    color: string;
    weight: WeightVariantType;
  };
};