import { StyleSheet, Text, View } from 'react-native';
import { theme } from '~/theme/Main';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>{title}</Text>
        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
          <Text>{path}</Text>
        </View>
        <Text style={styles.getStartedText}>{description}</Text>
        <Text style={theme.typography.textVariants.bodyTertiaryRegular}>TEst</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  codeHighlightContainer: {
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 48,
  },
  getStartedText: {
    fontSize: theme.typography.fontSizes.lg,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: theme.typography.textVariants.bodyPrimaryBold.fontFamily,
  },
  helpContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
  },
  helpLink: {
    paddingVertical: 16,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  homeScreenFilename: {
    marginVertical: 8,
  },
});
