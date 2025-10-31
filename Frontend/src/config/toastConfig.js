import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

const toastConfig = {
  success: ({ text1, text2 }) => (
    <Animated.View
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#10b981",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Success Icon */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#d1fae5",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ color: "#10b981", fontSize: 18, fontWeight: "bold" }}>
          ✓
        </Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: text2 ? 4 : 0,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </Animated.View>
  ),

  error: ({ text1, text2 }) => (
    <Animated.View
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#ef4444",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Error Icon */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#fee2e2",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ color: "#ef4444", fontSize: 18, fontWeight: "bold" }}>
          ✕
        </Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: text2 ? 4 : 0,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </Animated.View>
  ),

  info: ({ text1, text2 }) => (
    <Animated.View
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#3b82f6",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Info Icon */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#dbeafe",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ color: "#3b82f6", fontSize: 16, fontWeight: "bold" }}>
          i
        </Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: text2 ? 4 : 0,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </Animated.View>
  ),

  warning: ({ text1, text2 }) => (
    <Animated.View
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Warning Icon */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#fef3c7",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ color: "#f59e0b", fontSize: 18, fontWeight: "bold" }}>
          ⚠
        </Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: text2 ? 4 : 0,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </Animated.View>
  ),

  confirmDelete: ({ text1, text2, props }) => (
    <Animated.View
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 20,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
        borderWidth: 1,
        borderColor: "#f3f4f6",
      }}
    >
      {/* Header with Icon */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#fee2e2",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ color: "#dc2626", fontSize: 20, fontWeight: "bold" }}>
            🗑️
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            color: "#1f2937",
            flex: 1,
          }}
        >
          Confirm Deletion
        </Text>
      </View>

      {/* Message */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#374151",
          marginBottom: text2 ? 8 : 20,
          lineHeight: 22,
        }}
      >
        {text1}
      </Text>

      {text2 && (
        <Text
          style={{
            fontSize: 14,
            color: "#6b7280",
            marginBottom: 20,
            lineHeight: 20,
          }}
        >
          {text2}
        </Text>
      )}

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Toast.hide();
          }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            backgroundColor: "#f9fafb",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            minWidth: 80,
            alignItems: "center",
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: "#374151",
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.onConfirm();
            Toast.hide();
          }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            backgroundColor: "#dc2626",
            minWidth: 80,
            alignItems: "center",
            shadowColor: "#dc2626",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  ),

  // Loading toast with animated dots
  loading: ({ text1, text2 }) => (
    <Animated.View
      style={{
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#8b5cf6",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Loading Spinner */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#ede9fe",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Animated.View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#8b5cf6",
            borderTopColor: "transparent",
          }}
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: text2 ? 4 : 0,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </Animated.View>
  ),
};

export default toastConfig;