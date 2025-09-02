import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

import { useAppSafeAreaInsets } from "~/src/hooks";

type BaseHeaderNavigationProps = {
  children: React.ReactNode;
};
const BaseHeaderNavigation = ({ children }: BaseHeaderNavigationProps) => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();

  return (
    <View style={[styles.componentStyle, { paddingTop: top }]}>{children}</View>
  );
};

export { BaseHeaderNavigation };

type HeaderNavigationProps = {
  title?: string;
  color?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};
const HeaderNavigation = ({
  title,
  leftIcon,
  rightIcon,
  color = "#000000",
}: HeaderNavigationProps) => {
  /*** Constants ***/
  const router = useRouter();

  return (
    <BaseHeaderNavigation>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.iconContainer}
          onPress={() => router.back()}
        >
          {leftIcon ?? <Feather size={32} color={color} name="chevron-left" />}
        </TouchableOpacity>

        <Text numberOfLines={1} style={[styles.title, { color }]}>
          {title}
        </Text>
      </View>

      <View style={styles.iconContainer}>{rightIcon}</View>
    </BaseHeaderNavigation>
  );
};

export default HeaderNavigation;

const styles = StyleSheet.create({
  componentStyle: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    height: 32,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
