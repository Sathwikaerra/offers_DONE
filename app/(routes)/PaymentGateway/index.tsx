// PaymentScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import { BACKEND_URL } from "@/constants/theme";
import { postData } from "@/lib/axiosUtility";
import { router } from "expo-router";
import { RAZORPAY_KEY } from "@env";
import { Bold } from "lucide-react-native";

interface Plan {
  id: number;
  name: string;
  period: string;
  amount: number;
  description: string;
}

const PaymentScreen: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // 🔹 Custom alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "warning">(
    "success"
  );
  const [alertMessage, setAlertMessage] = useState("");

  // 🔹 Custom alert function
  const showAlert = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/plans/v1/all`);
        if (res.data.ok) {
          setPlans(res.data?.data);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        showAlert("error", "❌ Failed to fetch plans. Please try again.");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async (plan: Plan) => {
    setPaymentLoading(true);
    let order;

    // 1️⃣ Create order
    try {
      const res = await postData(`/payments/v1/create-order`, {
        amount: plan.amount,
      });
      order = res.order || res.data.order;
      if (!order) throw new Error("Order not created");
    } catch (error) {
      console.error("Error creating order:", error);
      showAlert("error", "❌ Failed to create payment order.");
      setPaymentLoading(false);
      return;
    }

    // 2️⃣ Razorpay options
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Offersholic",
      description: plan.description,
      order_id: order.id,
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: { color: "#4CAF50" },
    };

    try {
      const data = await RazorpayCheckout.open(options);

      // 3️⃣ Verify payment
      const verifyRes = await postData(`/payments/v1/verify-payment`, {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      if (verifyRes.success) {
        // 4️⃣ Start membership
        const membershipRes = await postData(`/user/v1/start-membership`, {
          planType: plan.period,
        });

        if (membershipRes.membership.status === "active") {
          showAlert("success", "✅ Membership Activated!");
          router.push("/(drawer)/(tabs)/create");
        } else {
          showAlert(
            "warning",
            "⚠️ Payment done but failed to activate membership."
          );
        }
      } else {
        showAlert("error", "⚠️ Payment verification failed!");
      }
    } catch (error) {
      console.error("Error in checkout:", error);
      showAlert("error", "❌ Payment failed.");
    } finally {
      setPaymentLoading(false);
      setConfirmVisible(false);
    }
  };

  // Show loader if fetching plans
  if (plansLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F37254" />
<Text style={{ marginTop: 10, fontWeight: "700" }}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Plan</Text>

      {paymentLoading && (
        <ActivityIndicator
          size="large"
          color="#F37254"
          style={{ marginVertical: 20 }}
        />
      )}

      <FlatList
        data={plans}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedPlan(item);
              setConfirmVisible(true);
            }}
          >
            <Text style={styles.planName}>{item.name}</Text>
            <Text style={styles.planAmount}>₹{item.amount}</Text>
            <Text style={styles.planDesc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Confirm Purchase Modal */}
      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Confirm purchase of {selectedPlan?.name}?{"\n\n"}
              {selectedPlan?.description}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "gray" }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#F37254" }]}
                onPress={() => selectedPlan && handlePayment(selectedPlan)}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal */}
      <Modal
        transparent
        visible={alertVisible}
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.alertBox,
              alertType === "success" && { borderLeftColor: "green" },
              alertType === "error" && { borderLeftColor: "red" },
              alertType === "warning" && { borderLeftColor: "orange" },
            ]}
          >
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    marginTop: 45,
    textAlign: "center",
  },
  card: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
    gap:15,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    width:290,
    margin:'auto',
    elevation: 3,
  },
  planName: { fontSize: 18, fontWeight: "600" },
  planAmount: { fontSize: 16, color: "#F37254", marginVertical: 5 },
  planDesc: { fontSize: 14, color: "#555" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
  },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // 🔹 Custom Alert Styles
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    borderLeftWidth: 6,
    alignItems: "center",
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  alertButton: {
    backgroundColor: "#F37254",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  alertButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
