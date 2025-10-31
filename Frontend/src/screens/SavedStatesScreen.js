import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import Toast from "react-native-toast-message"; // ✅ changé pour le toast RN
import { useSavedStates } from "../hooks/states/useSavedStates";
import { useStateFilters } from "../hooks/states/useStateFilters";
import { useMultiSelect } from "../hooks/states/useMultiSelect";
import { sensorStyles } from "../styles/monitoringStyles";

// Composants
import StatusIndicator from "../components/savedStates/StatusIndicator";
import FilterSection from "../components/savedStates/FilterSection";
import SelectionActions from "../components/savedStates/SelectionActions";
import StatsCards from "../components/savedStates/StatsCards";
import StateCard from "../components/savedStates/StateCard";
import EmptyState from "../components/savedStates/EmptyState";

const SavedStatesScreen = ({ navigation, setCurrentScreen }) => {
  const { states, loading, error, removeState, exportPdf, fetchStates } =
    useSavedStates();

  const {
    selectedContainer,
    setSelectedContainer,
    selectedDateFilter,
    setSelectedDateFilter,
    availableContainers,
    dateFilters,
    filteredStates,
    clearFilters,
    hasActiveFilters,
  } = useStateFilters(states);

  const {
    isSelectionMode,
    selectedItems: selectedStates,
    toggleSelectionMode,
    toggleItemSelection,
    selectAll,
    deselectAll,
    exitSelectionMode,
  } = useMultiSelect();

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Effets d'animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculs des statistiques
  const totalStates = filteredStates.length;
  const recentStates = useMemo(() => {
    return filteredStates.filter((s) => {
      const createdDate = new Date(s.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length;
  }, [filteredStates]);

  // Gestionnaires d'événements
  const handleDelete = (ids) => {
    const idArray = Array.isArray(ids) ? ids : [ids];

    Toast.show({
      type: "confirmDelete",
      text1:
        idArray.length > 1
          ? `Supprimer ${idArray.length} états sauvegardés ?`
          : "Supprimer cet état sauvegardé ?",
      text2:
        idArray.length > 1
          ? "Ceci supprimera définitivement tous les états sélectionnés de votre appareil."
          : "Cette action ne peut pas être annulée. Les données d'état seront définitivement supprimées.",
      props: {
        onConfirm: async () => {
          // Afficher le chargement pendant la suppression
          Toast.show({
            type: "loading",
            text1: "Suppression...",
            text2: "Suppression des états du stockage",
            autoHide: false,
          });

          try {
            // Effectuer les suppressions
            for (const id of idArray) {
              await removeState(id);
            }

            exitSelectionMode?.(); // Sortir du mode sélection si suppression en lot

            // Masquer le chargement et afficher le succès
            Toast.hide();

            setTimeout(() => {
              Toast.show({
                type: "success",
                text1:
                  idArray.length > 1
                    ? `${idArray.length} états supprimés`
                    : "État supprimé avec succès",
                text2: "Les données sélectionnées ont été supprimées",
                visibilityTime: 3000,
              });
            }, 150);
          } catch (error) {
            // Masquer le chargement et afficher l'erreur
            Toast.hide();

            setTimeout(() => {
              Toast.show({
                type: "error",
                text1: "Échec de la suppression",
                text2:
                  "Veuillez réessayer ou vérifier vos autorisations de stockage",
                visibilityTime: 4000,
              });
            }, 150);

            console.error("Erreur de suppression:", error);
          }
        },
      },
      autoHide: false,
    });
  };

  const handleExport = async (id) => {
    Toast.show({
      type: "loading",
      text1: "Génération du PDF...",
      text2: "Création de votre fichier d'exportation",
      autoHide: false,
    });

    try {
      const pdfBlob = await exportPdf(id);

      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `etat_sauvegarde_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        Toast.hide();

        setTimeout(() => {
          Toast.show({
            type: "success",
            text1: "PDF exporté avec succès !",
            text2: "Le fichier a été téléchargé sur votre appareil",
            visibilityTime: 3000,
          });
        }, 150);
      } else {
        Toast.hide();

        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "Échec de l'exportation",
            text2: "Impossible de générer le fichier PDF",
            visibilityTime: 4000,
          });
        }, 150);
      }
    } catch (error) {
      Toast.hide();

      setTimeout(() => {
        Toast.show({
          type: "error",
          text1: "Erreur d'exportation",
          text2: "Veuillez vérifier votre espace de stockage et réessayer",
          visibilityTime: 4000,
        });
      }, 150);

      console.error("Erreur d'exportation:", error);
    }
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedStates);
    if (ids.length === 0) return;

    handleDelete(ids); // réutiliser le même flux de confirmation
  };

  const handleSelectAll = () => {
    const allIds = filteredStates.map((s) => s._id);
    selectAll(allIds);
  };

  const handleStateCardPress = (stateId) => {
    if (isSelectionMode) {
      toggleItemSelection(stateId);
    }
  };

  return (
    <SafeAreaView style={sensorStyles.container}>
      <ScrollView
        style={sensorStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {/* En-tête */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "800",
                color: "#1f2937",
                paddingHorizontal: 6,
                paddingTop: 15,
              }}
            >
              {isSelectionMode
                ? `${selectedStates.size} Sélectionné(s)`
                : "États Sauvegardés"}
            </Text>

            <TouchableOpacity
              onPress={toggleSelectionMode}
              style={{
                backgroundColor: isSelectionMode ? "#ef4444" : "#3b82f6",
                paddingVertical: 8,
                paddingHorizontal: 16,
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
                {isSelectionMode ? "Annuler" : "Sélectionner"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Actions de sélection */}
          {isSelectionMode && (
            <SelectionActions
              selectedCount={selectedStates.size}
              totalCount={filteredStates.length}
              onSelectAll={handleSelectAll}
              onDeselectAll={deselectAll}
              onBulkDelete={handleBulkDelete}
            />
          )}

          <StatusIndicator
            totalStates={totalStates}
            recentStates={recentStates}
          />

          <FilterSection
            selectedContainer={selectedContainer}
            setSelectedContainer={setSelectedContainer}
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
            availableContainers={availableContainers}
            dateFilters={dateFilters}
            states={states}
          />

          {/* Résumé des résultats */}
          {hasActiveFilters && (
            <View
              style={{
                backgroundColor: "#eff6ff",
                padding: 12,
                borderRadius: 12,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: "#3b82f6",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#1e40af",
                  fontWeight: "600",
                }}
              >
                Affichage de {totalStates} état(s)
                {selectedContainer !== "all" && ` de ${selectedContainer}`}
                {selectedDateFilter !== "all" &&
                  ` (${
                    dateFilters.find((f) => f.key === selectedDateFilter)?.label
                  })`}
              </Text>
              <TouchableOpacity
                onPress={clearFilters}
                style={{
                  alignSelf: "flex-start",
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#3b82f6",
                    fontWeight: "500",
                    textDecorationLine: "underline",
                  }}
                >
                  Effacer les filtres
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cartes de statistiques */}
          {totalStates > 0 && (
            <StatsCards
              totalStates={totalStates}
              recentStates={recentStates}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          )}
        </View>

        {/* État de chargement */}
        {loading && (
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
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text
              style={{
                fontSize: 16,
                color: "#6b7280",
                marginTop: 12,
                fontWeight: "500",
              }}
            >
              Chargement des états sauvegardés...
            </Text>
          </View>
        )}

        {/* État d'erreur */}
        {error && (
          <View
            style={{
              backgroundColor: "#fecaca",
              padding: 16,
              borderRadius: 12,
              margin: 24,
            }}
          >
            <Text
              style={{
                color: "#7f1d1d",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Erreur : {error}
            </Text>
            <TouchableOpacity
              onPress={fetchStates}
              style={{
                backgroundColor: "#ef4444",
                paddingVertical: 8,
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

        {/* État vide */}
        {!loading && filteredStates.length === 0 && !error && (
          <EmptyState
            hasStates={states.length > 0}
            onClearFilters={clearFilters}
          />
        )}

        {/* Liste des états */}
        {filteredStates.map((state) => (
          <StateCard
            key={state._id}
            state={state}
            isSelectionMode={isSelectionMode}
            isSelected={selectedStates.has(state._id)}
            onPress={handleStateCardPress}
            onExport={handleExport}
            onDelete={handleDelete}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedStatesScreen;
