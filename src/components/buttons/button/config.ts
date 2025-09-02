import type { ButtonStylesConfigType, ColorVariantType, ErrorTextStyleType, ButtonVariantType } from "./types";

export const BUTTON_STYLES: ButtonStylesConfigType = {
  /*** Layout & Dimensions ***/
  buttonLayout: {
    height: 47,
    borderRadius: 10,
  },

  /*** Typography ***/
  labelStyle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
    fontFamily: "Inter",
  },

  /*** Color Variants ***/
  variants: {
    default: {
      textColor: "#FFFFFF",
      backgroundColor: "#00B894",
    },
    ghost: {
      textColor: "#00B894",
      backgroundColor: "transparent",
    },
    outline: {
      textColor: "#00B894",
      borderColor: "#00B894",
      backgroundColor: "transparent",
    },
  },

  /*** Error State ***/
  errorText: {
    textColor: "#E81717",
    borderColor: "#E81717",
  },
};
 
export type { ColorVariantType, ErrorTextStyleType, ButtonVariantType };
