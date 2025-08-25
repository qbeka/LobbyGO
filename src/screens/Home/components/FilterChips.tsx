import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../../constants';

interface FilterChip {
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const FilterChips = ({ filters, selectedValue, onSelect }: FilterChipsProps) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.chip,
              selectedValue === filter.value && styles.selectedChip
            ]}
            onPress={() => onSelect(filter.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                selectedValue === filter.value && styles.selectedChipText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  chip: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
  },
  selectedChip: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FilterChips;
