import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../constants/theme';

export interface FilterCategory {
  id: string;
  label: string;
}

interface FilterTagsProps {
  categories: FilterCategory[];
  selectedCategoryId?: string;
  onCategorySelect?: (categoryId: string) => void;
}

const defaultCategories: FilterCategory[] = [
  { id: 'hair-styling', label: 'Hair & Styling' },
  { id: 'nails', label: 'Nails' },
  { id: 'barber', label: 'Barber' },
  { id: 'eyebrows-eyelashes', label: 'Eyebrows & Eyelashes' },
  { id: 'spa', label: 'Spa' },
  { id: 'massage', label: 'Massage' },
];

export default function FilterTags({
  categories = defaultCategories,
  selectedCategoryId,
  onCategorySelect,
}: FilterTagsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.tag, isSelected && styles.selectedTag]}
              onPress={() => onCategorySelect?.(category.id)}
              activeOpacity={0.7}>
              <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  tag: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.white.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedTag: {
    backgroundColor: theme.colors.primaryBlue[100],
    borderColor: theme.colors.primaryBlue[100],
  },
  tagText: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
    color: theme.colors.darkText[100],
    textAlign: 'center',
  },
  selectedTagText: {
    color: theme.colors.white.DEFAULT,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});
