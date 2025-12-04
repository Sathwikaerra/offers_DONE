import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { COLORS, FONT } from "@/constants/theme";

export default function MainIndex() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await AsyncStorage.removeItem("adminInfo"); // remove admin info
              router.replace("/auth/landingScreen"); // redirect to landing
            } catch (error) {
              console.log("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Admin 🚀</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  button: { backgroundColor: "red", padding: 15, borderRadius: 8, width: "60%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
