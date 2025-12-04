import {
  View,
  Animated,
  StatusBar,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { COLORS, FONT } from "@/constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import AdCard from "@/components/HomeScreen/AdCard";
import EmptyStateComponent from "@/components/emptyStateComponent";
import { fetchData } from "@/lib/axiosUtility";

const Four = () => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<any[]>([]);
  const scrollA = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const getSavedOffers = async () => {
    setLoading(true);
    try {
      const res = await fetchData("/user/v1/get/saved-offers");
      console.log("API response:", res.data);

      // Handle both cases: { data: [...] } or just [...]
      const offers = Array.isArray(res?.data?.data)
        ? res.data.data.filter((item: any) => item !== null)
        : Array.isArray(res?.data)
        ? res.data.filter((item: any) => item !== null)
        : [];

      setSaved(offers);
      console.log("Filtered offers:", offers);
    } catch (error: any) {
      console.log("error", error);
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedOffers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content", true);
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(COLORS.white2, true);
      }
      getSavedOffers();
      return () => {};
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Saved Offers",
      headerBackTitleVisible: false,
      headerLargeTitle: true,
      headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
      headerShadowVisible: false,
      customAnimationOnGesture: true,
      fullScreenGestureEnabled: true,
      animation: Platform.OS === "ios" ? "slide_from_bottom" : "default",
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        data={saved}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, width: "100%" }}>
            <AdCard
              id={item?._id || item?.id}
              title={item?.title}
              expiry={item?.offerExpiryDate}
              location={
                item?.businessProfile?.location
                  ? `${item.businessProfile.location.addressLine1}, ${item.businessProfile.location.city}`
                  : "No location"
              }
              image={item?.featuredImage}
              businessLogo={item?.businessProfile?.logo}
              businessName={item?.businessProfile?.name}
              saved={true}
              afterSave={getSavedOffers}
              fullWidth={true}
            />
          </View>
        )}
        keyExtractor={(item) => item?._id?.toString() || item?.id?.toString()}
        ListEmptyComponent={
          <EmptyStateComponent
            img={require("@/assets/images/noSaved.png")}
            title="No Saved Offers!"
            subTitle="You haven't saved any offers yet"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollA } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />
      <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor={COLORS.tabWhite}
      />
    </View>
  );
};

export default Four;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tabWhite,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
