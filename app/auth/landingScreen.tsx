import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { COLORS, FONT, BACKEND_URL } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { router, Stack, useNavigation } from "expo-router";
import axios from "axios";
import { useSession } from "@/provider/ctx";
import Toast from "react-native-toast-message";

const LoginWithOTP = () => {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [showNameFields, setShowNameFields] = useState(false);
  const [first, setFirstName] = useState("");
  const [last, setLastName] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const { signIn } = useSession();

  useLayoutEffect(() => {
    navigation.setOptions({
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
  }, []);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Invalid number",
        text2: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/auth/v1/send-otp`, {
        mobileNumber: mobile,
      });
      setOtpSent(true);
      setSessionId(res.data.sessionId);
      Toast.show({
        type: "success",
        text1: "OTP Sent 🚀",
        text2: "We’ve sent an OTP to your mobile number",
      });
    } catch (err) {
      console.log("OTP Send Error:", err);
      Toast.show({
        type: "error",
        text1: "Failed to send OTP 😕",
        text2: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a valid 6-digit code",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/auth/v1/verify-otp`, {
        mobileNumber: mobile,
        otp,
        sessionId,
      });

      const token = res.data.token;
      setToken(token);
      signIn(token);

      if (!res.data.user.name?.first) {
        setUserId(res.data?.user?._id);
        setShowNameFields(true);
        Toast.show({
          type: "info",
          text1: "OTP Verified ✅",
          text2: "Please enter your full name to continue",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Welcome Back 👋",
          text2: "You’ve successfully logged in!",
        });
        router.replace("/(drawer)/(tabs)/");
      }
    } catch (err) {
      console.log("Verify OTP Error:", err);
      Toast.show({
        type: "error",
        text1: "Invalid or expired OTP ⚠️",
        text2: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Name for new user
  const handleSaveName = async () => {
    if (!first.trim()) {
      Toast.show({
        type: "error",
        text1: "First name required ✏️",
        text2: "Please enter your first name",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${BACKEND_URL}/auth/v1/update-fullname`,
        { first, last, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Toast.show({
        type: "success",
        text1: "Profile Updated 🎉",
        text2: "Welcome to OffersHolic!",
      });

      router.replace("/(drawer)/(tabs)/");
    } catch (err) {
      console.log("Save Name Error:", err);
      Toast.show({
        type: "error",
        text1: "Update Failed ❌",
        text2: "Could not save your profile info",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* 🔹 Top Section */}
        <View style={styles.topSection}>
          <Image
            source={require("@/assets/images/adaptive_icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to OffersHolic</Text>
        </View>

        {/* 🔹 Middle Section */}
        <ScrollView
          style={styles.middleSection}
          contentContainerStyle={{ alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Login or Signup</Text>
            <View style={styles.line} />
          </View>

          {!showNameFields ? (
            <>
              {!otpSent ? (
                <>
                  <View style={styles.mobileContainer}>
                    <View style={styles.flagBox}>
                      <Text style={{ fontSize: 18 }}>🇮🇳 +91</Text>
                    </View>
                    <TextInput
                      style={styles.mobileInput}
                      placeholder="Enter Mobile Number"
                      placeholderTextColor="#888"
                      keyboardType="number-pad"
                      maxLength={10}
                      value={mobile}
                      onChangeText={setMobile}
                    />
                  </View>

                  <Button
                    onPress={handleSendOtp}
                    variant={"default"}
                    label={loading ? "Sending..." : "Continue"}
                  />
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor="#888"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <Button
                    onPress={handleVerifyOtp}
                    variant={"default"}
                    label={loading ? "Verifying..." : "Verify OTP"}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#888"
                value={first}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name (optional)"
                placeholderTextColor="#888"
                value={last}
                onChangeText={setLastName}
              />
              <Button
                onPress={handleSaveName}
                variant={"default"}
                label={loading ? "Saving..." : "Save & Continue"}
              />
            </>
          )}
        </ScrollView>

        {/* 🔹 Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.agreementText}>
            By continuing, you agree to our{" "}
            <Text
              style={styles.linkText}
              onPress={() => Toast.show({
                type: "info",
                text1: "Terms & Conditions 📜",
                text2: "Redirect to Terms & Conditions page",
              })}
            >
              Terms & Conditions
            </Text>
          </Text>
        </View>

        {/* 👈 Mount Toast Here */}
      </KeyboardAvoidingView>
       <Toast />
    </>
  );
};

export default LoginWithOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topSection: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 16,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: 20,
    marginTop: 8,
  },
  middleSection: {
    flex: 2,
    width: "100%",
    padding: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#444",
    fontFamily: FONT.medium,
  },
  mobileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    overflow: "hidden",
  },
  flagBox: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  mobileInput: {
    flex: 1,
    borderColor: "#222",
    borderWidth: 0.4,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: FONT.medium,
    color: "#000",
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    width: "100%",
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
    borderColor: "#222",
    borderWidth: 0.4,
  },
  bottomSection: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  agreementText: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    fontFamily: FONT.medium,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});