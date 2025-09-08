import { StyleSheet, ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { mockSalons, Salon } from '~/src/data';
import { theme } from '~/src/constants/theme';

import { ServiceCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

export default function HomePage() {
  /*** Constants ***/
  const { top, bottom } = useAppSafeAreaInsets();

  const handleSalonPress = (salon: Salon) => {
    router.push({
      params: { id: salon.id },
      pathname: '/(authenticated)/(tabs)/search/[id]',
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <View style={[styles.headerContainer, { paddingTop: top }]}>
          <Text
            weight="bold"
            color={theme.colors.white.DEFAULT}
            size={theme.typography.fontSizes.sm}>
            Hello Samir!
          </Text>

          <Text
            weight="medium"
            color={theme.colors.white.DEFAULT}
            size={theme.typography.fontSizes.md}>
            What would you like to do today?
          </Text>
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <View style={styles.sectionTitle}>
            <Text
              weight="medium"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.md}>
              HAIR & STYLING
            </Text>

            <Button title="See All" variant="ghost" onPress={() => {}} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContainer}>
            {mockSalons.hairAndStyling.map((salon) => (
              <ServiceCard key={salon.id} data={salon} onPress={() => handleSalonPress(salon)} />
            ))}
          </ScrollView>
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <View style={styles.sectionTitle}>
            <Text
              weight="medium"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.md}>
              NAILS
            </Text>

            <Button title="See All" variant="ghost" onPress={() => {}} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContainer}>
            {mockSalons.nails.map((salon) => (
              <ServiceCard key={salon.id} data={salon} onPress={() => handleSalonPress(salon)} />
            ))}
          </ScrollView>
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <View style={styles.sectionTitle}>
            <Text
              weight="medium"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.md}>
              BARBER
            </Text>

            <Button title="See All" variant="ghost" onPress={() => {}} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionContainer}>
            {mockSalons.barber.map((salon) => (
              <ServiceCard key={salon.id} data={salon} onPress={() => handleSalonPress(salon)} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primaryBlue[100],
  },
  container: {
    gap: 24,
    flexGrow: 1,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
  },
  sectionContainer: {
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
});
