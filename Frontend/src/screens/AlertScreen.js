import React, { useState, useMemo, useEffect } from "react";
import { SafeAreaView, Animated } from "react-native";

// Hooks
import { useAlerts } from "../hooks/alerts/useAlerts";
import { useAnimations } from "../hooks/useAnimations";

// Components
import AlertCreationModal from "../components/alerts/AlertCreationModal";
import AnimatedHeader from "../components/alerts/AnimatedHeader";
import AlertFilters from "../components/alerts/AlertFilters";
import AlertList from "../components/alerts/AlertList";
import DeleteConfirmModal from "../components/alerts/DeleteConfirmModal";
import {
  LoadingState,
  ErrorState,
} from "../components/alerts/LoadingErrorStates";

// Utils
import { showAlertMessage, filterAlerts } from "../utils/alertUtils";

// Styles
import { globalStyles } from "../styles/globalStyles";

const AlertManagementScreen = () => {
  const [filters, setFilters] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const {
    alerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    refreshAlerts,
  } = useAlerts(filters);

  const { pulseAnim, fadeAnim, slideAnim } = useAnimations();

  // Animation values
  const [headerAnim] = useState(new Animated.Value(0));
  const [cardsAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(cardsAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateAlert = async (alertData) => {
    try {
      setModalLoading(true);

      if (editingAlert) {
        await updateAlert(editingAlert._id, alertData);
        showAlertMessage("success", "Alerte mise à jour avec succès");
      } else {
        await createAlert(alertData);
        showAlertMessage("success", "Alerte créée avec succès");
      }

      setShowCreateModal(false);
      setEditingAlert(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'alerte:", error);
      showAlertMessage("error", error.message);
      throw error; // Re-throw to let modal handle the error state
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingAlert(null);
  };

  const handleDeleteAlert = (id) => {
    if (!id) {
      showAlertMessage("error", "Aucun ID d'alerte trouvé");
      return;
    }

    setAlertToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAlert = async () => {
    try {
      await deleteAlert(alertToDelete);
      setShowDeleteConfirm(false);
      setAlertToDelete(null);
      showAlertMessage("success", "Alerte supprimée avec succès");
    } catch (error) {
      setShowDeleteConfirm(false);
      setAlertToDelete(null);
      showAlertMessage("error", `Échec de la suppression: ${error.message}`);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
    setAlertToDelete(null);
  };

  const handleToggleAlert = async (id) => {
    try {
      await toggleAlert(id);
    } catch (error) {
      showAlertMessage("error", error.message);
    }
  };

  const filteredAlerts = useMemo(() => {
    return filterAlerts(alerts, filters);
  }, [alerts, filters]);

  return (
    <SafeAreaView
      style={[globalStyles.container, { backgroundColor: "#f1f5f9" }]}
    >
      <AnimatedHeader
        headerAnim={headerAnim}
        onCreatePress={() => setShowCreateModal(true)}
      />

      <AlertFilters filters={filters} onFiltersChange={setFilters} />

      {error && <ErrorState error={error} onRetry={refreshAlerts} />}

      {loading && <LoadingState />}

      <AlertList
        filteredAlerts={filteredAlerts}
        loading={loading}
        fadeAnim={fadeAnim}
        cardsAnim={cardsAnim}
        onRefresh={refreshAlerts}
        onToggleAlert={handleToggleAlert}
        onEditAlert={handleEditAlert}
        onDeleteAlert={handleDeleteAlert}
      />

      <AlertCreationModal
        visible={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleCreateAlert}
        editingAlert={editingAlert}
        loading={modalLoading}
      />

      <DeleteConfirmModal
        visible={showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDeleteAlert}
      />
    </SafeAreaView>
  );
};

export default AlertManagementScreen;
