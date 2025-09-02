import type { TextStyleConfigType, WeightVariantType, FontFamilyType, FontWeightType } from "./types";

export const TEXT_CONFIG: TextStyleConfigType = {
  /*** Default Values ***/
  defaults: { 
    size: 14,
    color: "#000000",
    weight: "regular",
  },
  
  /*** Font Families ***/
  fontFamily: {
    bold: "Montserrat-Bold",
    black: "Montserrat-Bold",
    light: "Montserrat-Regular",
    medium: "Montserrat-Medium",
    regular: "Montserrat-Regular",
    semiBold: "Montserrat-SemiBold",
  },
  
  /*** Font Weights ***/
  fontWeight: {
    bold: "700",
    light: "300",
    black: "800",
    medium: "500",
    regular: "400",
    semiBold: "600",
  },
};

export type { WeightVariantType, FontFamilyType, FontWeightType };