import { View, Text, SafeAreaView, FlatList, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { router, useNavigation } from 'expo-router';
import { deleteData, fetchData } from '@/lib/axiosUtility';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import BusinessProfileCard from '@/components/businessProfileCard';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button } from '@/components/ui/Button';
import EmptyStateComponent from '@/components/emptyStateComponent';

const index = () => {
    const [loading, setLoading] = useState(true);
    const [businessProfiles, setBusinessProfiles] = useState([]) as any;
    const navigation = useNavigation();
    const [selectedBusinessProfile, setSelectedBusinessProfile] = React.useState('') as any;
    const [deleting, setDeleting] = useState(false); // To track the deletion process
    const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );
    const getBusinesses = async () => {
        try {
            const res = await fetchData('/business/v1/get/current');
            setBusinessProfiles(res?.businessProfiles);
        }
        catch (error: any) {
            console.log(error.response.data.message);
        }
    }
    const handleDeletePress = (id: string) => {
        snapToIndex(0);
        setSelectedBusinessProfile(id);
    }
    const deleteBusiness = async (id: string) => {

        if (!selectedBusinessProfile) return;
        setDeleting(true); // Set deleting to true to show loading indicator
        try {
            await deleteData(`/business/v1/${selectedBusinessProfile}`);
            await getBusinesses(); // Refresh the business profiles list
            setSelectedBusinessProfile('');
            handleClosePress(); // Close the bottom sheet
            Alert.alert('Success', 'Business profile deleted successfully.');
        } catch (error) {
            console.error('Failed to delete business profile:', error);
            Alert.alert('Error', 'Failed to delete business profile. Please try again.');
        } finally {
            setDeleting(false); // Reset deleting state
        }
    }

    useEffect(() => {
        setLoading(true);
        getBusinesses().then(() => setLoading(false));
    }
        , [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'My Business Profiles',
            headerBackTitleVisible: true,
            headerLargeTitle: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.white,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerShadowVisible: false,
            // customAnimationOnGesture: true,
            // fullScreenGestureEnabled: true,
            animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }
        ,);
    return (
        <>
            <SafeAreaView>
                <ScrollView>
                    <View style={{ flex: 1, margin: 20, backgroundColor: COLORS.white }}>
                        <Text style={{ fontSize: SIZES.small, textAlign: 'center', fontFamily: FONT.regular, color: COLORS.gray, }}>Swipe right to delete or edit your Business Profile</Text>
                        {
                            loading ? <ActivityIndicator size="small" color={COLORS.primary} /> :
                                <FlatList
                                    data={businessProfiles}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1, margin: 5 }}>
                                            <BusinessProfileCard
                                                _id={item._id}
                                                businessName={item.name}
                                                logo={item.logo}
                                                location={item?.location?.addressLine1 || item?.location?.landmark || item?.location?.city}
                                                deleteBusiness={() => handleDeletePress(item._id)}
                                                handleEditBusiness={() => router.push(`/editBusinessProfile/${item._id}`)}
                                            />
                                        </View>
                                    )}
                                    ListEmptyComponent={
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                                           <EmptyStateComponent
                                            title='No Business Profiles Found'
                                            subTitle='You can add your business profile by clicking the button below'
                                            img={require('@/assets/images/notFound.png')}
                                          
                                            />
                                        </View>
                                    }
                                    scrollEnabled={false}
                                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    keyExtractor={(item) => item._id}
                                />}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <BottomSheetComponent title='Delete this Business Profile?' bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} handleClosePress={handleClosePress} >
                <View style={{ paddingHorizontal: 28 }}>

                    <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.medium, color: COLORS.gray }}>
                        {`Are you sure you want to delete this Business Profile? \n This action cannot be undone.`}
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
                        <View style={{ flex: 1 }}>
                            <Button label='No, Cancel' onPress={() => {
                                handleClosePress();
                            }} variant='secondary'
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button label='Yes, Delete' onPress={(item: any) => {
                                handleClosePress();
                                deleteBusiness && deleteBusiness(selectedBusinessProfile);
                            }} variant='default' />
                        </View>
                    </View>
                </View>
            </BottomSheetComponent>
        </>
    )
}
export default index