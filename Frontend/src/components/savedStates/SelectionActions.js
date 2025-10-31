import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const SelectionActions = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete
}) => (
  <View
    style={{
      backgroundColor: "#ffffff",
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
      <TouchableOpacity
        onPress={onSelectAll}
        style={{
          backgroundColor: "#f0f9ff",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#3b82f6", fontWeight: "600", fontSize: 12 }}>
          Tout sélectionner ({totalCount})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onDeselectAll}
        style={{
          backgroundColor: "#f9fafb",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#6b7280", fontWeight: "600", fontSize: 12 }}>
          Tout désélectionner
        </Text>
      </TouchableOpacity>
    </View>
    
    {selectedCount > 0 && (
      <TouchableOpacity
        onPress={onBulkDelete}
        style={{
          backgroundColor: "#ef4444",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "600" }}>
          Supprimer {selectedCount} élément{selectedCount !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default SelectionActions;
