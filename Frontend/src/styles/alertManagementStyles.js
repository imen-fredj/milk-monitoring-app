// styles/alertManagementStyles.js
import { StyleSheet } from "react-native";

export const alertManagementStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1f2937",
  },
  filtersContainer: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  filtersScrollContent: {
    paddingRight: 24,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterButtonText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fef2f2",
    margin: 24,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  errorText: {
    color: "#991b1b",
    flex: 1,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  loadingContainer: {
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
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 12,
    fontWeight: "500",
  },
  listContainer: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 100, // Extra padding for floating button
  },
  alertItem: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  alertDecor: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    transform: [{ translateX: 20 }, { translateY: -20 }],
  },
  alertHeader: {
    marginBottom: 12,
  },
  alertTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  statusPaused: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  alertConditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  metricText: {
    fontSize: 12,
    fontWeight: "600",
  },
  alertCondition: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "500",
  },
  alertContainerContainer: {
    marginBottom: 12,
  },
  alertContainer: {
    fontSize: 14,
    color: "#6b7280",
  },
  alertFooter: {
    marginTop: 16,
  },
  alertLastTriggered: {
    fontSize: 15,
    color: "#9ca3af",
    marginBottom: 12,
  },
  alertActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  pauseButton: {
    backgroundColor: "#f59e0b",
  },
  activateButton: {
    backgroundColor: "#10b981",
  },
  editButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  deleteButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 16,
  },
  // Floating Action Button
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  modalCancelButton: {
    padding: 8,
  },
  modalCancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
  modalSaveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1f2937",
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    minWidth: 100,
    borderLeftWidth: 4,
  },
  pickerOptionSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  pickerOptionText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  pickerOptionTextSelected: {
    color: "#fff",
  },
  pickerOptionDescription: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteModalCancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  deleteModalDeleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteModalCancelText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteModalDeleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },createButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#3b82f6',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 16,
  shadowColor: '#3b82f6',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
  minWidth: 120,
  // Add a subtle gradient effect with border
  borderWidth: 1,
  borderColor: '#2563eb',
},

createButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: '700',
  letterSpacing: 0.5,
  marginLeft: 4, // Space after the + icon
},

// Add new styles for the enhanced button
createButtonIcon: {
  fontSize: 18,
  color: '#ffffff',
  fontWeight: '800',
},

createButtonPressed: {
  backgroundColor: '#2563eb',
  transform: [{ scale: 0.96 }],
  shadowOpacity: 0.2,
  shadowRadius: 4,
},

});