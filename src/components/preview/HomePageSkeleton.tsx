import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, StyleSheet, ScrollView } from 'react-native';

import { theme } from '../../constants/theme';

import LocationCardSkeleton from './location/skeleton';

const HomePageSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Categories skeleton */}
      <View style={styles.content}>
        {/* First category skeleton */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitle}>
            <ContentLoader
              speed={2}
              width={120}
              height={20}
              backgroundColor={theme.colors.border}
              foregroundColor={theme.colors.white.DEFAULT}>
              <Rect x="0" y="0" rx="4" ry="4" width="120" height="20" />
            </ContentLoader>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {Array.from({ length: 3 }).map((_, index) => (
              <LocationCardSkeleton key={index} minWidth={230} />
            ))}
          </ScrollView>
        </View>

        {/* Second category skeleton */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitle}>
            <ContentLoader
              speed={2}
              width={100}
              height={20}
              backgroundColor={theme.colors.border}
              foregroundColor={theme.colors.white.DEFAULT}>
              <Rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
            </ContentLoader>
            <ContentLoader
              speed={2}
              width={60}
              height={20}
              backgroundColor={theme.colors.border}
              foregroundColor={theme.colors.white.DEFAULT}>
              <Rect x="0" y="0" rx="4" ry="4" width="60" height="20" />
            </ContentLoader>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {Array.from({ length: 2 }).map((_, index) => (
              <LocationCardSkeleton key={index} minWidth={230} />
            ))}
          </ScrollView>
        </View>

        {/* Third category skeleton */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitle}>
            <ContentLoader
              speed={2}
              width={140}
              height={20}
              backgroundColor={theme.colors.border}
              foregroundColor={theme.colors.white.DEFAULT}>
              <Rect x="0" y="0" rx="4" ry="4" width="140" height="20" />
            </ContentLoader>
            <ContentLoader
              speed={2}
              width={60}
              height={20}
              backgroundColor={theme.colors.border}
              foregroundColor={theme.colors.white.DEFAULT}>
              <Rect x="0" y="0" rx="4" ry="4" width="60" height="20" />
            </ContentLoader>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {Array.from({ length: 4 }).map((_, index) => (
              <LocationCardSkeleton key={index} minWidth={230} />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default HomePageSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  headerContainer: {
    backgroundColor: theme.colors.primaryBlue[100],
    paddingVertical: theme.spacing.md,
  },
  content: {
    flex: 1,
    gap: 24,
    paddingTop: theme.spacing.md,
  },
  sectionContainer: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  horizontalScroll: {
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
});
