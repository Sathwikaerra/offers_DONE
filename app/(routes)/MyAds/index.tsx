import { ActivityIndicator, Alert, Animated, Platform,  StatusBar, Text, View } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useNavigation } from 'expo-router'
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import DropdownComponent from '@/components/ui/dropdown';
import AdCard from '@/components/HomeScreen/AdCard';
import { deleteData, fetchData } from '@/lib/axiosUtility';
import EmptyStateComponent from '@/components/emptyStateComponent';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import { Button } from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(true);
    const [businessProfiles, setBusinessProfiles] = React.useState([]) as any;
    const [selectedBusinessProfile, setSelectedBusinessProfile] = React.useState('') as any;
    const [businessProfileName, setBusinessProfileName] = React.useState('') as any;
    const snapPoints = useMemo(() => ['30%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selectedAd, setSelectedAd] = React.useState('') as any;
    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    //clarification modal 
    const snapPoints2 = useMemo(() => ['40%', '50%', '80%'], []);
    const bottomSheetRef2 = useRef<BottomSheet>(null);
    const handleClosePress2 = () => bottomSheetRef2.current?.close();
    const snapToIndex2 = (index: number) => bottomSheetRef2.current?.snapToIndex(index);
    const renderBackdrop2 = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const getAllBusinessProfiles = async () => {
        try {
            const res = await fetchData('/business/v1/get/current') as any;
            const data = res.businessProfiles.map((item: any) => {
                return { label: item?.name, value: item._id }
            })
            setBusinessProfiles(data);

        }
        catch (error: any) {
            console.log(error.response.data.message);
            Alert.alert('Error', error.response.data.message);
        }
    }

    const [adsData, setAdsData] = React.useState([]) as any;

    const getAds = async () => {
        try {
            if (selectedBusinessProfile) {
            const res = await fetchData(`/offer/v1/get/all/${selectedBusinessProfile}`) as any;

            setBusinessProfileName(res?.businessProfile?.name)
            setAdsData(res.data);
            }
            else {
                setAdsData([]);
            }
        }
        catch (error: any) {
            console.log(error.response.data.message);
            // Alert.alert('Error', error.response.data.message);
        }
    }

    useEffect(() => {
        setLoading(true);
        getAllBusinessProfiles();
        getAds().then(() => {
            setLoading(false);
        });

    }
        , [selectedBusinessProfile])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "My Ads",
            animationEnabled: false,
            headerBackTitleVisible: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.white2,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerTransparent: true,
            // animationDuration: Platform.OS === "android" ? undefined : 200,
            headerShadowVisible: false,
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            // Set the status bar style for this screen
            StatusBar.setBarStyle('dark-content', true); // Adjust the style if needed
            Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white2, true); // Adjust the background color if needed

            return () => {
                // Optional cleanup for status bar (if needed)

            };
        }, [])
    );

    const handleDeletePress = (id: string) => {
        snapToIndex(0);
        setSelectedAd(id);
    }

    const deleteAd = async (id: string) => {
        try {
            const res = await deleteData(`/offer/v1/${id}`) as any;
        
            getAds();
            setSelectedAd('');
        }
        catch (error: any) {
            console.log(error.response.data.message);
        }
    }
    return (
        loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>

            :

            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <View style={{ marginTop: Platform.OS === "ios" ? 0 : 40 ,padding:20, paddingBottom:0, backgroundColor: COLORS.white2}}>
        
                    <DropdownComponent
                        isBusinessProfile={true}
                        value={selectedBusinessProfile}
                        onChange={(item: any) => {
                            setSelectedBusinessProfile(item.value);
                        }
                        }
                        label={`${businessProfileName ? businessProfileName : 'Select Business Profile'}`}
                        data={businessProfiles} />
                </View>
                <View style={{ paddingBottom: 20, flex: 1 }}>
                    {adsData.length > 0 ? <Animated.FlatList
                        data={adsData}
                        renderItem={({ item }) => (
                            <View style={{ marginVertical: 10, width: '100%' }} >

                                <AdCard
                                    id={item?._id}
                                    title={item?.title}
                                    expiry={item?.offerExpiryDate}
                                    location={item?.businessProfile?.location?.addressLine1 + ', ' + item?.businessProfile?.location?.city}
                                    image={item?.featuredImage}
                                    businessName={item?.businessProfile?.name}
                                    businessLogo={item?.businessProfile?.logo}
                                    fullWidth={true}
                                    confirmDelete={() => {
                                        handleDeletePress(item?._id);
                                    }}
                                    submitClarification={() => {
                                        snapToIndex2(0);
                                    }}
                                    viewClarification={() => {
                                        snapToIndex2(0);
                                    }}
                                    myAds={true}
                                    status={item.status}
                                />
                            </View>
                        )}
                        scrollEnabled={true}
                        scrollEventThrottle={16}
                        style={{ height: '100%', paddingHorizontal: 20 }}
                        keyExtractor={item => item._id}
                        ListFooterComponent={<View style={{ height: 100 }} />} // Footer component for space after the list
                    />
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <EmptyStateComponent title='No Ads Found' img={require('@/assets/images/notFound.png')} subTitle={`You haven't created any \n ads yet with this profile`} />
                        </View>
                    }
                </View>
                <BottomSheetComponent title='Delete this ad?' bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} handleClosePress={handleClosePress} >
                    <View style={{ paddingHorizontal: 28 }}>

                        <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.medium, color: COLORS.gray }}>
                            {`Are you sure you want to delete this ad? \n This action cannot be undone.`}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Button label='No, Cancel' onPress={() => {
                                    handleClosePress();
                                }} variant='secondary' />
                            </View>
                            <View style={{ flex: 1 }}>

                                <Button label='Yes, Delete' onPress={(item: any) => {
                                    handleClosePress();
                                    deleteAd && deleteAd(selectedAd);
                                }} variant='default' />
                            </View>
                        </View>
                    </View>
                </BottomSheetComponent>

                <BottomSheetComponent title='Clarification Required' bottomSheetRef={bottomSheetRef2} snapPoints={snapPoints2} handleClosePress={handleClosePress2} >
                    <View style={{ paddingHorizontal: 28 }}>
                        <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.medium, color: COLORS.gray }}>
                            Fill in your clarification below, this will be sent to the admin for review. once sent you will not be able to edit the clarification.
                            <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.medium, color: COLORS.gray }}>
                                {adsData.find((item: any) => item._id === selectedAd)?.clarification}
                            </Text>
                        </Text>
                    </View>
                </BottomSheetComponent>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            </SafeAreaView>
    )
}

export default index
