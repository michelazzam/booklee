import { StyleSheet } from 'react-native';
import { theme } from '~/src/constants/theme';
import { Button } from '~/src/components/buttons';

interface ConfirmButtonProps {
  onPress: () => void;
}

export default function ConfirmButton({ onPress }: ConfirmButtonProps) {
  return <Button title="Confirm" onPress={onPress} containerStyle={styles.buttonContainer} />;
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
