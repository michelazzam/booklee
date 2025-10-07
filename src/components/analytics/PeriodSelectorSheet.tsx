import { useRef, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { theme } from '~/src/constants/theme';
import { Text } from '~/src/components/base';
import XIcon from '~/src/assets/icons/XIcon';

interface PeriodSelectorSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPeriod: (period: string) => void;
  onSelectCustomRange: () => void;
  selectedPeriod?: string;
}

const PeriodSelectorSheet = ({
  isVisible,
  onClose,
  onSelectPeriod,
  onSelectCustomRange,
  selectedPeriod,
}: PeriodSelectorSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const periods = [
    { label: '1 week', value: '1-week' },
    { label: '1 month', value: '1-month' },
    { label: '4 months', value: '4-months' },
    { label: '12 months', value: '12-months' },
    { label: 'Custom range', value: 'custom' },
  ];

  // Handle opening bottom sheet
  useMemo(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handlePeriodSelect = (value: string) => {
    if (value === 'custom') {
      onSelectCustomRange();
    } else {
      onSelectPeriod(value);
      onClose();
    }
  };

  // Render backdrop
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBar} />
          <View style={styles.titleRow}>
            <Text size={theme.typography.fontSizes.lg} weight="semiBold">
              SELECT PERIOD
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <XIcon width={24} height={24} color={theme.colors.darkText[100]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Period Options */}
        <View style={styles.optionsContainer}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.optionItem,
                selectedPeriod === period.value && styles.selectedOptionItem,
              ]}
              onPress={() => handlePeriodSelect(period.value)}
              activeOpacity={0.7}>
              <Text
                size={theme.typography.fontSizes.md}
                weight={selectedPeriod === period.value ? 'semiBold' : 'regular'}
                color={theme.colors.darkText[100]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default PeriodSelectorSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  handleIndicator: {
    backgroundColor: theme.colors.darkText[100],
    width: 40,
    height: 4,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerBar: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.darkText[100],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  optionItem: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  selectedOptionItem: {
    borderColor: theme.colors.primaryGreen[100],
    borderWidth: 2,
    backgroundColor: theme.colors.primaryGreen[10],
  },
});
