import { type RelativePathString, useRouter } from 'expo-router';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { hairAndStyling, nails, barber, eyebrowsEyelashes, type Store } from '~/src/mock';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { StoreCard } from '~/src/components/preview';
import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

type SectionProps = {
  title: string;
  data: Store[];
  index?: number;
};
const SectionCategory = ({ title, data, index = 0 }: SectionProps) => {
  /*** Constants ***/
  const router = useRouter();

  const handleSeeAllPress = () => {
    router.navigate({
      params: { id: title },
      pathname: '/(authenticated)/(screens)/store/[id]',
    });
  };

  return (
    <>
      <StatusBar style="light" />

      <View style={{ gap: theme.spacing.xs }}>
        <View style={styles.sectionTitle}>
          <Text
            weight="medium"
            color={theme.colors.darkText[100]}
            size={theme.typography.fontSizes.md}>
            {title}
          </Text>

          <Button title="See All" variant="ghost" onPress={handleSeeAllPress} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sectionContainer}>
          {data.map((store, dataIndex) => (
            <StoreCard
              data={store}
              key={store.id}
              animatedStyle="slideLeft"
              delay={dataIndex * 150 + index * 150}
              onPress={() =>
                router.navigate(
                  `/(authenticated)/(screens)/store/${store.id}` as RelativePathString
                )
              }
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const CATEGORIES = [
  {
    title: 'Hair & Styling',
    data: hairAndStyling,
  },
  {
    title: 'Nails',
    data: nails,
  },
  {
    title: 'Barber',
    data: barber,
  },
  {
    title: 'Eyebrows & Eyelashes',
    data: eyebrowsEyelashes,
  },
];
const HomePage = () => {
  /*** Constants ***/
  const { top, bottom } = useAppSafeAreaInsets();

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
            size={theme.typography.fontSizes.xl}>
            Hello Samir!
          </Text>

          <Text
            weight="medium"
            color={theme.colors.white.DEFAULT}
            size={theme.typography.fontSizes.sm}>
            What would you like to do today?
          </Text>
        </View>

        {CATEGORIES.map((category, index) => (
          <SectionCategory
            index={index}
            key={category.title}
            data={category.data}
            title={category.title}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomePage;

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
