import AdCard from "@/components/HomeScreen/AdCard";
import { COLORS, FONT } from "@/constants/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StatusBar, View } from "react-native";
import * as Location from "expo-location";
import { fetchData } from "@/lib/axiosUtility";
import EmptyStateComponent from "@/components/emptyStateComponent";

const Index = () => {
  const navigation = useNavigation();
  const [nearbyOffers, setNearbyOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get current coordinates
  const getCurrentCoordinates = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location denied");
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({});
      return {
        lat: loc.coords.latitude,
        long: loc.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

  // ✅ Fetch offers near location
  const getOffersNearYou = async () => {
    try {
      const coords = await getCurrentCoordinates();
      if (!coords) {
        setNearbyOffers([]);
        return;
      }

      const res = await fetchData(`/offer/v1/get/nearby?lat=${coords.lat}&long=${coords.long}`);
      setNearbyOffers(res.data?.slice(0, 4) || []);
    } catch (error: any) {
      console.error("Error fetching offers:", error.response?.data || error.message);
      setNearbyOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffersNearYou();
  }, []);

  // ✅ Header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Offers Near You",
      headerBackTitleVisible: true,
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

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle("dark-content", true);
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(COLORS.white, true);
      }
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen options={{ headerShown: true }} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : nearbyOffers.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <EmptyStateComponent
            img={require("@/assets/images/notFound.png")}
            title={"Nothing Found"}
            subTitle={"No offers found near you"}
          />
        </View>
      ) : (
        <FlatList
          data={nearbyOffers}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10, width: "100%" }}>
              <AdCard
                id={item._id}
                title={item.title}
                expiry={new Date(item.offerExpiryDate).toDateString()}
                image={item.featuredImage}
                businessLogo={item.businessProfile.logo}
                businessName={item.businessProfile.name}
                location={
                  item.businessProfile?.location?.addressLine1 +
                  ", " +
                  item.businessProfile?.location?.city
                }
                fullWidth={true}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Index;
