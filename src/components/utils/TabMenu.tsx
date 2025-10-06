import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useEffect, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  SlideInRight,
  SlideOutLeft,
  withSpring,
} from 'react-native-reanimated';

import { theme } from '../../constants/theme';

export type TabsType = {
  tabChildren: React.ReactNode;
  tabName: {
    name: string;
    value: string;
  };
};
type TabMenuProps = {
  tabs: TabsType[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabMenu = ({ tabs, activeTab, onTabChange }: TabMenuProps) => {
  /***** Constants *****/
  const { width: screenWidth } = useWindowDimensions();

  /***** Memoization *****/
  const tabWidth = useMemo(() => screenWidth / tabs.length, [screenWidth, tabs]);
  const activeIndex = useMemo(
    () => tabs.findIndex(({ tabName }) => tabName.value === activeTab),
    [tabs, activeTab]
  );

  /***** Animations *****/
  const underlineWidth = useSharedValue(0);
  const underlinePosition = useSharedValue(0);
  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      width: underlineWidth.value,
      transform: [{ translateX: underlinePosition.value }],
    };
  });

  useEffect(() => {
    if (tabs.length > 1) {
      const newWidth = tabWidth;
      const newPosition = activeIndex * tabWidth;

      underlineWidth.value = withSpring(newWidth, {
        damping: 15,
        stiffness: 150,
      });
      underlinePosition.value = withSpring(newPosition, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [activeIndex, tabWidth, underlinePosition, underlineWidth, tabs.length]);

  const getActiveTabChildren = () => {
    const activeTabData = tabs.find(({ tabName }) => tabName.value === activeTab);
    return activeTabData?.tabChildren || null;
  };

  if (tabs.length === 1) {
    return (
      <View>
        <View style={{ gap: theme.spacing.md }}>
          <Text style={styles.tabText}>{tabs[0].tabName.name}</Text>

          <View style={[styles.singleTabUnderline]} />
        </View>

        {tabs[0].tabChildren}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.tabHeader}>
        {tabs.map(({ tabName }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={tabName.value}
            style={[styles.tabButton, { width: tabWidth }]}
            onPress={() => onTabChange(tabName.value)}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tabName.value
                      ? theme.colors.darkText[100]
                      : theme.colors.lightText,
                },
              ]}>
              {tabName.name}
            </Text>
          </TouchableOpacity>
        ))}

        <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
      </View>

      <Animated.View
        key={activeTab}
        style={styles.animatedContent}
        exiting={SlideOutLeft.duration(200)}
        entering={SlideInRight.duration(300).damping(25).stiffness(60)}>
        {getActiveTabChildren()}
      </Animated.View>
    </View>
  );
};

export default TabMenu;

const styles = StyleSheet.create({
  tabHeader: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  tabText: {
    textAlign: 'center',
    ...theme.typography.textVariants.subHeadline,
  },
  underline: {
    bottom: 0,
    height: 2,
    position: 'absolute',
    borderRadius: theme.radii.xs,
    backgroundColor: theme.colors.darkText[100],
  },
  singleTabUnderline: {
    height: 2,
    borderRadius: theme.radii.xs,
    backgroundColor: theme.colors.darkText[100],
  },
  animatedContent: {
    flex: 1,
    paddingTop: theme.spacing['3xl'],
  },
});
