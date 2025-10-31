import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { alertManagementStyles as styles } from "../../styles/alertManagementStyles";

const AnimatedHeader = ({ headerAnim, onCreatePress }) => {
  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.title}>Gestion des Alertes</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreatePress}
        >
          <Text style={styles.createButtonText}>+ Créer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default AnimatedHeader;