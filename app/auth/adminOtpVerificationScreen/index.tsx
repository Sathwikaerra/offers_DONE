import axios from "axios";
import { BACKEND_URL } from "../../../constants/theme"; // update path
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OtpVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>(); // coming from login
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    if (otp.length < 4) {
      setErrorMessage("OTP is too short");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/v1/verify-otp`, {
        email,
        otp,
      });

      if (res.status === 200) {
        setLoading(false);

        if (res.data.ok === true) {
          // ✅ Save admin info securely
          await AsyncStorage.setItem("adminInfo", JSON.stringify({
            token: res.data.token,   // make sure backend sends token
            email: email,
            role: "admin",
          }));

          // ✅ Navigate to admin index
          router.replace("/admin/home");
        } else {
          Alert.alert("Not authorized", "This account is not admin");
        }
      } else {
        setErrorMessage(res.data.msg || "Invalid OTP");
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.response?.data);
      setErrorMessage(error.response?.data?.msg || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP for {email}</Text>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: "green", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  error: { color: "red", marginBottom: 10 },
});
