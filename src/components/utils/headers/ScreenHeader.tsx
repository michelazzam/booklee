import { View, StyleSheet } from 'react-native';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '../../../constants/theme';

import { Text } from '../../base';

interface ScreenHeaderProps {
  title?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const ScreenHeader = ({ leading, title, trailing }: ScreenHeaderProps) => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top, height: 62 + top }]}>
      {leading}

      <Text size={theme.typography.fontSizes.lg} weight="bold" color={theme.colors.white.DEFAULT}>
        {title}
      </Text>

      {trailing}
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    filter: 'blur(0.5px)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primaryBlue[100],
  },
});
