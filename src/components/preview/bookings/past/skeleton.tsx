import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { theme } from '~/src/constants';

const { width: screenWidth } = Dimensions.get('window');

const PastBookingsSkeleton = () => {
  return (
    <View style={styles.container}>
      <ContentLoader
        speed={2}
        width={screenWidth - 32}
        height={200}
        backgroundColor="#f5f5f5"
        foregroundColor="#ffffff">
        {/* Header with status indicator - centered */}
        <Rect x="0" y="0" rx="0" ry="0" width="100%" height="30" />
        <Circle cx="15" cy="15" r="8" />
        <Rect x="32" y="10" rx="4" ry="4" width="60" height="10" />

        {/* Content container background */}
        <Rect x="0" y="30" rx="0" ry="0" width="100%" height="170" />

        {/* Location container background */}
        <Rect x="12" y="42" rx="8" ry="8" width="95%" height="120" />

        {/* Location image skeleton */}
        <Rect x="24" y="54" rx="8" ry="8" width="100" height="100" />

        {/* Location info section - properly spaced */}
        <Rect x="136" y="62" rx="4" ry="4" width="80" height="16" />
        <Rect x="136" y="82" rx="3" ry="3" width="30" height="12" />
        <Rect x="136" y="98" rx="3" ry="3" width="60" height="12" />
        <Rect x="136" y="114" rx="3" ry="3" width="70" height="12" />
        <Rect x="136" y="130" rx="3" ry="3" width="40" height="12" />
      </ContentLoader>
    </View>
  );
};

export default PastBookingsSkeleton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
  },
});
