import { View, Text, FlatList, ScrollView, ActivityIndicator, RefreshControl, StatusBar, TextInput, Alert, Platform, SafeAreaView } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { COLORS, FONT, SIZES } from '@/constants/theme'
import AdCard from '@/components/HomeScreen/AdCard'
import { fetchData, patchData, putData } from '@/lib/axiosUtility'
import { useFocusEffect, useNavigation } from 'expo-router'
import { BottomSheetComponent } from '@/components/bottomSheetComponent'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Input from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CheckBadgeIcon } from 'react-native-heroicons/solid'
import EmptyStateComponent from '@/components/emptyStateComponent'


const ClarificationRequests = () => {
    const [clarificationOffers, setClarificationOffers] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const navigation = useNavigation()
    const [clarificationId, setClarificationId] = useState<string>('')
    const [clarificationMessage, setClarificationMessage] = useState<string>('')
    const [clarificationUserResponse, setClarificationUserResponse] = useState<string>('')
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const getClarificationOffers = async () => {
        setLoading(true)
        try {
            const res = await fetchData(`/offer/v1/get/all/clarification-requested`)
            setClarificationOffers(res) 
           
        } catch (error) {
            console.log(error?.response?.data?.message)
        }
        setLoading(false)
    }
    useEffect(() => {
        getClarificationOffers()
    }, [])

    const onRefresh = () => {
        setRefreshing(true)
        getClarificationOffers()
        setRefreshing(false)
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Clarification Requests",
            headerBackTitleVisible: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.white,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerLargeTitle: true,
            headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerTransparent: true,
            headerShadowVisible: false,
            animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('dark-content')

        }, [])
    )
    const bottomSheetRef2 = useRef<BottomSheetModal>(null);
    const snapPoints2 = useMemo(() => ['55%', '40%', '85%'], []);
    const handleClosePress2 = () => {
        bottomSheetRef2.current?.close();
    };
    const snapToIndex = (index: number) => {
        bottomSheetRef2.current?.snapToIndex(index);
    };



    const handleSubmitClarification = async () => {
        try {
            if (!clarificationUserResponse) {
                return Alert.alert('Please enter a clarification')
            }
       
            if (!clarificationId) {

                return Alert.alert('Please select an offer')
            }
            const res = await patchData(`/offer/v1/${clarificationId}/submit-clarification`, {

                clarification: clarificationUserResponse
            })
         
            if (res?.message === 'Clarification submitted successfully') {
                getClarificationOffers()
                snapToIndex(1)
                setIsSubmitted(true)
                setTimeout(() => {
                    handleClosePress2()
                    setIsSubmitted(false)
                }, 1000)
            }
        } catch (error: any) {
            console.log(error?.response?.data?.message)

        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    {
                        loading ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View> :
                            clarificationOffers?.data?.length === 0 ?
                                <View style={{ flex: 1, justifyContent: 'center', margin: 20, alignItems: 'center', backgroundColor: COLORS.white }}>
                                    <EmptyStateComponent
                                        title='No Clarification Requests'
                                        subTitle={`No clarification requests found, \n you're all set`}
                                        img={require('@/assets/images/notFound.png')}
                                    />
                                </View>
                                :
                                <View style={{ flex: 1, margin: 20, backgroundColor: COLORS.white }}>
                                    <FlatList
                                        data={clarificationOffers?.data}
                                        renderItem={({ item }) => (
                                            <View style={{ marginVertical: 10, width: '100%' }} >
                                                <AdCard
                                                    id={item._id}
                                                    title={item.title}
                                                    expiry={item.offerExpiryDate}
                                                    location={item.location}
                                                    image={item.featuredImage}
                                                    fullWidth={true}
                                                    businessLogo={item.businessProfile.logo}
                                                    businessName={item.businessProfile.name}
                                                    status={item.status}
                                                    submitClarification={() => {
                                                        setClarificationId(item._id)
                                                     
                                                        setClarificationMessage(item.clarificationMessage)
                                                        snapToIndex(0)
                                                    }}
                                                    myAds={true}
                                                />
                                            </View>
                                        )}
                                        scrollEnabled={false}
                                        scrollEventThrottle={16}
                                        style={{ height: '100%', paddingHorizontal: 20 }}
                                        keyExtractor={item => item.id}
                                        ListFooterComponent={<View style={{ height: 100 }} />}
                                    />
                                </View>
                    }
                </ScrollView>
            </SafeAreaView>
            <BottomSheetComponent title='Clarification Required' bottomSheetRef={bottomSheetRef2} snapPoints={snapPoints2} handleClosePress={handleClosePress2} >
                {
                    isSubmitted ?
                        <View style={{ paddingHorizontal: 26, gap: 10, marginVertical: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <CheckBadgeIcon size={100} color={COLORS.primary} />
                            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.gray }}>
                                Clarification submitted successfully
                            </Text>
                        </View>
                        :
                        <View style={{ paddingHorizontal: 26, gap: 10 }}>
                            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.gray }}>
                                Fill in your clarification below, this will be sent to the admin for review. once sent you will not be able to edit the clarification.
                            </Text>
                            <View style={{ gap: 2 }}>
                                <Text style={{ fontFamily: FONT.semiBold, fontSize: SIZES.small, color: COLORS.gray }}>
                                    Clarification Message
                                </Text>
                                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.gray }}>
                                    {clarificationMessage}
                                </Text>
                            </View>
                            <Input
                                placeholder='Clarification'
                                multiline={true}
                                numberOfLines={4}
                                value={clarificationUserResponse}
                                onChangeText={(text: any) => setClarificationUserResponse(text)}
                                style={{ height: 150, textAlignVertical: 'top', fontFamily: FONT.regular, fontSize: SIZES.small + 2, color: COLORS.gray }}
                            />
                        </View>}
                <View style={{ paddingHorizontal: 26, gap: 10 }}>
                    {
                        isSubmitted ?
                            <Button label='Done' onPress={handleClosePress2} variant='default' />
                            :
                            <Button label='Submit Clarification' onPress={handleSubmitClarification} variant='default' />
                    }
                </View>
            </BottomSheetComponent>
        </>
    )
}

export default ClarificationRequests

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listContainer: {
        padding: 10,
    },
});
