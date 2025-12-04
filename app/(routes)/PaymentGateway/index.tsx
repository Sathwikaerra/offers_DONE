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

interface Plan {
  id: number;
  name: string;
  period: string;
  amount: number;
  description: string;
}

const PaymentScreen: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/plans/v1/all`);
        
        console.log(res.data?.data)
        if (res.data.ok)
          {
              setPlans(res.data?.data);
          } 
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async (plan: Plan) => {
    setLoading(true);
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
      setLoading(false);
      return;
    }

    // 2️⃣ Razorpay options
    const options = {
      key: "rzp_test_RLKMqkAfF2WtPo",
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
      theme: { color: "#F37254" },
    };

    try {
      const data = await RazorpayCheckout.open(options);

      // 3️⃣ Verify payment
      const verifyRes = await postData(`/payments/v1/verify-payment`, {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      console.log(verifyRes)
      if (verifyRes.success) {
        // 4️⃣ Start membership
        const membershipRes = await postData(`/user/v1/start-membership`, {
          planType: plan.period,
        });


        if (membershipRes.membership.status==='active') {
          alert("✅ Membership Activated!");
          router.push("/(drawer)/(tabs)/create")
        } else {
          alert("⚠️ Payment done but failed to activate membership.");
        }
      } else {
        alert("⚠️ Payment verification failed!");
      }
    } catch (error) {
      console.error("Error in checkout:", error);
      alert("❌ Payment failed.");
    } finally {
      setLoading(false);
      setConfirmVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Plan</Text>

      {loading && <ActivityIndicator size="large" color="#F37254" />}

     <FlatList
  data={plans}
  keyExtractor={(item) => item._id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedPlan(item); // full plan
        setConfirmVisible(true);
      }}
    >
      <Text style={styles.planName}>{item.name}</Text>
      <Text style={styles.planAmount}>₹{item.amount}</Text>
      <Text style={styles.planDesc}>{item.description}</Text>
    </TouchableOpacity>
  )}
/>

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

    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  card: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
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
});
