import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { COLORS, FONT } from "@/constants/theme";
import React, {
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { postData } from "@/lib/axiosUtility";
import DropdownComponent from "@/components/ui/dropdown";
import { useNavigation } from "expo-router";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetComponent } from "@/components/bottomSheetComponent";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import {GOOGLE_API_KEY} from '@env'

const HYD = { latitude: 17.385044, longitude: 78.486671 };
const DEFAULT_DELTA = { latitudeDelta: 0.01, longitudeDelta: 0.01 };

const Index = () => {
  const navigation = useNavigation();

  // Form state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [addressLandmark, setAddressLandmark] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [addressName, setAddressName] = useState("");
  const [addressType, setAddressType] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [error, setError] = useState("");

  // Selected coordinates
  const [marker, setMarker] = useState({ ...HYD });

  // Map modal
  const [showMapModal, setShowMapModal] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Controlled region
  const [region, setRegion] = useState<Region>({
    latitude: HYD.latitude,
    longitude: HYD.longitude,
    ...DEFAULT_DELTA,
  });

  // Center coordinates ref
  const centerCoords = useRef<{ latitude: number; longitude: number } | null>({
    latitude: HYD.latitude,
    longitude: HYD.longitude,
  });

  const AddressType = [
    { label: "Home", value: "home" },
    { label: "Office", value: "office" },
    { label: "Other", value: "other" },
  ];

  // BottomSheet
  const snapPoints = useMemo(() => ["35%", "50%", "80%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
    ),
    []
  );

  // Parse address components from Google API
  const parseAddressComponents = (components: any[]) => ({
    city: components.find((c) => c.types.includes("locality"))?.long_name || "",
    state:
      components.find((c) => c.types.includes("administrative_area_level_1"))
        ?.long_name || "",
    postalCode: components.find((c) => c.types.includes("postal_code"))?.long_name || "",
    country: components.find((c) => c.types.includes("country"))?.long_name || "",
  });

  // Reverse geocode coordinates to address
  const fetchAddressFromCoords = async (coords: { latitude: number; longitude: number }) => {
    try {
      const [location] = await Location.reverseGeocodeAsync(coords);

      if (location) {
        setCity(location.city || "");
        setStateProvince(location.region || "");
        setCountry(location.country || "");
        setPostalCode(location.postalCode || "");
        setAddressLine(`${location.name || ""} ${location.street || ""}`.trim());
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  // Save address
  const saveAddress = async () => {
    if (!addressType) {
      setError("Please enter an address type");
      snapToIndex(0);
      return;
    }
    if (!addressName) {
      setError("Please enter an address name");
      snapToIndex(0);
      return;
    }
    if (!city) {
      setError("Please enter city");
      snapToIndex(0);
      return;
    }
    if (!stateProvince) {
      setError("Please enter state/province");
      snapToIndex(0);
      return;
    }
    if (!/^\d{6}$/.test(postalCode)) {
      setError("Please enter valid 6-digit pin code");
      snapToIndex(0);
      return;
    }

    try {
      setSaving(true);
      const addressData = {
        addressType,
        addressLine1: addressLine,
        landmark: addressLandmark,
        city,
        state: stateProvince,
        pincode: postalCode,
        country,
        addressName,
        coordinates: {
          type: "Point",
          coordinates: [marker.longitude, marker.latitude],
        },
      };

      const response = await postData("/user/v1/address/create", addressData);
      if (response) {
        Alert.alert("Success", "Address added successfully", [
          {
            text: "Ok",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error creating address:", (err as Error).message);
    } finally {
      setSaving(false);
      handleClosePress();
    }
  };

  // Debounce helper
  const useDebounce = (fn: Function, delay = 500) => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    return (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    };
  };

  // Fetch Google Places suggestions
  async function fetchPlaces(text: string) {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            text
          )}&key=${GOOGLE_API_KEY}&components=country:IN`
        );
        const json = await response.json();
        if (json.status === "OK") {
          setSuggestions(json.predictions);
        } else {
          console.warn("Google Autocomplete error:", json.status, json.error_message);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  }
  const debouncedFetchPlaces = useDebounce(fetchPlaces, 500);

  // Select place from suggestions
  const handleSelectPlace = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&components=country:IN`
      );
      const json = await response.json();

      if (json.status === "OK") {
        const { lat, lng } = json.result.geometry.location;
        const { city, state, postalCode, country } = parseAddressComponents(
          json.result.address_components
        );

        const nextRegion: Region = {
          latitude: lat,
          longitude: lng,
          ...DEFAULT_DELTA,
        };
        setRegion(nextRegion);
        setMarker({ latitude: lat, longitude: lng });
        mapRef.current?.animateToRegion(nextRegion);

        setAddressLine(json.result.formatted_address || "");
        setCity(city);
        setStateProvince(state);
        setPostalCode(postalCode);
        setCountry(country);
      } else {
        console.warn("Place details error:", json.status, json.error_message);
      }
      setSuggestions([]);
      setQuery("");
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Add New Address",
      headerBackTitleVisible: true,
      headerLargeTitle: true,
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
      headerShadowVisible: false,
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
  }, [navigation]);

  // Open map modal
  const openMap = () => {
    const currentRegion = {
      latitude: marker.latitude,
      longitude: marker.longitude,
      ...DEFAULT_DELTA,
    };
    setRegion(currentRegion);
    centerCoords.current = { latitude: marker.latitude, longitude: marker.longitude };
    setShowMapModal(true);
  };

  // Use current location
  const pickCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        ...DEFAULT_DELTA,
      };

      setRegion(current);
      setMarker({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      centerCoords.current = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

      mapRef.current?.animateToRegion(current, 500);

      // Populate address fields automatically
      await fetchAddressFromCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      // Close map modal
      setShowMapModal(false);
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Unable to get current location.");
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            {/* Search */}
            <Input
              label
              labelTitle="Search Address"
              placeholder="eg. DesignerDudes Office"
              type="text"
              value={query}
              onTextChange={(text: string) => debouncedFetchPlaces(text)}
            />
            {loading && (
              <ActivityIndicator size="small" color={COLORS.black} style={styles.loader} />
            )}
            {suggestions.map((s) => (
              <TouchableOpacity
                key={s.place_id}
                onPress={() => handleSelectPlace(s.place_id)}
                style={styles.suggestionItem}
              >
                <Text style={styles.description}>{s.description}</Text>
              </TouchableOpacity>
            ))}

            {/* Address fields */}
            <DropdownComponent
              onChange={(item: any) => setAddressType(item.value)}
              required
              isAddressType={true}
              label="Select Address Type"
              data={AddressType as any}
            />
            <Input
              label
              required
              labelTitle="Address Name"
              placeholder="e.g. Main Branch"
              type="text"
              value={addressName}
              onTextChange={setAddressName}
            />
            <Input
              label
              labelTitle="Address Line"
              placeholder="e.g. 123 Main St, Banjara Hills"
              type="text"
              value={addressLine}
              onTextChange={setAddressLine}
            />
            <Input
              label
              labelTitle="Address Landmark"
              placeholder="e.g Near XYZ School"
              type="text"
              value={addressLandmark}
              onTextChange={setAddressLandmark}
            />
            <Input
              label
              required
              labelTitle="City"
              placeholder="e.g. Hyderabad"
              type="text"
              value={city}
              onTextChange={setCity}
            />
            <Input
              label
              required
              labelTitle="State/Province"
              placeholder="e.g. Telangana"
              type="text"
              value={stateProvince}
              onTextChange={setStateProvince}
            />
            <Input
              label
              required
              maxLength={6}
              labelTitle="Pin Code"
              placeholder="e.g. 500081"
              type="numeric"
              value={postalCode}
              onTextChange={setPostalCode}
            />
            <Input
              label
              labelTitle="Country"
              placeholder="e.g. India"
              type="text"
              value={country}
              onTextChange={setCountry}
            />

            {/* Pick on Map */}
            <View style={{ marginTop: 20 }}>
              <Button label="Pick on Map" variant="secondary" onPress={openMap} />
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                label={saving ? "Saving..." : "Save Address"}
                variant="default"
                onPress={saveAddress}
                disabled={saving}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Map Picker */}
      <Modal visible={showMapModal} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={(newRegion) => {
              setRegion(newRegion);
              centerCoords.current = {
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
              };
            }}
          />

          {/* Static center pin */}
          <View style={styles.centerPin}>
            <Text style={{ fontSize: 36 }}>📍</Text>
          </View>

          {/* Bottom actions */}
          <View style={styles.bottomActions}>
            <Button
              label="Confirm Location"
              variant="default"
              onPress={async () => {
                if (centerCoords.current) {
                  setMarker(centerCoords.current);
                  await fetchAddressFromCoords(centerCoords.current);
                  setShowMapModal(false);
                }
              }}
            />
            <View style={{ height: 10 }} />
            <Button
              label="Use Current Location"
              variant="secondary"
              onPress={pickCurrentLocation}
            />
            <View style={{ height: 10 }} />
            <Button label="Cancel" variant="secondary" onPress={() => setShowMapModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Error sheet */}
      <BottomSheetComponent
        title={error}
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        handleClosePress={handleClosePress}
      >
        <View style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{ flexDirection: "row", gap: 10, padding: 20 }}>
            <View style={{ flex: 1 }}>
              <Button label="Okay" onPress={handleClosePress} variant="default" />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    </>
  );
};

const styles = StyleSheet.create({
  loader: { flexDirection: "row", justifyContent: "flex-end", marginVertical: 5 },
  suggestionItem: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    marginVertical: 1,
    borderRadius: 5,
    height: 44,
    flexDirection: "row",
  },
  description: { fontSize: 14, color: COLORS.black, fontFamily: FONT.medium },

  bottomActions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  centerPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -36,
    zIndex: 10,
  },
});

export default Index;
