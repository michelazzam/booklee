import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useWindowDimensions, TouchableOpacity, StyleSheet, View } from 'react-native';
import { type Href, useRouter, Slot } from 'expo-router';
import { useState } from 'react';

import { HeaderNavigation, Text } from '~/src/components/base';

type TabType = {
  key: string;
  route: Href;
  label: string;
};
const TABS: TabType[] = [
  {
    key: 'upcoming',
    label: 'Upcoming',
    route: '/(authenticated)/(tabs)/bookings',
  },
  {
    key: 'past',
    label: 'Past',
    route: '/(authenticated)/(tabs)/bookings/past',
  },
];

const LabsLayout = () => {
  /***** Constants *****/
  const router = useRouter();
  const { width } = useWindowDimensions();

  /***** States *****/
  const [activeTab, setActiveTab] = useState<TabType>(TABS[0]);

  /***** Animations *****/
  const activeLinePosition = useSharedValue(0);
  const animatedActiveLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: activeLinePosition.value }],
    };
  });

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    router.replace(tab.route);

    const tabIndex = TABS.findIndex((t) => t.key === tab.key);
    const tabWidth = width / TABS.length;
    activeLinePosition.value = withTiming(tabIndex * tabWidth, {
      duration: 300,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNavigation title="BOOKINGS" showBackButton={false} />

      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            style={styles.tabButton}
            onPress={() => handleTabPress(tab)}>
            <Text
              size={16}
              weight="semiBold"
              color={activeTab.key === tab.key ? '#000000' : '#757575'}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.continuousLine}>
        <View style={styles.lineBackground} />

        <Animated.View style={[styles.activeLineSection, animatedActiveLineStyle]} />
      </View>

      <Slot
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </View>
  );
};

export default LabsLayout;

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#E2E2E2',
  },
  tabsRow: {
    gap: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    position: 'relative',
    alignItems: 'center',
  },
  continuousLine: {
    height: 2,
    marginTop: 12,
    position: 'relative',
  },
  lineBackground: {
    left: 0,
    right: 0,
    height: '100%',
    position: 'absolute',
    backgroundColor: '#E2E2E2',
  },
  activeLineSection: {
    left: 0,
    height: '100%',
    borderRadius: 1,
    position: 'absolute',
    backgroundColor: '#476c80',
    width: `${100 / TABS.length}%`,
  },
});
