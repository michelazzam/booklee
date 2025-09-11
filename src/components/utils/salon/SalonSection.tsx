import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { theme } from '../../../constants/theme';
import SalonCard from './SalonCard';

interface Salon {
  id: string;
  image: string;
  name: string;
  city: string;
  rating: number;
  tag: string;
  isFavorite?: boolean;
}

interface SalonSectionProps {
  title: string;
  salons: Salon[];
  onSalonPress?: (salon: Salon) => void;
  onFavoritePress?: (salonId: string) => void;
  onSeeAllPress?: () => void;
}

export default function SalonSection({
  title,
  salons,
  onSalonPress,
  onFavoritePress,
  onSeeAllPress,
}: SalonSectionProps) {
  const renderSalonCard = ({ item }: { item: Salon }) => (
    <SalonCard
      id={item.id}
      image={item.image}
      name={item.name}
      city={item.city}
      rating={item.rating}
      tag={item.tag}
      isFavorite={item.isFavorite}
      onPress={() => onSalonPress?.(item)}
      onFavoritePress={() => onFavoritePress?.(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={salons}
        renderItem={renderSalonCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  title: {
    ...theme.typography.textVariants.bodyPrimaryBold,
    color: theme.colors.darkText[100],
    textTransform: 'uppercase',
  },
  seeAllText: {
    ...theme.typography.textVariants.bodySecondaryHyperlink,
    color: theme.colors.darkText[100],
  },
  listContainer: {
    paddingLeft: theme.spacing.lg,
  },
});
