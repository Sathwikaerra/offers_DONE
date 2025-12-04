import EmptyStateComponent from "@/components/emptyStateComponent";
import AdCard from "@/components/HomeScreen/AdCard";
import { adsData, categories } from "@/constants";
import { COLORS, FONT } from "@/constants/theme";
import { fetchData } from "@/lib/axiosUtility";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGlobalSearchParams } from "expo-router";
import { Activity } from "lucide-react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";

const index = () => {
    const [loading, setLoading] = useState(true);
    const [trending, setTrending] = useState([]) as any;

    const navigation = useNavigation();

    const getTrending = async () => {
    

        try {
            const res = await fetchData(`/offer/v1/get/trending`) as any;
        
            setTrending(res.data);
        }
        catch (error: any) {
            console.log(error.response.data.msg);
        }
    }



    useEffect(() => {
        setLoading(true);
        getTrending().finally(() => {
            setLoading(false);
        });
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Trending Offers',
            headerBackTitleVisible: true,
            headerLargeTitle: true,
            headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.white,
                // shadowColor: 'transparent',
                // elevation: 0,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerShadowVisible: false,
            customAnimationOnGesture: true,
            fullScreenGestureEnabled: true,
            animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'default',
          animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }
        , [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            // Set the status bar style for this screen
            StatusBar.setBarStyle('dark-content', true); // Adjust the style if needed
            Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white, true); // Adjust the background color if needed

            return () => {
                // Optional cleanup for status bar (if needed)
            };
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            {/* <ScrollView style={{ flex: 1 }}> */}
            {
                loading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                    </View> :
                    trending.length > 0 ?
                    <View >

                        <FlatList
                            data={trending}
                            renderItem={({ item }) => (
                                <View style={{ marginVertical: 10, width: '100%' }} >

                                    <AdCard
                                        id={item._id}
                                        title={item.title}
                                        expiry={item.offerExpiryDate}
                                        location={item.businessProfile?.location?.addressLine1 + ", " + item.businessProfile?.location?.city}

                                        image={item.featuredImage}
                                        fullWidth={true}
                                        businessLogo={item.businessProfile.logo}
                                        businessName={item.businessProfile.name}
                                    />
                                </View>
                            )}
                            scrollEnabled={true}
                           
                            scrollEventThrottle={16}
                            style={{ height: '100%', paddingHorizontal: 20 }}
                            keyExtractor={item => item.id}
                            ListFooterComponent={<View style={{ height: 100 }} />} // Footer component for space after the list
                        />

                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                       <EmptyStateComponent
                       title="No Trending Offers"
                       subTitle="There are no trending offers at the moment. Please check back later."
                       img={require('@/assets/images/notFound.png')}
                       />
                    </View>
            }
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

export default index;