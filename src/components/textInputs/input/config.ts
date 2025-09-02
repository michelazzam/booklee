import type { InputStyles } from "./type";


export const INPUT_STYLES: InputStyles = {
  /*** Layout & Dimensions ***/
  layout: {
    borderRadius: 25,
  },

  /*** Typography ***/
  inputText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "400",
  },

  /*** Border Configuration ***/
  border: {
    width: {
      default: 2,
      focused: 2,
    },
    color: {
      error: "#E81717",
      focused: "#000",
      default: "#E5E5E5",
    },
  },

  /*** Color Scheme ***/
  colors: {
    background: "#FFFFFF",
    text: {
      input: "#545454",
      error: "#E81717",
      subText: "#00B894",
      label: {
        default: "#545454",
        focused: "#000000",
      },
    },
    icon: {
      default: "#545454",
      focused: "#000000",
    },
  },

  /*** Dropdown Styling ***/
  dropdown: {
    borderRadius: 25,
    background: "#F5F5F5",
    itemBackground: {
      default: "#F5F5F5",
      focused: "#E0E0E0",
    },
  },
};
