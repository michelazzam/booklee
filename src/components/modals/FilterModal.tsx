import { View, TouchableOpacity, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { useAppSafeAreaInsets } from '../../hooks/useAppSafeAreaInsets';
import { theme } from '../../constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { Icon, Text } from '../base';

export type FilterState = {
  location: string;
  minimumRating: number;
  maximumDistance: number;
  priceRange: [number, number];
};
export type FilterModalRef = {
  present: () => void;
  dismiss: () => void;
};

type FilterModalProps = {
  onClose: () => void;
  initialFilters?: FilterState;
  onApply: (filters: FilterState) => void;
};

const defaultFilters: FilterState = {
  location: '',
  minimumRating: 0,
  maximumDistance: 30,
  priceRange: [0, 300],
};

const FilterModal = forwardRef<FilterModalRef, FilterModalProps>(
  ({ onClose, onApply, initialFilters = defaultFilters }, ref) => {
    /*** Refs ***/
    const modalRef = useRef<ModalWrapperRef>(null);

    /*** States ***/
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    /*** Constants ***/
    const insets = useAppSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();

    /*** Expose methods ***/
    useImperativeHandle(ref, () => ({
      present: () => {
        modalRef.current?.present();
      },
      dismiss: () => {
        modalRef.current?.dismiss();
      },
    }));

    /*** Handlers ***/
    const handleApply = () => {
      modalRef.current?.dismiss();
      onApply(filters);
      onClose();
    };

    const handleReset = () => {
      setFilters(defaultFilters);
    };

    const handleClose = () => {
      modalRef.current?.dismiss();
      onClose();
    };

    const updatePriceRange = (values: number[]) => {
      setFilters({ ...filters, priceRange: [values[0], values[1]] });
    };

    return (
      <ModalWrapper
        ref={modalRef}
        title="FILTER"
        snapPoints={['90%']}
        onDismiss={handleClose}
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom }]}
        trailingIcon={
          <Icon name="close" size={24} color={theme.colors.darkText[100]} onPress={handleClose} />
        }>
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
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </ModalWrapper>
    );
  }
);

FilterModal.displayName = 'FilterModal';

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    flex: 1,
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
