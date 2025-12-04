import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { router, useNavigation } from "expo-router";
import { COLORS, FONT, SIZES } from "@/constants/theme";
import { MapPin } from "lucide-react-native";
import tw from "tailwind-react-native-classnames";
import { deleteData, fetchData } from "@/lib/axiosUtility";
import EmptyStateComponent from "@/components/emptyStateComponent";
import { Button } from "@/components/ui/Button";
import { Swipeable } from "react-native-gesture-handler";

const index = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  const getAddressess = async () => {
    try {
      const res = await fetchData("/user/v1/address/get/current");

      if (!res || !res.data || res.data.length === 0) {
        setAddress({ count: 0, data: [] });
      } else {
        setAddress({
          count: res.count || res.data.length,
          data: res.data,
        });
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch addresses"
      );
      setAddress({ count: 0, data: [] });
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await deleteData(`/user/v1/address/${id}`);
      await getAddressess();
      setSelectedAddress(null);
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      await getAddressess();
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: `Address Book (${address?.count || 0})`,
      headerBackTitleVisible: true,
      headerLargeTitle: true,
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: COLORS.white,
      },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
      headerShadowVisible: false,
      customAnimationOnGesture: true,
      fullScreenGestureEnabled: true,
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
  }, [navigation, address]);

  const handleEditAddress = (id: string) => {
    router.push(`/editAddressBook/${id}`);
  };

  const renderRightActions = (progress: any, dragX: any, item: any) => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "#FFECEB",
        borderRadius: 16,
        paddingRight: 15,
        flex: 0.3,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedAddress(item._id);
          deleteAddress(item._id);
          swipeableRefs.current[item._id]?.close();
        }}
        style={{ paddingHorizontal: 20 }}
      >
        <Text style={{ color: "#EB5757", fontSize: 16, fontFamily: FONT.semiBold }}>
          Delete
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleEditAddress(item._id);
          swipeableRefs.current[item._id]?.close();
        }}
        style={{ paddingHorizontal: 20, marginTop: 10 }}
      >
        <Text style={{ color: "#4A90E2", fontSize: 16, fontFamily: FONT.semiBold }}>
          Edit
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={{ flex: 1, borderRadius: 16, backgroundColor: "#FFECEB" }}>
      <Swipeable
        ref={(ref) => {
          if (ref) swipeableRefs.current[item._id] = ref;
        }}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
        overshootRight={false}
        rightThreshold={40}
        friction={2}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            tw`flex flex-row w-full items-center p-3 overflow-hidden`,
            {
              flexDirection: "row",
              gap: 9,
              backgroundColor: COLORS.white2,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.white2,
            },
          ]}
        >
          <MapPin size={24} color={COLORS.tertiary} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: SIZES.medium,
                fontFamily: FONT.semiBold,
                color: COLORS.tertiary,
              }}
            >
              {item?.addressType}
            </Text>
            <Text
              style={{
                fontSize: SIZES.small,
                fontFamily: FONT.semiBold,
                color: COLORS.tertiary,
              }}
            >
              {item?.addressName}
            </Text>
            <Text
              numberOfLines={3}
              style={{
                fontSize: SIZES.small,
                fontFamily: FONT.medium,
                color: COLORS.gray,
              }}
            >
              {item?.addressLine1}, {item?.city}, {item?.state}
            </Text>
            <Text
              numberOfLines={3}
              style={{
                fontSize: SIZES.small,
                fontFamily: FONT.medium,
                color: COLORS.gray,
              }}
            >
              {item?.pincode}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : address && address.count > 0 ? (
        <View
          style={{
            flex: 1,
            padding: 20,
            width: "100%",
            flexDirection: "column",
            backgroundColor: COLORS.white,
            gap: 10,
          }}
        >
          <View
            style={[tw`flex flex-row w-full items-center`, { flexDirection: "row", gap: 9 }]}
          >
            <View style={[tw` w-1/2`, { flex: 1, height: 1, backgroundColor: COLORS.gray2 }]} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: FONT.regular,
                color: COLORS.gray,
                textTransform: "uppercase",
              }}
            >
              Saved Addresses
            </Text>
            <View style={[tw` w-1/2`, { flex: 1, height: 1, backgroundColor: COLORS.gray2 }]} />
          </View>
          <Text
            style={{
              fontSize: SIZES.small,
              textAlign: "center",
              fontFamily: FONT.regular,
              color: COLORS.gray,
            }}
          >
            Swipe right to delete or edit your saved Addresses
          </Text>
          <FlatList
            data={address.data}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={renderItem}
            keyExtractor={(item) => item?._id}
            scrollEnabled={true}
          />
          <View style={[tw` w-full`, { height: 1, opacity: 0.6, backgroundColor: COLORS.gray2 }]} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/addAddressScreen")}
            style={[
              tw`flex flex-row w-full justify-center items-center p-3 overflow-hidden rounded-md`,
              {
                flexDirection: "row",
                gap: 9,
                alignItems: "center",
                width: "100%",
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: COLORS.gray2,
                borderStyle: "dashed",
              },
            ]}
          >
            <Text
              style={{
                fontSize: SIZES.medium,
                fontFamily: FONT.regular,
                color: COLORS.gray,
              }}
            >
              Add New Address
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            { flex: 1, gap: 20, margin: 20, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <EmptyStateComponent
            title="No Address Found"
            subTitle="Please add an address to see them here"
            img={require("@/assets/images/noLocationPermission.png")}
          />
          <View
            style={{
              padding: 20,
              width: "100%",
              paddingBottom: Platform.OS === "ios" ? 60 : 40,
            }}
          >
            <Button
              label="Add Address"
              onPress={() => router.push("/addAddressScreen")}
              variant="default"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default index;
