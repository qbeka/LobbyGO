import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants';

interface FilterChip {
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  selectedValue: string;
  onSelect: (value: string) => void;
  style?: any;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedValue,
  onSelect,
  style,
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter, index) => {
        const isSelected = selectedValue === filter.value;
        
        return (
          <TouchableOpacity
            key={`${filter.value}-${index}`}
            style={[
              styles.chip,
              isSelected && styles.selectedChip,
            ]}
            onPress={() => onSelect(filter.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                isSelected && styles.selectedChipText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginRight: 8,
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
