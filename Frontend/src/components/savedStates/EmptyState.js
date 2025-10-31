import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const EmptyState = ({
  hasStates,
  onClearFilters
}) => {

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        margin: 24,
        padding: 40,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View
        style={{
          backgroundColor: "#f3f4f6",
          padding: 20,
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 32 }}>
          {!hasStates ? "📦" : "🔍"}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {!hasStates ? "Aucun état enregistré" : "Aucun état trouvé"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 20,
          marginBottom: hasStates ? 20 : 0,
        }}
      >
        {!hasStates
          ? "Enregistrez des états de capteurs depuis l’écran de suivi pour les voir ici."
          : "Aucun état ne correspond à vos filtres actuels. Essayez de modifier les filtres ci-dessus."
        }
      </Text>
      {hasStates && (
        <TouchableOpacity
          onPress={onClearFilters}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Réinitialiser les filtres
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
