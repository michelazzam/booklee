import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../constants/theme';

interface AboutTabProps {
  about: string;
}

export default function AboutTab({ about }: AboutTabProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.aboutText}>{about}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.lg,
  },
  aboutText: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
    color: theme.colors.darkText[100],
    lineHeight: 22,
  },
});
