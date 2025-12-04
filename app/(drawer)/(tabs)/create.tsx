// import React, { useEffect, useState } from "react";
// import { 
//   View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal 
// } from "react-native";
// import { fetchData, postData } from "@/lib/axiosUtility";
// import { COLORS, FONT } from "@/constants/theme";
// import { router } from "expo-router";
// import { PremimumCreateAdScreen } from "../../(routes)/Pcreate/index";
// import { Gift, CreditCard } from 'lucide-react-native';
// import { useNavigation } from "expo-router";
// import { useRouter } from "expo-router";

// const SubscriptionScreen = () => {

//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(null);
//   const [confirmModal, setConfirmModal] = useState<{visible: boolean, type: "freeTrial" | "membership"}>({visible: false, type: "freeTrial"});

//   const fetchUserDetails = async () => {
//     try {
//       const data = await fetchData("/user/v1/current");
//       setUser(data);
//     } catch (error: any) {
//       console.error("Error fetching user details:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmAction = async () => {
//     try {
//       if(confirmModal.type === "freeTrial") {
//         await postData("/user/v1/start-free-trial", {});
//       } else {
//         await postData("/user/v1/start-membership", { planType: "monthly" });
//       }
//       setConfirmModal({visible:false, type:"freeTrial"});
//       fetchUserDetails();
//     } catch (err: any) {
//       console.error("Error:", err.message);
//     }
//   };

//   useEffect(() => { fetchUserDetails(); }, []);

//   if (loading) return (
//     <View style={styles.center}>
//       <ActivityIndicator size="large" color={COLORS.primary} />
//     </View>
//   );

//   if (!user) return (
//     <View style={styles.center}>
//       <Text style={styles.errorText}>Unable to load user details.</Text>
//     </View>
//   );

//   const freeTrialStatus = user?.freeTrial?.status || "inactive";
//   const membershipStatus = user?.membership?.status || "inactive";

//   if (freeTrialStatus === "active" || membershipStatus === "active") {
//     return <PremimumCreateAdScreen />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Subscription Options</Text>

//       {/* Free Trial Option */}
//       {freeTrialStatus === "expired"&& membershipStatus==='inactive' && <Text>Freetrail is Expired</Text>} 
//       {freeTrialStatus === "inactive" && (
//         <TouchableOpacity 
//           style={[styles.optionCard, styles.freeTrialCard]} 
//           onPress={() => setConfirmModal({visible:true, type:"freeTrial"})}
//         >
//           <Gift size={28} color="#fff" />
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.optionTitle}>Start Free Trial</Text>
//             <Text style={styles.optionSubtitle}>Try premium features for free 2 months</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       <View style={{ height: 15 }} />

//       {/* Membership Option */}
//        {membershipStatus === "expired" && (
//       <TouchableOpacity 
//         style={[styles.optionCard, styles.membershipCard]} 
//         onPress={() => router.push("/(routes)/PaymentGateway")}
//       >
//         <CreditCard size={28} color="#fff" />
//         <View style={{ marginLeft: 12 }}>
//           <Text style={styles.optionTitle}> Membership ended </Text>
//           <Text style={styles.optionSubtitle}>Start  membership again</Text>
//         </View>
//       </TouchableOpacity>
//     )}
//       {membershipStatus === "inactive" && (
//       <TouchableOpacity 
//         style={[styles.optionCard, styles.membershipCard]} 
//         onPress={() => router.push("/(routes)/PaymentGateway")} 
//       >
//         <CreditCard size={28} color="#fff" />
//         <View style={{ marginLeft: 12 }}>
//           <Text style={styles.optionTitle}>Start Membership</Text>
//           <Text style={styles.optionSubtitle}>Get full access to all features</Text>
//         </View>
//       </TouchableOpacity>
//     )}

//       {/* Confirmation Modal */}
//       <Modal
//         visible={confirmModal.visible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setConfirmModal({visible:false, type:"freeTrial"})}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               {confirmModal.type === "freeTrial" ? "Start Free Trial?" : "Start Membership?"}
//             </Text>
//             <Text style={styles.modalSubtitle}>
//               {confirmModal.type === "freeTrial" 
//                 ? "You will get 2 months of premium features for free." 
//                 : "You will have full access to all premium features."}
//             </Text>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.cancelButton]} 
//                 onPress={() => setConfirmModal({visible:false, type:"freeTrial"})}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.confirmButton]} 
//                 onPress={handleConfirmAction}
//               >
//                 <Text style={styles.confirmText}>Yes</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default SubscriptionScreen;

// const styles = StyleSheet.create({
//   container: { flex:1, padding:20, backgroundColor:'#f9fafb' },
//   title: { fontFamily:'Roboto-Bold', fontSize:24, textAlign:'center', marginBottom:20, color:'#1f2937' },
//   optionCard: {
//     flexDirection:'row', alignItems:'center', padding:18, borderRadius:16,
//     shadowColor:'#000', shadowOffset:{width:0,height:6}, shadowOpacity:0.15,
//     shadowRadius:10, elevation:5
//   },
//   freeTrialCard: { backgroundColor:'#60a5fa' },
//   membershipCard: { backgroundColor:'#f87171' },
//   optionTitle: { fontFamily:'Roboto-Bold', fontSize:18, color:'#fff' },
//   optionSubtitle: { fontFamily:'Roboto-Regular', fontSize:14, color:'#e5e7eb', marginTop:2 },
//   center: { flex:1, justifyContent:'center', alignItems:'center' },
//   errorText: { fontFamily:FONT.bold, fontSize:16, color:'red' },

//   // Modal
//   modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
//   modalContent: { width:'80%', backgroundColor:'#fff', borderRadius:20, padding:25, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.3, shadowRadius:10, elevation:10 },
//   modalTitle: { fontFamily:'Roboto-Bold', fontSize:20, marginBottom:10, color:'#111' },
//   modalSubtitle: { fontFamily:'Roboto-Regular', fontSize:14, textAlign:'center', marginBottom:20, color:'#555' },
//   modalButtons: { flexDirection:'row', justifyContent:'space-between', width:'100%' },
//   modalButton: { flex:1, padding:12, borderRadius:12, marginHorizontal:5, alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:6, elevation:4 },
//   cancelButton: { backgroundColor:'#e5e7eb' },
//   confirmButton: { backgroundColor:'#60a5fa' },
//   cancelText: { color:'#111', fontFamily:'Roboto-Bold', fontSize:16 },
//   confirmText: { color:'#fff', fontFamily:'Roboto-Bold', fontSize:16 },
// });

// SubscriptionScreen.tsx
import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal 
} from "react-native";
import { fetchData, postData } from "@/lib/axiosUtility";
import { FONT } from "@/constants/theme";
import { PremimumCreateAdScreen } from "../../(routes)/Pcreate/index";
import { Gift, CreditCard } from 'lucide-react-native';
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {CreateAdScreen} from "../../(routes)/create/index"

const SubscriptionScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{visible: boolean, type: "freeTrial" | "membership"}>({
    visible: false, type: "freeTrial"
  });

  const fetchUserDetails = async () => {
    try {
      const data = await fetchData("/user/v1/current");
      setUser(data);
    } catch (error: any) {
      console.error("Error fetching user details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    try {
      if(confirmModal.type === "freeTrial") {
        await postData("/user/v1/start-free-trial", {});
      } else {
        await postData("/user/v1/start-membership", { planType: "monthly" });
      }
      setConfirmModal({visible:false, type:"freeTrial"});
      fetchUserDetails();
    } catch (err: any) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => { fetchUserDetails(); }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );

  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Unable to load user details.</Text>
    </View>
  );

  const freeTrialStatus = user?.freeTrial?.status || "inactive";
  const membershipStatus = user?.membership?.status || "inactive";

  if ( membershipStatus === "active" && freeTrialStatus==='expired') {
    return <PremimumCreateAdScreen />;
  }

  if(freeTrialStatus === "active" && membershipStatus==='inactive')
  {
    return <CreateAdScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Subscription Options ✨</Text>

     
       {/* Free Trial Option */}
      {freeTrialStatus === "expired" && (
        <Text style={styles.expiredText}>⏳ Free trial expired</Text>
      )} 
      {freeTrialStatus === "inactive" && (
        <TouchableOpacity 
          style={styles.gradientCardWrapper} 
          onPress={() => setConfirmModal({visible:true, type:"freeTrial"})}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#60a5fa", "#3b82f6"]}
            start={{x:0, y:0}} end={{x:1, y:1}}
            style={styles.optionCard}
          >
            <Gift size={28} color="#fff" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.optionTitle}>Start Free Trial</Text>
              <Text style={styles.optionSubtitle}>2 months of premium features free</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={{ height: 15 }} />

      {/* Membership Option */}
      {(membershipStatus === "expired" || membershipStatus === "inactive") && (
        <TouchableOpacity 
          style={styles.gradientCardWrapper} 
          onPress={() => router.push("/(routes)/PaymentGateway")}
          activeOpacity={0.9}
        >
          <LinearGradient
colors={["#ff7b7b", "#ff4d4d", "#d60000", "#7f0000"]}
            start={{x:1, y:1}} end={{x:0, y:1}}
            style={styles.optionCard}
          >
            <CreditCard size={28} color="#fff" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.optionTitle}>
                {membershipStatus === "expired" ? "Membership Ended" : "Start Membership"}
              </Text>
              <Text style={styles.optionSubtitle}>
                {membershipStatus === "expired" 
                  ? "Renew your access to all features"
                  : "Unlock full premium features"}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={confirmModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModal({visible:false, type:"freeTrial"})}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {confirmModal.type === "freeTrial" ? "Start Free Trial?" : "Start Membership?"}
            </Text>
            <Text style={styles.modalSubtitle}>
              {confirmModal.type === "freeTrial" 
                ? "🎁 Enjoy 2 months of premium for free." 
                : "💳 Unlock all premium features instantly."}
            </Text>

            <View style={styles.modalButtons}>
              {/* Cancel */}
              <TouchableOpacity 
                style={styles.gradientButtonWrapper}
                onPress={() => setConfirmModal({visible:false, type:"freeTrial"})}
                activeOpacity={0.85}
              >
                <LinearGradient 
                  colors={["#f3f4f6", "#d1d5db"]}
                  start={{x:0, y:0}} end={{x:0, y:1}}
                  style={styles.gradientButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Confirm */}
              <TouchableOpacity 
                style={styles.gradientButtonWrapper}
                onPress={handleConfirmAction}
                activeOpacity={0.85}
              >
                <LinearGradient 
                  colors={["#93c5fd", "#3b82f6"]}
                  start={{x:0, y:0}} end={{x:0, y:1}}
                  style={styles.gradientButton}
                >
                  <Text style={styles.confirmText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#f9fafb' },
  title: { fontFamily:'Roboto-Bold', fontSize:26, textAlign:'center', marginBottom:25, color:'#111' },
  expiredText: { textAlign:'center', color:'#ef4444', fontSize:16, marginBottom:10 },

  // Gradient Card
  gradientCardWrapper: {
    borderRadius:16, overflow:"hidden",
    shadowColor:'#000', shadowOffset:{width:0,height:6},
    shadowOpacity:0.15, shadowRadius:10, elevation:6,
  },
  optionCard: {
    flexDirection:'row', alignItems:'center',
    padding:20, borderRadius:16,
  },
  optionTitle: { fontFamily:'Roboto-Bold', fontSize:18, color:'#fff' },
  optionSubtitle: { fontFamily:'Roboto-Regular', fontSize:14, color:'#f3f4f6', marginTop:2 },

  // Modal
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modalContent: { width:'85%', backgroundColor:'#fff', borderRadius:20, padding:25, alignItems:'center', elevation:10 },
  modalTitle: { fontFamily:'Roboto-Bold', fontSize:22, marginBottom:12, color:'#111' },
  modalSubtitle: { fontFamily:'Roboto-Regular', fontSize:15, textAlign:'center', marginBottom:25, color:'#555' },
  modalButtons: { flexDirection:'row', justifyContent:'space-between', width:'100%' },

  // 3D Gradient Buttons
  gradientButtonWrapper: { 
    flex:1, 
    marginHorizontal:6, 
    borderRadius:14, 
    overflow:"hidden",
    shadowColor:"#000",
    shadowOffset:{ width:0, height:4 },
    shadowOpacity:0.25,
    shadowRadius:6,
    elevation:6,
  },
  gradientButton: { 
    paddingVertical:16, 
    borderRadius:14, 
    alignItems:"center", 
    justifyContent:"center",
    minWidth:120,
  },
  cancelText: { color:'#111', fontFamily:'Roboto-Bold', fontSize:16 },
  confirmText: { color:'#fff', fontFamily:'Roboto-Bold', fontSize:16 },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  errorText: { fontFamily:FONT.bold, fontSize:16, color:'red' },
});
