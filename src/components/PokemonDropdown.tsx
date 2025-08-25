import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants';
import pokemonData from '../assets/pokemon/pokemon_forms.json';

interface PokemonForm {
  id: string;
  name: string;
  forms: string[];
}

interface PokemonDropdownProps {
  value: string;
  onSelect: (pokemon: string) => void;
  placeholder?: string;
  style?: any;
}

const PokemonDropdown: React.FC<PokemonDropdownProps> = ({
  value,
  onSelect,
  placeholder = "Type Pokémon name...",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  useEffect(() => {
    if (searchText.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    // Find matching Pokemon forms
    const allForms: string[] = [];
    
    pokemonData.forEach((pokemon: PokemonForm) => {
      // Check if the Pokemon name matches
      if (pokemon.name.toLowerCase().includes(searchText.toLowerCase())) {
        allForms.push(...pokemon.forms);
      } else {
        // Check if any form matches
        const matchingForms = pokemon.forms.filter(form =>
          form.toLowerCase().includes(searchText.toLowerCase())
        );
        allForms.push(...matchingForms);
      }
    });

    // Sanitize, de-duplicate and limit results
    const uniqueForms = Array.from(
      new Set(
        allForms.filter(
          (form): form is string => typeof form === 'string' && form.trim().length > 0,
        ),
      ),
    ).slice(0, 8);
    setSuggestions(uniqueForms);
  }, [searchText]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setIsOpen(text.length > 0);
  };

  const handleSelectForm = (form: string) => {
    setSearchText(form);
    onSelect(form);
    setIsOpen(false);
  };

  const renderSuggestion = (item: string) => (
    <TouchableOpacity
      key={item}
      style={styles.suggestionItem}
      onPress={() => handleSelectForm(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const extraSpace = isOpen && suggestions.length > 0
    ? Math.min(suggestions.length * 44, 200) + 8
    : 0;

  return (
    <View style={[
      styles.container,
      style,
      extraSpace ? { marginBottom: extraSpace } : null,
      { zIndex: isOpen ? 9999 : 1 },
    ]}> 
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.TEXT_LIGHT}
        onFocus={() => setIsOpen(searchText.length > 0)}
        onBlur={() => setIsOpen(false)}
      />
      
      {isOpen && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView 
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map(renderSuggestion)}
          </ScrollView>
        </View>
      )}
      
      {isOpen && suggestions.length > 0 && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  input: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
    borderTopWidth: 0,
    maxHeight: 200,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_LIGHT,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default PokemonDropdown;
