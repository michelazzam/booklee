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
  const underlineWidth = useSharedValue(tabWidth);
  const underlinePosition = useSharedValue(activeIndex * tabWidth);
  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      width: underlineWidth.value,
      transform: [{ translateX: underlinePosition.value }],
    };
  });

  useEffect(() => {
    const newPosition = activeIndex * tabWidth;
    underlinePosition.value = withSpring(newPosition, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex, tabWidth, underlinePosition]);

  const getActiveTabChildren = () => {
    const activeTabData = tabs.find(({ tabName }) => tabName.value === activeTab);
    return activeTabData?.tabChildren || null;
  };

  return (
    <View style={{ flex: 1 }}>
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
                      ? theme.colors.primaryBlue[100]
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
        style={styles.tabContent}
        exiting={SlideOutLeft.duration(200)}
        entering={SlideInRight.duration(300).springify().damping(15).stiffness(100)}>
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
    height: 3,
    position: 'absolute',
    borderRadius: theme.radii.xs,
    backgroundColor: theme.colors.primaryBlue[100],
  },
  tabContent: {
    flex: 1,
    paddingTop: theme.spacing.lg,
  },
});
