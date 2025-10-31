import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { alertManagementStyles as styles } from "../../styles/alertManagementStyles";

const DeleteConfirmModal = ({ 
  visible, 
  onClose, 
  onConfirm 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteModalTitle}>Supprimer l'alerte</Text>
          <Text style={styles.deleteModalText}>
            Êtes-vous sûr de vouloir supprimer cette alerte ? Cette action ne
            peut pas être annulée.
          </Text>

          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.deleteModalCancelButton]}
              onPress={onClose}
            >
              <Text style={styles.deleteModalCancelText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteModalButton, styles.deleteModalDeleteButton]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteModalDeleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmModal;