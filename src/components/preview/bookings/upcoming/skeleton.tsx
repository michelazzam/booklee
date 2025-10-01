import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { View, StyleSheet, Dimensions } from 'react-native';
import { theme } from '~/src/constants';

const { width: screenWidth } = Dimensions.get('window');

const UpcomingBookingsSkeleton = () => {
  return (
    <View style={styles.container}>
      <ContentLoader
        speed={2}
        height={280}
        width={screenWidth - 32}
        backgroundColor="#f5f5f5"
        foregroundColor="#ffffff">
        {/* Header container background */}
        <Rect x="0" y="0" rx="8" ry="8" width="95%" height="120" />

        {/* Location image skeleton */}
        <Rect x="12" y="12" rx="8" ry="8" width="100" height="100" />

        {/* Location info section - properly spaced */}
        <Rect x="124" y="20" rx="4" ry="4" width="80" height="20" />
        <Rect x="124" y="46" rx="3" ry="3" width="30" height="12" />
        <Rect x="124" y="66" rx="3" ry="3" width="60" height="14" />

        {/* Booking details container background */}
        <Rect x="0" y="132" rx="8" ry="8" width="95%" height="60" />
        <Circle cx="24" cy="152" r="10" />
        <Rect x="44" y="146" rx="3" ry="3" width="80" height="12" />
        <Circle cx="24" cy="176" r="10" />
        <Rect x="44" y="170" rx="3" ry="3" width="60" height="12" />

        {/* Payment details container background */}
        <Rect x="0" y="204" rx="8" ry="8" width="95%" height="75" />
        <Rect x="12" y="220" rx="3" ry="3" width="120" height="12" />
        <Rect x="12" y="236" rx="3" ry="3" width="100" height="10" />
        <Rect x="12" y="248" rx="3" ry="3" width="60" height="10" />
        <Rect x="12" y="260" rx="3" ry="3" width="50" height="12" />
        <Rect x="160" y="260" rx="3" ry="3" width="40" height="12" />

        {/* Modify button */}
        <Rect x="12" y="284" rx="8" ry="8" width="100%" height="60" />
      </ContentLoader>
    </View>
  );
};

export default UpcomingBookingsSkeleton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
