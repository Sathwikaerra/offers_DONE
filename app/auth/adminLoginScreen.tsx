import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from 'expo-router'
import axios from "axios";
import { BACKEND_URL } from "../../constants/theme"; 


export default function Login() {
  const [email, setEmail] = useState("");
 

// update path if different

const handleSendOtp = async () => {
  if (!email.includes("@")) {
    Alert.alert("Invalid email", "Please enter a valid email.");
    return;
  }

  try {
    const res = await axios.post(`${BACKEND_URL}/auth/v1/admin-login`, {
      email,
    });

    if (res.status === 200) {
      Alert.alert("OTP Sent", "Please check your email for the OTP.");
      router.push({
  pathname: "/auth/adminOtpVerificationScreen",
  params: { email },
});
    } else {
      Alert.alert("Error", res.data.msg || "Failed to send OTP");
    }
  } catch (error: any) {
    console.log("Send OTP Error:", error.response?.data || error.message);
    Alert.alert("Error", error.response?.data?.msg || "Something went wrong.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
