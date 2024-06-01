import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface LanguageProps {
  flag: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

const Language = ({ flag, selected, disabled, onSelect }: LanguageProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onSelect}
      disabled={disabled}
    >
    <View style={[styles.container, disabled && styles.disabled]}>
        <Text style={[styles.flagText, disabled && styles.flagTextDisabled]}>{flag}</Text>
        <View style={[styles.underline, selected && !disabled && styles.selected]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  flagText: {
    fontSize: 30,
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
  },
  selected: {
    backgroundColor: '#007BFF',
  },
  flagTextDisabled: {
    color: '#cccccc',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Language;
