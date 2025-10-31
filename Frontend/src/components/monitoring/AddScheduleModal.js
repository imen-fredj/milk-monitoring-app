import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import toast from "react-hot-toast";

export const AddScheduleModal = ({
  visible,
  onClose,
  containers,
  activeContainerId,
  onAdd,
}) => {
  const [hour, setHour] = useState("");

  const handleAddSchedule = async () => {
    try {
      // Validate hour format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(hour)) {
        toast.error("Veuillez entrer l'heure au format HH:MM (24 heures)");
        return;
      }

      const activeContainer = containers.find(c => c.id === activeContainerId);
      
      await onAdd({
        containerId: activeContainerId,
        containerName: activeContainer?.name,
        hour,
        description: "Sauvegarde automatique depuis l'application",
      });

      setHour("");
      onClose();
      toast.success("Planification ajoutée !");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClose = () => {
    onClose();
    setHour("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Ajouter une planification
          </Text>
          
          <Text style={styles.inputLabel}>
            Heure (format 24 heures)
          </Text>
          <TextInput
            placeholder="HH:MM (ex: 14:30)"
            value={hour}
            onChangeText={setHour}
            style={styles.textInput}
            maxLength={5}
          />
          
          <TouchableOpacity
            onPress={handleAddSchedule}
            style={[styles.modalButton, styles.saveButton]}
          >
            <Text style={styles.saveButtonText}>
              Sauvegarder la planification
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.modalButton, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>
              Annuler
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Modal Styles
const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#2563eb",
  },
  cancelButton: {
    backgroundColor: "#9ca3af",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
};