import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const ScheduledSavesSection = ({
  scheduledSaves,
  onAddSchedule,
}) => {
  const { schedules, loading, error, removeSchedule, refresh } = scheduledSaves;

  return (
    <View style={{ marginHorizontal: 24, marginTop: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
        Sauvegardes planifiées
      </Text>

      <TouchableOpacity
        onPress={onAddSchedule}
        style={{
          backgroundColor: "#10b981",
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          + Ajouter une planification
        </Text>
      </TouchableOpacity>

      {loading && (
        <Text style={{ 
          color: "#6b7280", 
          textAlign: "center", 
          marginBottom: 10 
        }}>
          Chargement des planifications...
        </Text>
      )}

      {error && (
        <View style={{
          backgroundColor: "#fecaca",
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}>
          <Text style={{ color: "#7f1d1d", fontSize: 14 }}>
            Erreur : {error}
          </Text>
          <TouchableOpacity
            onPress={refresh}
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              marginTop: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <SchedulesList
        schedules={schedules}
        onRemove={removeSchedule}
        loading={loading}
        error={error}
      />
    </View>
  );
};

// Schedule List Component
const SchedulesList = ({ schedules, onRemove, loading, error }) => {
  if (schedules.length === 0 && !loading && !error) {
    return (
      <Text style={{ 
        color: "#6b7280", 
        textAlign: "center", 
        fontStyle: "italic" 
      }}>
        Aucune sauvegarde planifiée pour ce conteneur
      </Text>
    );
  }

  return (
    <>
      {schedules.map((schedule) => (
        <ScheduleItem
          key={schedule._id}
          schedule={schedule}
          onRemove={onRemove}
        />
      ))}
    </>
  );
};

// Individual Schedule Item Component
const ScheduleItem = ({ schedule, onRemove }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      backgroundColor: schedule.active ? "#f3f4f6" : "#e5e7eb",
      borderRadius: 8,
      marginBottom: 8,
    }}
  >
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        {schedule.hour}
      </Text>
      <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>
        {schedule.description}
      </Text>
      {schedule.lastRun && (
        <Text style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
          Dernière exécution : {new Date(schedule.lastRun).toLocaleString()}
        </Text>
      )}
    </View>
    
    <TouchableOpacity
      onPress={() => onRemove(schedule._id)}
      style={{
        backgroundColor: schedule.active ? "#ef4444" : "#9ca3af",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
      }}
    >
      <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
        {schedule.active ? "Désactiver" : "Désactivé"}
      </Text>
    </TouchableOpacity>
  </View>
);