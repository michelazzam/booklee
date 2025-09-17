import { View, StyleSheet } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

import { theme } from '../../../constants/theme';

type LocationCardSkeletonProps = {
  minWidth?: number;
};

const LocationCardSkeleton = ({ minWidth = 230 }: LocationCardSkeletonProps) => {
  return (
    <View style={[styles.container, { minWidth }]}>
      <ContentLoader
        speed={2}
        width="100%"
        height={300}
        backgroundColor={theme.colors.border}
        foregroundColor={theme.colors.white.DEFAULT}>
        {/* Image skeleton */}
        <Rect x="0" y="0" rx="8" ry="8" width="100%" height="200" />

        {/* Content area skeleton */}
        <Rect x="0" y="216" rx="4" ry="4" width="60%" height="16" />
        <Rect x="0" y="240" rx="4" ry="4" width="40%" height="12" />
        <Rect x="0" y="260" rx="10" ry="10" width="80" height="20" />
      </ContentLoader>
    </View>
  );
};

export default LocationCardSkeleton;

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
    overflow: 'hidden',
  },
});
