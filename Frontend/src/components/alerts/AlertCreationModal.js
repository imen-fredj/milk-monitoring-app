// components/AlertCreationModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Constants
const METRICS = [
  { label: "Température", value: "temperature", color: "#f59e0b", icon: "thermometer" },
  { label: "Niveau de pH", value: "pH", color: "#10b981", icon: "water" },
  { label: "Poids", value: "weight", color: "#3b82f6", icon: "scale" },
  { label: "Volume", value: "volume", color: "#06b6d4", icon: "beaker" },
  { label: "Score de qualité", value: "qualityScore", color: "#8b5cf6", icon: "star" },
];

const OPERATORS = [
  { label: ">", value: ">", description: "Supérieur à", icon: "chevron-up" },
  { label: "≥", value: ">=", description: "Supérieur ou égal à", icon: "chevron-up-circle" },
  { label: "<", value: "<", description: "Inférieur à", icon: "chevron-down" },
  { label: "≤", value: "<=", description: "Inférieur ou égal à", icon: "chevron-down-circle" },
];

const AlertCreationModal = ({
  visible,
  onClose,
  onSave,
  editingAlert = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    containerId: "",
    metric: "temperature",
    operator: ">",
    threshold: "",
  });

  const [errors, setErrors] = useState({});
  const [showMetricPicker, setShowMetricPicker] = useState(false);
  const [showOperatorPicker, setShowOperatorPicker] = useState(false);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const inputFocusAnims = useRef(
    Array(4).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (editingAlert) {
      setFormData({
        name: editingAlert.name,
        containerId: editingAlert.containerId || "",
        metric: editingAlert.metric,
        operator: editingAlert.operator,
        threshold: editingAlert.threshold.toString(),
      });
    } else {
      resetForm();
    }
  }, [editingAlert]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const resetForm = () => {
    setFormData({
      name: "",
      containerId: "",
      metric: "temperature",
      operator: ">",
      threshold: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de l'alerte est requis";
    }

    if (!formData.threshold || isNaN(parseFloat(formData.threshold))) {
      newErrors.threshold = "Un seuil valide est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const alertData = {
        ...formData,
        threshold: parseFloat(formData.threshold),
        ...(formData.containerId.trim()
          ? { containerId: formData.containerId.trim() }
          : {}),
      };

      await onSave(alertData);
      // Reset form after successful save
      resetForm();
    } catch (error) {
      // Error is handled in parent component
      console.error("Error in modal:", error);
    }
  };

  const handleClose = () => {
    setShowMetricPicker(false);
    setShowOperatorPicker(false);
    resetForm();
    onClose();
  };

  const handleInputFocus = (index) => {
    Animated.timing(inputFocusAnims[index], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = (index) => {
    Animated.timing(inputFocusAnims[index], {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getSelectedMetric = () => {
    return METRICS.find((m) => m.value === formData.metric);
  };

  const getSelectedOperator = () => {
    return OPERATORS.find((op) => op.value === formData.operator);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <SafeAreaView style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <Text style={styles.modalTitle}>
                  {editingAlert ? "Modifier l'alerte" : "Nouvelle alerte"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingAlert 
                    ? "Modifiez les paramètres de votre alerte" 
                    : "Configurez votre alerte de surveillance"
                  }
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.saveButton,
                  loading && styles.saveButtonDisabled
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingAlert ? "Modifier" : "Créer"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Alert Name */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="notifications" size={16} color="#3b82f6" />
                  {" "}Informations générales
                </Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Nom de l'alerte <Text style={styles.required}>*</Text>
                  </Text>
                  <Animated.View
                    style={[
                      styles.inputContainer,
                      errors.name && styles.inputError,
                      {
                        borderColor: inputFocusAnims[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: ["#e5e7eb", "#3b82f6"],
                        }),
                      },
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      value={formData.name}
                      onChangeText={(text) => {
                        setFormData((prev) => ({ ...prev, name: text }));
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: null }));
                        }
                      }}
                      onFocus={() => handleInputFocus(0)}
                      onBlur={() => handleInputBlur(0)}
                      placeholder="Ex: Alerte température élevée"
                      placeholderTextColor="#9ca3af"
                    />
                  </Animated.View>
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ID du conteneur</Text>
                  <Text style={styles.inputHint}>
                    Laissez vide pour surveiller tous les conteneurs
                  </Text>
                  <Animated.View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor: inputFocusAnims[1].interpolate({
                          inputRange: [0, 1],
                          outputRange: ["#e5e7eb", "#3b82f6"],
                        }),
                      },
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      value={formData.containerId}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, containerId: text }))
                      }
                      onFocus={() => handleInputFocus(1)}
                      onBlur={() => handleInputBlur(1)}
                      placeholder="Ex: CONT-001"
                      placeholderTextColor="#9ca3af"
                    />
                  </Animated.View>
                </View>
              </View>

              {/* Alert Conditions */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="settings" size={16} color="#3b82f6" />
                  {" "}Conditions d'alerte
                </Text>

                {/* Metric Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Métrique à surveiller</Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowMetricPicker(!showMetricPicker)}
                  >
                    <View style={styles.pickerButtonContent}>
                      <View style={styles.pickerSelection}>
                        <View
                          style={[
                            styles.metricColorIndicator,
                            { backgroundColor: getSelectedMetric()?.color },
                          ]}
                        />
                        <Ionicons 
                          name={getSelectedMetric()?.icon || "analytics"} 
                          size={20} 
                          color={getSelectedMetric()?.color} 
                        />
                        <Text style={styles.pickerButtonText}>
                          {getSelectedMetric()?.label}
                        </Text>
                      </View>
                      <Ionicons
                        name={showMetricPicker ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#6b7280"
                      />
                    </View>
                  </TouchableOpacity>

                  {showMetricPicker && (
                    <Animated.View style={styles.pickerOptions}>
                      {METRICS.map((metric, index) => (
                        <TouchableOpacity
                          key={metric.value}
                          style={[
                            styles.pickerOption,
                            formData.metric === metric.value && styles.pickerOptionSelected,
                          ]}
                          onPress={() => {
                            setFormData((prev) => ({ ...prev, metric: metric.value }));
                            setShowMetricPicker(false);
                          }}
                        >
                          <View style={styles.pickerOptionContent}>
                            <View
                              style={[
                                styles.metricColorIndicator,
                                { backgroundColor: metric.color },
                              ]}
                            />
                            <Ionicons 
                              name={metric.icon} 
                              size={20} 
                              color={metric.color} 
                            />
                            <Text style={styles.pickerOptionText}>{metric.label}</Text>
                          </View>
                          {formData.metric === metric.value && (
                            <Ionicons name="checkmark" size={20} color="#3b82f6" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </Animated.View>
                  )}
                </View>

                {/* Condition Row */}
                <View style={styles.conditionRow}>
                  <View style={styles.operatorContainer}>
                    <Text style={styles.inputLabel}>Opérateur</Text>
                    <TouchableOpacity
                      style={styles.operatorButton}
                      onPress={() => setShowOperatorPicker(!showOperatorPicker)}
                    >
                      <View style={styles.operatorButtonContent}>
                        <Ionicons 
                          name={getSelectedOperator()?.icon} 
                          size={18} 
                          color="#3b82f6" 
                        />
                        <Text style={styles.operatorButtonText}>
                          {getSelectedOperator()?.label}
                        </Text>
                        <Ionicons
                          name={showOperatorPicker ? "chevron-up" : "chevron-down"}
                          size={16}
                          color="#6b7280"
                        />
                      </View>
                    </TouchableOpacity>

                    {showOperatorPicker && (
                      <Animated.View style={styles.operatorOptions}>
                        {OPERATORS.map((op) => (
                          <TouchableOpacity
                            key={op.value}
                            style={[
                              styles.operatorOption,
                              formData.operator === op.value && styles.operatorOptionSelected,
                            ]}
                            onPress={() => {
                              setFormData((prev) => ({ ...prev, operator: op.value }));
                              setShowOperatorPicker(false);
                            }}
                          >
                            <View style={styles.operatorOptionContent}>
                              <Ionicons 
                                name={op.icon} 
                                size={16} 
                                color={formData.operator === op.value ? "#3b82f6" : "#6b7280"} 
                              />
                              <View>
                                <Text style={[
                                  styles.operatorOptionLabel,
                                  formData.operator === op.value && styles.operatorOptionLabelSelected
                                ]}>
                                  {op.label}
                                </Text>
                                <Text style={styles.operatorOptionDescription}>
                                  {op.description}
                                </Text>
                              </View>
                            </View>
                            {formData.operator === op.value && (
                              <Ionicons name="checkmark" size={16} color="#3b82f6" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </Animated.View>
                    )}
                  </View>

                  <View style={styles.thresholdContainer}>
                    <Text style={styles.inputLabel}>
                      Seuil <Text style={styles.required}>*</Text>
                    </Text>
                    <Animated.View
                      style={[
                        styles.inputContainer,
                        styles.thresholdInput,
                        errors.threshold && styles.inputError,
                        {
                          borderColor: inputFocusAnims[2].interpolate({
                            inputRange: [0, 1],
                            outputRange: ["#e5e7eb", "#3b82f6"],
                          }),
                        },
                      ]}
                    >
                      <TextInput
                        style={[styles.textInput, styles.thresholdTextInput]}
                        value={formData.threshold}
                        onChangeText={(text) => {
                          setFormData((prev) => ({ ...prev, threshold: text }));
                          if (errors.threshold) {
                            setErrors((prev) => ({ ...prev, threshold: null }));
                          }
                        }}
                        onFocus={() => handleInputFocus(2)}
                        onBlur={() => handleInputBlur(2)}
                        placeholder="0"
                        keyboardType="numeric"
                        placeholderTextColor="#9ca3af"
                      />
                    </Animated.View>
                    {errors.threshold && (
                      <Text style={styles.errorText}>{errors.threshold}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Preview Section */}
              <View style={styles.previewSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="eye" size={16} color="#3b82f6" />
                  {" "}Aperçu de l'alerte
                </Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.previewTitle}>
                      {formData.name || "Nom de l'alerte"}
                    </Text>
                    <View style={styles.previewBadge}>
                      <View style={styles.previewBadgeDot} />
                      <Text style={styles.previewBadgeText}>Nouveau</Text>
                    </View>
                  </View>
                  <View style={styles.previewCondition}>
                    <Text style={styles.previewConditionText}>
                      Déclencher quand{" "}
                      <Text style={[styles.previewMetric, { color: getSelectedMetric()?.color }]}>
                        {getSelectedMetric()?.label}
                      </Text>
                      {" "}est{" "}
                      <Text style={styles.previewOperator}>
                        {getSelectedOperator()?.description.toLowerCase()}
                      </Text>
                      {" "}
                      <Text style={styles.previewThreshold}>
                        {formData.threshold || "0"}
                      </Text>
                    </Text>
                  </View>
                  {formData.containerId && (
                    <View style={styles.previewContainer}>
                      <Ionicons name="cube" size={14} color="#6b7280" />
                      <Text style={styles.previewContainerText}>
                        Conteneur: {formData.containerId}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.primaryButtonDisabled
                  ]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons 
                        name={editingAlert ? "checkmark" : "add"} 
                        size={16} 
                        color="#ffffff" 
                      />
                      <Text style={styles.primaryButtonText}>
                        {editingAlert ? "Modifier l'alerte" : "Créer l'alerte"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    fontStyle: "italic",
  },
  required: {
    color: "#ef4444",
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    minHeight: 48,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 4,
  },
  pickerButton: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerSelection: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricColorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
    fontWeight: "500",
  },
  pickerOptions: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  pickerOptionSelected: {
    backgroundColor: "#eff6ff",
  },
  pickerOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pickerOptionText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 8,
    fontWeight: "500",
  },
  conditionRow: {
    flexDirection: "row",
    gap: 12,
  },
  operatorContainer: {
    flex: 1,
  },
  operatorButton: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  operatorButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  operatorButtonText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  operatorOptions: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  operatorOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  operatorOptionSelected: {
    backgroundColor: "#eff6ff",
  },
  operatorOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  operatorOptionLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginLeft: 8,
  },
  operatorOptionLabelSelected: {
    color: "#3b82f6",
  },
  operatorOptionDescription: {
    fontSize: 11,
    color: "#6b7280",
    marginLeft: 8,
  },
  thresholdContainer: {
    flex: 1,
  },
  thresholdInput: {
    minHeight: 48,
  },
  thresholdTextInput: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  previewSection: {
    marginVertical: 16,
  },
  previewCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginRight: 4,
  },
  previewBadgeText: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "600",
  },
  previewCondition: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  previewConditionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  previewMetric: {
    fontWeight: "600",
  },
  previewOperator: {
    fontWeight: "600",
    color: "#374151",
  },
  previewThreshold: {
    fontWeight: "700",
    color: "#1e293b",
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
  },
  previewContainerText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  primaryButton: {
    flex: 2,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryButtonDisabled: {
    backgroundColor: "#9ca3af",
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  primaryButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "700",
  },
};

export default AlertCreationModal;