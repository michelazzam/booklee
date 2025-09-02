import type { CodeInputsStyles } from "./type";

export const CODE_INPUTS_STYLES: CodeInputsStyles = {
  container: {
    gap: 8,
  },
  box: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 6,
  },
  typography: {
    fontSize: 18,
    letterSpacing: 0.5,
    fontWeight: "600" as const,
    fontFamily: "Inter" as const,
  },
  colors: {
    text: "#FFFFFF",
    placeholder: "rgba(255, 255, 255, 0.4)",
    border: {
      error: "#EF4444",
      filled: "#00B894",
      default: "rgba(255, 255, 255, 0.3)",
    },
  },
};
