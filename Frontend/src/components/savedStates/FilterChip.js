import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const FilterChip = ({ 
  label, 
  isSelected, 
  onPress, 
  count, 
  selectedColor = "#3b82f6",
  selectedTextColor = "#ffffff",
  unselectedColor = "#f3f4f6",
  unselectedTextColor = "#6b7280"
}) => (
  <TouchableOpacity
    style={{
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isSelected ? selectedColor : unselectedColor,
      marginRight: 8,
    }}
    onPress={onPress}
  >
    <Text
      style={{
        color: isSelected ? selectedTextColor : unselectedTextColor,
        fontSize: 14,
        fontWeight: "600",
      }}
    >
      {label} {count !== undefined && `(${count})`}
    </Text>
  </TouchableOpacity>
);

export default FilterChip;