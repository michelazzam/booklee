import { View, StyleSheet, TextInput } from "react-native";
import { useRef, useState, useCallback } from "react";

import { CODE_INPUTS_STYLES } from "./config";

type CodeInputsProps = {
  color?: string;
  length?: number;
  onComplete: (code: string) => void;
  onError?: (hasError: boolean) => void;
};

const CodeInputs = ({
  color,
  onError,
  onComplete,
  length = 6,
}: CodeInputsProps) => {
  /**** Constants ****/
  const { container, box, typography, colors } = CODE_INPUTS_STYLES;

  /**** Refs ****/
  const textInputRefs = useRef<(TextInput | null)[]>([]);

  /**** States ****/
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const [hasPasteError, setHasPasteError] = useState<number | null>(null);

  /**** Memoized Functions ****/
  const getBorderColor = useCallback(
    (index: number) => {
      if (hasPasteError === index) return colors.border.error;
      if (code[index]) return color || colors.border.filled;
      return color || colors.border.default;
    },
    [hasPasteError, code, colors.border, color]
  );
  const getTextColor = useCallback(
    (index: number) => {
      if (hasPasteError === index) return color || colors.border.error;
      return color || colors.text;
    },
    [hasPasteError, colors.text, colors.border.error, color]
  );

  const handleTextChange = useCallback(
    (text: string, index: number) => {
      setHasPasteError(null);
      onError?.(false);

      // Handle copy and paste scenario
      if (text.length > 1) {
        const chars = text.trim().split("").slice(0, length);
        const invalidIndex = chars.findIndex(
          (char, i) => i > 0 && !/^\d+$/.test(char)
        );

        if (invalidIndex !== -1) {
          setHasPasteError(invalidIndex);
          onError?.(true);
          return;
        }

        const newCode = [...chars, ...Array(length - chars.length).fill("")];
        setCode(newCode);

        const focusIndex = chars.length < length ? chars.length : length - 1;
        requestAnimationFrame(() => {
          textInputRefs.current[focusIndex]?.focus();
        });

        if (chars.length === length) {
          requestAnimationFrame(() => onComplete(newCode.join("")));
        }
        return;
      }

      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < length - 1) {
        requestAnimationFrame(() => {
          textInputRefs.current[index + 1]?.focus();
        });
      }

      if (newCode.every((c) => c !== "")) {
        requestAnimationFrame(() => onComplete(newCode.join("")));
      }
    },
    [code, length, onComplete, onError]
  );
  const handleKeyPress = useCallback(
    (e: { nativeEvent: { key: string } }, index: number) => {
      if (e.nativeEvent.key === "Backspace") {
        const newCode = [...code];

        if (code[index]) {
          newCode[index] = "";
          setCode(newCode);
        } else if (index > 0) {
          newCode[index - 1] = "";
          setCode(newCode);
          requestAnimationFrame(() => {
            textInputRefs.current[index - 1]?.focus();
          });
        }
      }
    },
    [code]
  );

  return (
    <View style={[styles.container, { gap: container.gap }]}>
      {code.map((_, index) => (
        <TextInput
          key={index}
          value={code[index]}
          autoFocus={index === 0}
          keyboardType="number-pad"
          maxLength={index === 0 ? length : 1}
          placeholderTextColor={colors.placeholder}
          onKeyPress={(e) => handleKeyPress(e, index)}
          ref={(el) => {
            textInputRefs.current[index] = el;
          }}
          onChangeText={(text) => handleTextChange(text, index)}
          style={[
            styles.box,
            {
              width: box.width,
              height: box.height,
              color: getTextColor(index),
              borderWidth: box.borderWidth,
              fontSize: typography.fontSize,
              borderRadius: box.borderRadius,
              fontWeight: typography.fontWeight,
              fontFamily: typography.fontFamily,
              borderColor: getBorderColor(index),
              letterSpacing: typography.letterSpacing,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default CodeInputs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  box: {
    padding: 0,
    textAlign: "center",
  },
});


