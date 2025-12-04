import {
  View,
  Text,
  SafeAreaView,
  StyleSheet, 
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import CategoriesCard from '@/components/Create/CategoriesCard';
import { categoriesData } from '@/constants';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
// import CreateAdvertiseForm from '@/components/Create/CreateAdvertiseForm';
import CreateBusinessProfileForm from '@/components/Forms/CreateBusinessProfileForm';
import { ChevronLeft, X } from 'lucide-react-native';
import { fetchData } from '@/lib/axiosUtility';
import { Button } from '@/components/ui/Button';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from 'expo-router';
import { asyncWrapProviders } from 'async_hooks';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { BACKEND_URL } from '@/constants/theme';
  import {CreateAdvertiseForm} from "@/components/Create/PremiumCreateAdd"
 
export const PremimumCreateAdScreen = () => {
  const navigation = useNavigation();
  const [businessProfile, setBusinessProfile] = useState<any>(null); // Updated state type
  const [selectedOption, setSelectedOption] = useState<null | 'business' | 'ad'>(null);
  const [userAddress, setUserAddress] = useState<any>(null); // Updated state type
  const [loading, setLoading] = useState(true);

 

  const snapPoints = useMemo(() => ['35%', '50%', '80%'], []);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const bottomSheetRef3 = useRef<BottomSheet>(null);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleClosePress2 = () => bottomSheetRef2.current?.close();
  const handleClosePress3 = () => bottomSheetRef3.current?.close();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
  const snapToIndex2 = (index: number) => bottomSheetRef2.current?.snapToIndex(index);
  const snapToIndex3 = (index: number) => bottomSheetRef3.current?.snapToIndex(index);


  const[trail,setTrail]=useState<any>();
  const[membership,setMebership]=useState<any>()
  const[trailexp,setTrailexp]=useState<any>();
  const[membershipexp,setMebershipexp]=useState<any>()

  
 const [currentUser,setCurrentUser]=useState<any>(null)


const fetchUserDetails = async () => {
  try {
    // ✅ Get token from storage
    

    // ✅ Call fetchData (it should auto-handle headers if you coded it that way)
    const data = await fetchData("/user/v1/current");
    setCurrentUser(data)
    setTrail(data?.freeTrial?.status)
     setTrailexp(data?.freeTrial?.expiryDate)
    setMebership(data?.membership?.status)
        setMebershipexp(data?.membership?.expiryDate)


    

    
    return data;
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
};

 




  // Fetch Business Profile Details
  const fetchBusinessProfileDetails = async () => {
    try {
      const response = await fetchData('/business/v1/get/current');
      if (response) {
        setBusinessProfile(response?.businessProfiles);
       
      }
    } catch (error) {
      console.error('Error Fetching Business Profiles:', (error as Error).message);
    }
  };


  // Fetch User Address
  const fetchUserAddress = async () => {
    try {
      const response = await fetchData('/user/v1/address/get/current');
      if (response) {
        setUserAddress(response);
        
      }
    } catch (error) {
      console.error('Error Fetching User address:', (error as Error).message);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails()
    await fetchUserAddress();
     await fetchBusinessProfileDetails()
    }
    fetchData().then(() => setLoading(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Refetch data when screen is focused
      const refetchData = async () => {
        setLoading(true);
        await fetchUserAddress();
        await fetchBusinessProfileDetails();
        setLoading(false);
      };
  
      refetchData();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: !selectedOption
        ? 'Create'
        : selectedOption === 'business'
          ? 'Create Business Profile'
          : 'Create Ad',
      headerBackTitle: 'Back',
      headerStyle: {
        backgroundColor: COLORS.white,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerShadowVisible: false,
      headerLargeTitle: true,
      animationDuration: Platform.OS === "android" ? undefined : 200,

      headerLeft: () =>
        selectedOption ? (
          <TouchableOpacity onPress={() => setSelectedOption(null)} style={{ marginLeft: 30 }}>
            <ChevronLeft size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, selectedOption]);

  return ( 
    loading ? (
       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={COLORS.primary} />
      </SafeAreaView>
    ) : (
    <SafeAreaView style={{ flex: 1, position: 'relative', backgroundColor: COLORS.white }}>
      {!selectedOption ? (
        <View style={styles.optionsContainer}>
          <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15 }}>
  {trail === 'active' ? (
    <View style={{
      backgroundColor: '#60a5fa',
      padding: 15,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <Text style={{ fontFamily: FONT.bold, fontSize: 18, color: '#fff', marginBottom: 5 }}>
        Free Trial Active
      </Text>
      <Text style={{ fontFamily: FONT.medium, fontSize: 14, color: '#f0f0f0' }}>
        Ends on {currentUser?.freeTrial?.expiryDate ? new Date(currentUser.freeTrial.expiryDate).toLocaleDateString() : 'N/A'}
      </Text>
    </View>
  ) : membership === 'active' ? (
    <View style={{
      backgroundColor: '#f87171',
      padding: 15,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <Text style={{ fontFamily: FONT.bold, fontSize: 18, color: '#fff', marginBottom: 5 }}>
        Membership Active
      </Text>
      <Text style={{ fontFamily: FONT.medium, fontSize: 14, color: '#f0f0f0' }}>
        Ends on {currentUser?.membership?.expiryDate ? new Date(currentUser.membership.expiryDate).toLocaleDateString() : 'N/A'}
      </Text>
    </View>
  ) : (
    <View style={{
      backgroundColor: '#e5e7eb',
      padding: 15,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <Text style={{ fontFamily: FONT.bold, fontSize: 18, color: '#374151' }}>
        No Active Plan
      </Text>
      <Text style={{ fontFamily: FONT.medium, fontSize: 14, color: '#6b7280' }}>
        You can start a free trial or purchase a membership.
      </Text>
    </View>
  )}
</View>

          <Text style={styles.headerText}>What would you like to create?</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() =>
            {
              fetchUserAddress().finally(() => {
              userAddress?.data?.length > 0 ?
                setSelectedOption('business')
                 :
                snapToIndex(1)
              })
            }
            }
          >
            <Text style={styles.optionText}>Create Business Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() =>
            businessProfile?.length > 0 ?
              userAddress?.data?.length > 0 ?
                setSelectedOption('ad') :
                snapToIndex(1) :
              snapToIndex2(1)
          }>
            <Text style={styles.optionText}>Create Ad</Text>
          </TouchableOpacity>
        </View>
      ) : selectedOption === 'business' ? (
        <CreateBusinessProfileForm />
      ) : (
        <CreateAdvertiseForm />
      )}
      <BottomSheetComponent title='No saved address Found' bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} handleClosePress={handleClosePress} >
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: SIZES.medium, fontFamily: FONT.semiBold, textAlign: 'center', color: COLORS.gray }}>{`Please add an address to continue creating a business profile.`}</Text>
          <Text style={{ fontSize: SIZES.small, fontFamily: FONT.regular, textAlign: 'center', color: COLORS.gray }}>{`To create a business profile, you must have an address.\n Start by creating a business address first
`}</Text>
          <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
            <View style={{ flex: 1 }}>
              <Button label='Cancel' onPress={() => {
                handleClosePress();
              }} variant='secondary' />
            </View>
            <View style={{ flex: 1 }}>
              <Button label='Yes' onPress={() => {
                handleClosePress();
                snapToIndex3(1)
              }} variant='default' />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
      <BottomSheetComponent title='No business profile Found' bottomSheetRef={bottomSheetRef2} snapPoints={snapPoints} handleClosePress={handleClosePress2} >
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: SIZES.medium, fontFamily: FONT.semiBold, textAlign: 'center', color: COLORS.gray }}>{`Please create a business profile to continue creating an ad.`}</Text>
          <Text style={{ fontSize: SIZES.small, fontFamily: FONT.regular, textAlign: 'center', color: COLORS.gray }}>{`To create an Ad, you need to have a business profile.\n Start by creating a business profile first
`}</Text>
          <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
            <View style={{ flex: 1 }}>
              <Button label='Cancel' onPress={() => {
                handleClosePress2();

              }} variant='secondary' />
            </View>
            <View style={{ flex: 1 }}>
              <Button label='Yes' onPress={() => {
                handleClosePress2()
                userAddress?.data?.length > 0 ?
                  setSelectedOption('business') :
                  snapToIndex(1)
              }} variant='default' />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
      <BottomSheetComponent title='Are you at your location?' bottomSheetRef={bottomSheetRef3} snapPoints={snapPoints} handleClosePress={handleClosePress3} >
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: SIZES.medium, fontFamily: FONT.semiBold, textAlign: 'center', color: COLORS.gray }}>{`Are you at the same location \n you want to save?`}</Text>
          <Text style={{ fontSize: SIZES.small, fontFamily: FONT.regular, textAlign: 'center', color: COLORS.gray }}>{`An Address is required to create a business profile.\n Please ensure you are at the location of the business you want to create.`}</Text>
          <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
            <View style={{ flex: 1 }}>
              <Button label='No, I am not' onPress={() => {
                handleClosePress3();
              }} variant='secondary' />
            </View>
            <View style={{ flex: 1 }}>

              <Button label='Yes, I am' onPress={() => {
                handleClosePress();
                router.push('/addAddressScreen')
              }} variant='default' />
            </View>
          </View>
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  )
  );
};



const styles = StyleSheet.create({
  gradientContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    paddingTop: 0,
    width: '100%',
    height: 80,
    borderColor: '#C94134',
    position: 'absolute',
    left: 0,
    bottom: 80,
    right: 0,
  },
  uploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.gray,
    borderRadius: 16,
    width: '100%',
    height: 200,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageContainer: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONT.regular,
  },
  uploadText: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontFamily: FONT.bold,
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: COLORS.primary,
    padding: 15, 
    borderRadius: 10,
    width: '80%',
    marginBottom: 10,
  },
  optionText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: 16,
  },
});
