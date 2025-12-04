import {
  Animated as ReactAnimated,
  FlatList,
  Image,
  Text,
  View,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { COLORS, FONT, SHADOWS, SIZES, BACKEND_URL } from '@/constants/theme';
import Header from '@/components/HomeScreen/Header';
import tw from 'tailwind-react-native-classnames';
import { Stack, useNavigation, useRouter } from 'expo-router';
import SearchComponent from '@/components/SearchComponent';
import { Button } from '@/components/ui/Button';
import CardsWithTitle from '@/components/HomeScreen/CardsWithTitle';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useDrawerProgress } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { fetchData } from '@/lib/axiosUtility';
import CategoriesCard from '@/components/Create/CategoriesCard';
import EmptyStateComponent from '@/components/emptyStateComponent';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Compass } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import axios from 'axios';
import { KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {MarqueeText} from '../../(routes)/marque/index'



export default function TabOneScreen() {
  const [nearbyOffers, setNearbyOffers] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [savedOffers, setSavedOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [isLocationPermissionGranted, setLocationPermissionGranted] = useState<boolean | null>(null);
  const scrollY = useRef(new ReactAnimated.Value(0)).current;
  const router = useRouter();
  const progress = useDrawerProgress();
  const { width } = useWindowDimensions();
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      animationDuration: Platform.OS === 'android' ? undefined : 200,
    });
  }, []);

  const snapPoints = useMemo(() => ['50%', '80%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleClosePress2 = () => bottomSheetRef2.current?.close();
  const snapToIndex = (index: number) => bottomSheetRef2.current?.snapToIndex(index);
  const snapToIndex2 = (index: number) => bottomSheetRef2.current?.snapToIndex(index);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  // ✅ FIXED: Always return { lat, long }
  const getCurrentCoordinates = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        long: loc.coords.longitude,
      });
      console.log(location)
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const [offerloading,setOfferLoading]=useState<any>()


  const getOffersNearYou = async (data: { lat: number; long: number }) => {
    setOfferLoading(true)
    if (!data?.lat || !data?.long) {
      console.warn('Location not available. Skipping API call.');
      return;
    }
    try {
      const res = await fetchData(`/offer/v1/get/nearby?lat=${data.lat}&long=${data.long}`);
      setNearbyOffers(res.data && res.data.length > 0 ? res.data.slice(0, 4) : []);
      setOfferLoading(false)
    } catch (error: any) {
      console.error('Error fetching nearby offers:', error);
            setOfferLoading(false)

      Alert.alert('Error', 'Unable to fetch nearby offers. Please try again.');
    }
  };

  const getCategories = async () => {
    try {
      const res = await fetchData(`/categories/v1/all`);
      const categories = res.data || res;
      setCategories(categories);
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    }
  };

    const [Trendofferloading,setTrendOfferLoading]=useState<any>()


  const getTrending = async () => {
    setTrendOfferLoading(true)
    if (!location?.lat || !location?.long) return;
    try {
      const res = await fetchData(`/offer/v1/get/trending`, {
        lat: location.lat,
        long: location.long,
      });
      setTrending(res.data.slice(0, 4));
      setTrendOfferLoading(false)
    } catch (error: any) {
            setTrendOfferLoading(false)

      console.error('Error fetching trending offers:', error);
    }
  };

 const getCurrentUserDetails = async () => {
  try {
    const res = await fetchData(`/user/v1/current`);

    // ✅ handle cases where backend wraps response
    const user = res?.data || res || null;

    if (user) {
      setCurrentUser(user);
      setSavedOffers(user.savedOffers || []);
    } else {
      console.warn("No user data returned from /user/v1/current");
      setCurrentUser(null);
      setSavedOffers([]);
    }
  } catch (error: any) {
    console.error("Error fetching current user details:", error?.message || error);
    setCurrentUser(null);
    setSavedOffers([]);
  } finally {
    setLoading(false);
  }
};


  // Initial location fetch
  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      await getCurrentCoordinates();
      setLoading(false);
    };
    fetchLocation();
  }, []);

  // Fetch data when location changes
  useEffect(() => {
    if (location?.lat && location?.long) {
      const fetchDataBasedOnLocation = async () => {
        setLoading(true);
        await Promise.all([
          getOffersNearYou(location),
          getCurrentUserDetails(),
          getCategories(),     
          getTrending(),
        ]);
        setLoading(false);
      };
      fetchDataBasedOnLocation();
    }
  }, [location]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { scale: interpolate(progress.value, [0, 1], [1, 0.8], 'clamp') },
      { rotateY: `${interpolate(progress.value, [0, 1], [0, 0], 'clamp')}deg` },
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, Platform.OS === 'android' ? width - 130 : -40],
          'clamp'
        ),
      },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 50], 'clamp'),
    overflow: 'hidden',
  }));

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [status, requestPermission] = Location.useForegroundPermissions();

  // ✅ FIXED: Await async calls
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);

    await getCurrentCoordinates();
    if (location?.lat && location?.long) {
      await Promise.all([
        getCategories(),
        getCurrentUserDetails(),
        getOffersNearYou(location),
        getTrending(),
      ]);
    }

    setRefreshing(false);
    setLoading(false);
  }, [location]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content', true);
      Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.primary, true);
    }, [])
  );

  // ✅ FIXED: Correct permission flag
  useFocusEffect(
    React.useCallback(() => {
      if (status?.granted === false) {
        setLocationPermissionGranted(false);
      } else if (status?.granted === true) {
        setLocationPermissionGranted(true);
      }
    }, [status])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      animationDuration: Platform.OS === 'android' ? undefined : 200,
    });
  }, [navigation]);

  const GOOGLE_API_KEY = 'AIzaSyBeU_J6jaVHmuBARmjYo6ljkEVxLC4mt58';

  const fetchPlaces = async (text: string) => {
    setQuery(text);
    snapToIndex2(2);
    if (text.length > 2) {
      setLocationLoading(true);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&components=country:IN`
        );
        const json = await response.json();
        setSuggestions(json.status === 'OK' ? json.predictions : []);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      } finally {
        setLocationLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // ✅ FIXED: Always store { lat, long }
  const handleSelectPlace = async (placeId: string) => {
  try {
    if (!placeId) {
      console.warn("No placeId provided");
      return;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&components=country:IN`
    );
    const json = await response.json();

    if (json.status !== "OK" || !json.result?.geometry?.location) {
      console.warn("Place details fetch failed:", json.status, json.error_message);
      return;
    }

    const { lat, lng } = json.result.geometry.location;
    const formattedAddress = json.result.formatted_address || "Unknown Address";

    // ✅ Update state
    setLocation({ lat, long: lng });
    setUpdatedAddress(formattedAddress);

    // ✅ Close bottom sheet
    handleClosePress2();

    // ✅ Fetch nearby offers, trending, categories, user data for new location
    await Promise.all([
      getOffersNearYou({ lat, long: lng }),
      getTrending(),
      getCategories(),
      getCurrentUserDetails(),
    ]);

    // ✅ Reset search UI
    setSuggestions([]);
    setQuery("");
  } catch (error) {
    console.error("Error fetching place details:", error);
    Alert.alert("Error", "Could not fetch place details. Please try again.");
  }
};



  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false, fullScreenGestureEnabled: false }} />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small + 3, color: COLORS.primary }}>
            Setting Up Your Feed
          </Text>
        </View>
      ) : !isLocationPermissionGranted ? (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Image
            source={require('@/assets/images/noLocationPermission.png')}
            style={{ width: 200, height: 200, objectFit: 'contain' }}
          />
          <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.small + 3, color: COLORS.primary }}>
            Location Permission Not Allowed!
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small + 3, textAlign: 'center', color: COLORS.primary }}>
            We need your location to show you offers near you
          </Text>
          <View style={{ padding: 20 }}>
            <Button label="Set Location" variant={'default'} onPress={() => router.push('/askLocationPermission')} />
          </View>
        </View>
      ) : (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {/* --- HEADER --- */}
          <Header scrollY={scrollY} pressed={() => snapToIndex(1)} addressLine={updatedAddress} />
          <ScrollView
            style={{ backgroundColor: COLORS.white }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                progressBackgroundColor={COLORS.primary}
                colors={[COLORS.white]}
                tintColor={COLORS.primary}
                title="Refreshing..."
                titleColor={COLORS.primary}
                style={{ backgroundColor: COLORS.white }}
              />
            }
            bounces={true}
            contentContainerStyle={{ paddingBottom: 80 }}
            onScroll={ReactAnimated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })}
          >
            {/* --- SEARCH --- */}
            <View
              style={[
                tw`flex-row items-center justify-between overflow-hidden`,
                { width: '100%', backgroundColor: COLORS.white, borderRadius: SIZES.medium, padding: 20 },
              ]}
            >
              <SearchComponent redirect={true} value={search} placeholder="Search..." onChangeText={setSearch} />
            </View>

            {/* --- CATEGORIES --- */}
            <View
              style={[
                tw`flex-row items-center justify-between overflow-hidden`,
                { width: '100%', backgroundColor: COLORS.white, borderRadius: SIZES.medium },
              ]}
            >
              {categories.length > 0 && (
                <FlatList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        marginRight: 20,
                        marginLeft: categories[0]._id === item._id ? 20 : 0,
                      }}
                    >
                      <CategoriesCard
                        id={item._id}
                        title={item.name}
                        image={item.categoryImgUrl}
                        selected={false}
                        onSelect={() => router.push(`/categories/${item._id + ' ' + item.name}`)}
                      />
                    </View>
                  )}
                />
              )}
            </View>

            {/* --- NEARBY OFFERS --- */}
           {offerloading ? (
 <View style={styles.loaderContainer}>
  <ActivityIndicator size={30} color="red" style={styles.loader} />
  <Text style={styles.loaderText}>Searching near by offers...</Text>
</View>
) : (
  <>
    {nearbyOffers.length > 0 ? (
      <CardsWithTitle
        title="Offers Near You"
        href="/offersNearYou"
        adsData={nearbyOffers.map((item: any) => ({
          _id: item._id,
          title: item.title,
          expiry: new Date(item.offerExpiryDate).toDateString(),
          image: item.featuredImage,
          location: `${item.businessProfile?.location?.addressLine1}, ${item.businessProfile?.location?.city}`,
          saved: savedOffers.includes(item._id),
          businessProfile: {
            logo: item.businessProfile?.logo,
            name: item.businessProfile?.name,
          },
        }))}
      />
    ) : (
      <View style={styles.emptyContainer}>
        <EmptyStateComponent
          img={require('@/assets/images/noLocationPermission.png')}
          title="No Offers Near You!"
          subTitle="We couldn't find any offers near you. Please try again later."
        />
      </View>
    )}
  </>
)}

          

            {/* --- TRENDING OFFERS --- */}
            {Trendofferloading ? (
              <View style={styles.loaderContainer}>
  <ActivityIndicator size={30} color="red" style={styles.loader} />
  <Text style={styles.loaderText}>Searching Trending by offers...</Text>
</View>
):
(<>
{trending.length > 0 && (
              <CardsWithTitle
                title="Trending Offers"
                href="/trending"
                adsData={trending.map((item: any) => ({
                  _id: item._id,
                  title: item.title,
                  expiry: item.offerExpiryDate,
                  image: item.featuredImage,
                  location: `${item.businessProfile?.location?.addressLine1}, ${item.businessProfile?.location?.city}`,
                  saved: savedOffers.includes(item._id),
                  businessProfile: {
                    logo: item.businessProfile?.logo,
                    name: item.businessProfile?.name,
                  },
                }))}
              />
            )}

</>)
 }
            

            <View style={styles.container}></View>
            <StatusBar barStyle="light-content" />

            {/* --- BOTTOM SHEET --- */}
        {/* --- BOTTOM SHEET --- */}
<BottomSheetComponent
  title="Select Location"
  bottomSheetRef={bottomSheetRef2}
  snapPoints={snapPoints}
  handleClosePress={handleClosePress2}
  keyboardBehavior="interactive"
  enablePanDownToClose={true}
>
  <KeyboardAwareScrollView
    contentContainerStyle={{ flexGrow: 1, padding: 20 }}
    enableOnAndroid={true}
    keyboardShouldPersistTaps="handled"
    extraHeight={Platform.OS === "android" ? 150 : 100}
    enableAutomaticScroll={true}
    keyboardOpeningTime={250}
    showsVerticalScrollIndicator={false}
  >
    {/* --- CURRENT LOCATION BUTTON --- */}
    <TouchableOpacity
      onPress={async () => {
        try {
          setLocationLoading(true);
          setUpdatedAddress("Fetching your location...");

          const loc = await Location.getCurrentPositionAsync({});
          const coords = {
            lat: loc.coords.latitude,
            long: loc.coords.longitude,
          };

          setLocation(coords);
              const [addressObj] = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.long,
      });

      const formattedAddress = addressObj
        ? `${addressObj.name ? addressObj.name + ', ' : ''}${addressObj.street ? addressObj.street + ', ' : ''}${addressObj.city ? addressObj.city + ', ' : ''}${addressObj.region ? addressObj.region + ', ' : ''}${addressObj.postalCode ? addressObj.postalCode + ', ' : ''}${addressObj.country ?? ''}`.replace(/, $/, '')
        : "Your Current Location";

      setUpdatedAddress(formattedAddress);


          await Promise.all([
            getOffersNearYou(coords),
            getTrending(),
            getCategories(),
            getCurrentUserDetails(),
          ]);

          handleClosePress2();
        } catch (error) {
          console.error("Error using current location:", error);
          Alert.alert("Error", "Unable to fetch your current location. Please try again.");
        } finally {
          setLocationLoading(false);
        }
      }}
      style={[
        tw`flex flex-row w-full items-center p-3 overflow-hidden mb-8`,
        {
          gap: 9,
          borderRadius: 12,
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.white2,
        },
        Platform.OS === "ios" && SHADOWS.medium,
      ]}
    >
      <Compass size={24} color={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: SIZES.medium,
            fontFamily: FONT.semiBold,
            color: COLORS.primary,
          }}
        >
          Use Your Current Location
        </Text>
      </View>
    </TouchableOpacity>

    {/* --- SEARCH ADDRESS --- */}
    <View style={{ paddingVertical: 10 }}>
      <Input
        label
        labelTitle="Search Address"
        placeholder="eg. DesignerDudes Office"
        type="text"
        value={query}
        onTextChange={fetchPlaces}
        onFocus={() => bottomSheetRef2.current?.snapToIndex(0)} // snap to smaller height
      />
    </View>

    {/* --- SUGGESTIONS LIST --- */}
    <View>
      {locationLoading && (
        <ActivityIndicator size="small" color={COLORS.black} style={styles.loader} />
      )}
      {suggestions.map((suggestion: any) => (
        <TouchableOpacity
          key={suggestion.place_id}
          onPress={() => handleSelectPlace(suggestion.place_id)}
          style={styles.suggestionItem}
        >
          <Text style={styles.description}>{suggestion.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </KeyboardAwareScrollView>
</BottomSheetComponent>


          </ScrollView>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 20,

    fontFamily: FONT.semiBold,
  },
  separator: {
    marginVertical: 4,
    height: 1,
    width: '80%',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.lightWhite,
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 15,
    fontFamily: FONT.medium,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
  },
  
  loader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 5,
  },
  suggestionItem: {
    backgroundColor: COLORS.lightWhite,
    padding: 13,
    marginVertical: 1,
    borderRadius: 5,
    height: 44,
    flexDirection: "row",
  },
  description: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONT.medium,
  },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
 
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 10, // Requires React Native >= 0.71; otherwise, use marginBottom for spacing
  },
 loaderText: {
    fontSize: 16,
    color: 'rgb(0,0,0,1)',
    fontWeight: '500',
  },
});

