import { View, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { type GetLocationsReqType } from '~/src/services';

import { useAppSafeAreaInsets } from '../../hooks/useAppSafeAreaInsets';
import { MapMarkerIcon } from '~/src/assets/icons';
import { theme } from '../../constants/theme';

import ModalWrapper, { type ModalWrapperRef } from './ModalWrapper';
import { Icon, Text } from '../base';
import { Button } from '../buttons';

export type FilterModalRef = {
  present: () => void;
  dismiss: () => void;
};

type FilterModalProps = {
  onReset: () => void;
  initialFilters?: GetLocationsReqType;
  onApply: (filters: GetLocationsReqType) => void;
};

const defaultFilters: GetLocationsReqType = {
  distance: 30,
  price_min: 0,
  rating_min: 0,
  price_max: 1000,
};

const FilterModal = forwardRef<FilterModalRef, FilterModalProps>(
  ({ onApply, onReset, initialFilters = defaultFilters }, ref) => {
    /*** Constants ***/
    const { bottom } = useAppSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();

    /*** Refs ***/
    const modalRef = useRef<ModalWrapperRef>(null);

    /*** States ***/
    const [isSliderActive, setIsSliderActive] = useState(false);
    const [filters, setFilters] = useState<GetLocationsReqType>(initialFilters);

    useImperativeHandle(ref, () => ({
      present: () => {
        modalRef.current?.present();
      },
      dismiss: () => {
        modalRef.current?.dismiss();
      },
    }));

    const handleApply = () => {
      modalRef.current?.dismiss();
      const appliedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => value !== defaultFilters[key as keyof GetLocationsReqType]
        )
      );

      onApply(appliedFilters);
    };
    const handleReset = () => {
      setFilters(initialFilters);
      onReset();
      onApply({});

      modalRef.current?.dismiss();
    };
    const handleClose = () => {
      modalRef.current?.dismiss();
    };

    /*** Slider Handlers ***/
    const handleSliderStart = () => {
      setIsSliderActive(true);
    };
    const handleSliderEnd = () => {
      setIsSliderActive(false);
    };

    return (
      <ModalWrapper
        ref={modalRef}
        snapPoints={['90%']}
        onDismiss={handleClose}
        disable={isSliderActive}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.header}>
          <View style={{ width: 24 }} />

          <Text
            weight="medium"
            color={theme.colors.darkText[100]}
            size={theme.typography.fontSizes.sm}>
            FILTER
          </Text>

          <Icon name="close" size={24} color={theme.colors.darkText[100]} onPress={handleClose} />
        </View>

        <View style={styles.filterContainer}>
          <View style={{ gap: theme.spacing.md }}>
            <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
              Location
            </Text>

            <View style={styles.locationInputContainer}>
              <MapMarkerIcon />

              <TextInput
                value={filters.city}
                style={styles.locationInput}
                placeholder="Filter by City"
                placeholderTextColor={theme.colors.lightText}
                onChangeText={(text) => setFilters({ ...filters, city: text })}
              />
            </View>
          </View>

          <View style={{ gap: theme.spacing.md }}>
            <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
              Price Range ($)
            </Text>

            <View style={{ paddingHorizontal: theme.spacing.sm }}>
              <MultiSlider
                snapped
                min={0}
                step={10}
                max={1000}
                allowOverlap={false}
                sliderLength={screenWidth - 48}
                markerStyle={styles.markerStyle}
                selectedStyle={styles.selectedTrack}
                onValuesChangeFinish={handleSliderEnd}
                onValuesChangeStart={handleSliderStart}
                unselectedStyle={styles.unselectedTrack}
                pressedMarkerStyle={styles.pressedMarkerStyle}
                values={[filters.price_min || 0, filters.price_max || 1000]}
                onValuesChange={(values) =>
                  setFilters({ ...filters, price_min: values[0], price_max: values[1] })
                }
              />

              <View style={styles.sliderValueContainer}>
                <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
                  ${filters.price_min || 0}
                </Text>

                <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
                  ${filters.price_max || 1000}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ gap: theme.spacing.md }}>
            <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
              Minimum Rating
            </Text>

            <View style={{ paddingHorizontal: theme.spacing.xs }}>
              <MultiSlider
                min={0}
                max={5}
                snapped
                step={0.1}
                allowOverlap={false}
                sliderLength={screenWidth - 48}
                markerStyle={styles.markerStyle}
                values={[filters.rating_min || 0]}
                selectedStyle={styles.selectedTrack}
                onValuesChangeFinish={handleSliderEnd}
                onValuesChangeStart={handleSliderStart}
                unselectedStyle={styles.unselectedTrack}
                pressedMarkerStyle={styles.pressedMarkerStyle}
                onValuesChange={(values) => setFilters({ ...filters, rating_min: values[0] })}
              />

              <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
                {Math.round((filters.rating_min || 0) * 10) / 10}
              </Text>
            </View>
          </View>

          <View style={{ gap: theme.spacing.md }}>
            <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
              Maximum Distance (km)
            </Text>

            <View style={{ paddingHorizontal: theme.spacing.xs }}>
              <MultiSlider
                min={0}
                snapped
                max={50}
                step={1}
                allowOverlap={false}
                sliderLength={screenWidth - 48}
                markerStyle={styles.markerStyle}
                values={[filters.distance || 30]}
                selectedStyle={styles.selectedTrack}
                onValuesChangeFinish={handleSliderEnd}
                onValuesChangeStart={handleSliderStart}
                unselectedStyle={styles.unselectedTrack}
                pressedMarkerStyle={styles.pressedMarkerStyle}
                onValuesChange={(values) => setFilters({ ...filters, distance: values[0] })}
              />

              <Text color={theme.colors.darkText[100]} size={theme.typography.fontSizes.xs}>
                {Math.round(filters.distance || 30)} km
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Apply" onPress={handleApply} containerStyle={{ flex: 1 }} />

          <Button
            title="Reset"
            variant="outline"
            onPress={handleReset}
            containerStyle={{ flex: 1 }}
          />
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
    gap: 36,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.md,
    justifyContent: 'space-between',
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xl,
  },
  filterContainer: {
    flex: 1,
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  locationInputContainer: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  locationInput: {
    flex: 1,
    fontWeight: '400',
    paddingBottom: theme.spacing.xs,
    color: theme.colors.darkText[100],
    ...theme.typography.textVariants.bodyPrimaryRegular,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTrack: {
    height: 3,
    backgroundColor: theme.colors.darkText[100],
  },
  unselectedTrack: {
    height: 1,
    backgroundColor: theme.colors.darkText[100],
  },
  markerStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.darkText[100],
  },
  pressedMarkerStyle: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: theme.colors.white.DEFAULT,
    backgroundColor: theme.colors.darkText[100],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
});
