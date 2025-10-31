import React from "react";
import { FlatList } from "react-native";
import AlertItem from "./AlertItem";
import { EmptyState } from "./LoadingErrorStates";
import { alertManagementStyles as styles } from "../../styles/alertManagementStyles";

const AlertList = ({ 
  filteredAlerts, 
  loading, 
  fadeAnim, 
  cardsAnim, 
  onRefresh, 
  onToggleAlert, 
  onEditAlert, 
  onDeleteAlert 
}) => {
  const renderAlertItem = ({ item, index }) => (
    <AlertItem
      item={item}
      index={index}
      fadeAnim={fadeAnim}
      cardsAnim={cardsAnim}
      onToggle={onToggleAlert}
      onEdit={onEditAlert}
      onDelete={onDeleteAlert}
    />
  );

  return (
    <FlatList
      data={filteredAlerts}
      renderItem={renderAlertItem}
      keyExtractor={(item) => item._id}
      refreshing={loading}
      onRefresh={onRefresh}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<EmptyState loading={loading} />}
    />
  );
};

export default AlertList;