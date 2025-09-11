import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { theme } from '../../constants/theme';
import { useAppSafeAreaInsets } from '../../hooks/useAppSafeAreaInsets';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Icon } from '../base';

export interface FilterState {
  location: string;
  priceRange: [number, number];
  minimumRating: number;
  maximumDistance: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const defaultFilters: FilterState = {
  location: '',
  priceRange: [0, 300],
  minimumRating: 0,
  maximumDistance: 30,
};

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters = defaultFilters,
}: FilterModalProps) {
  const insets = useAppSafeAreaInsets();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const screenWidth = Dimensions.get('window').width;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const updatePriceRange = (values: number[]) => {
    setFilters({ ...filters, priceRange: [values[0], values[1]] });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FILTER</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={theme.colors.darkText[100]} />
          </TouchableOpacity>
        </View>

        {/* Filter Content */}
        <View style={styles.content}>
          {/* Location Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Location</Text>
            <View style={styles.locationContainer}>
              <View style={styles.locationInputContainer}>
                <Icon name="map-marker" size={20} color={theme.colors.lightText} />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Filter by City"
                  placeholderTextColor={theme.colors.lightText}
                  value={filters.location}
                  onChangeText={(text) => setFilters({ ...filters, location: text })}
                />
              </View>
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price Range ($)</Text>
            <View style={styles.sliderContainer}>
              <MultiSlider
                values={filters.priceRange}
                sliderLength={screenWidth - 48}
                onValuesChange={updatePriceRange}
                min={0}
                max={500}
                step={5}
                allowOverlap={false}
                snapped
                selectedStyle={styles.selectedTrack}
                unselectedStyle={styles.unselectedTrack}
                containerStyle={styles.multiSliderContainer}
                markerStyle={styles.markerStyle}
                pressedMarkerStyle={styles.pressedMarkerStyle}
              />
              <View style={styles.sliderValues}>
                <Text style={styles.sliderValue}>${filters.priceRange[0]}</Text>
                <Text style={styles.sliderValue}>${filters.priceRange[1]}</Text>
              </View>
            </View>
          </View>

          {/* Minimum Rating Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Minimum Rating</Text>
            <View style={styles.sliderContainer}>
              <MultiSlider
                values={[filters.minimumRating]}
                sliderLength={screenWidth - 48}
                onValuesChange={(values) => setFilters({ ...filters, minimumRating: values[0] })}
                min={0}
                max={5}
                step={0.1}
                allowOverlap={false}
                snapped
                selectedStyle={styles.selectedTrack}
                unselectedStyle={styles.unselectedTrack}
                containerStyle={styles.multiSliderContainer}
                markerStyle={styles.markerStyle}
                pressedMarkerStyle={styles.pressedMarkerStyle}
              />
              <View style={styles.sliderValues}>
                <Text style={styles.sliderValue}>
                  {Math.round(filters.minimumRating * 10) / 10}
                </Text>
              </View>
            </View>
          </View>

          {/* Maximum Distance Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Maximum Distance (km)</Text>
            <View style={styles.sliderContainer}>
              <MultiSlider
                values={[filters.maximumDistance]}
                sliderLength={screenWidth - 48}
                onValuesChange={(values) => setFilters({ ...filters, maximumDistance: values[0] })}
                min={0}
                max={50}
                step={1}
                allowOverlap={false}
                snapped
                selectedStyle={styles.selectedTrack}
                unselectedStyle={styles.unselectedTrack}
                containerStyle={styles.multiSliderContainer}
                markerStyle={styles.markerStyle}
                pressedMarkerStyle={styles.pressedMarkerStyle}
              />
              <View style={styles.sliderValues}>
                <Text style={styles.sliderValue}>{Math.round(filters.maximumDistance)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.textVariants.headline,
    color: theme.colors.darkText[100],
    fontWeight: theme.typography.fontWeights.bold,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  filterLabel: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  locationInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  locationIcon: {
    marginRight: theme.spacing.sm,
  },
  locationInput: {
    flex: 1,
    ...theme.typography.textVariants.bodyPrimaryRegular,
    color: theme.colors.darkText[100],
  },

  sliderContainer: {
    gap: theme.spacing.sm,
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sliderValue: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
    fontSize: 16,
  },
  multiSliderContainer: {
    height: 10,
    justifyContent: 'center',
    marginVertical: theme.spacing.sm,
    width: '100%',
  },
  selectedTrack: {
    backgroundColor: theme.colors.darkText[100],
    height: 4,
  },
  unselectedTrack: {
    backgroundColor: theme.colors.border,
    height: 4,
  },

  markerStyle: {
    backgroundColor: theme.colors.darkText[100],
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.white.DEFAULT,
  },
  pressedMarkerStyle: {
    backgroundColor: theme.colors.darkText[100],
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.white.DEFAULT,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  resetButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white.DEFAULT,
    alignItems: 'center',
  },
  resetButtonText: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.darkText[100],
    alignItems: 'center',
  },
  applyButtonText: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.white.DEFAULT,
  },
});
