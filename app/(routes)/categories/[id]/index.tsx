import EmptyStateComponent from "@/components/emptyStateComponent";
import AdCard from "@/components/HomeScreen/AdCard";
import { COLORS, FONT } from "@/constants/theme";
import { fetchData } from "@/lib/axiosUtility";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGlobalSearchParams } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ActivityIndicator, Alert, Animated, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";

const index = () => {

    const navigation = useNavigation();
    const params = useGlobalSearchParams();
    const { id } = params;
    //get category name from id with split and make sure to get all the elements after the first space
    const name = id.toString().split(' ').slice(1).join(' ');

    console.log("categories page",id ,name)

    //    const _id = 
    // const data = categories.filter((item) => item?.id?.toString() === id?.toString())[0];
    const [loading, setLoading] = React.useState(true);
    const [categoryAdData, setCategoryAdData] = React.useState([]);
    const [error, setError] = React.useState('')
    const [categoryName, setCategoryName] = React.useState();

    const getCategoryAds = async () => {
        try {
            const response = await fetchData(`/offer/v1/get/category/${id.toString().split(' ')[0]}`);

            setCategoryAdData(response);
            setCategoryName(response.data[0]?.category?.name);
            if (response.data.length === 0) {
                setError('No ads found for this category');
                setLoading(false)
            }
            setLoading(false) 
         
        } catch (error: any) {

            console.error(error?.response?.data?.message);
            Alert.alert('Error', error.response.data.message);
        }
    }

    React.useEffect(() => {
        getCategoryAds();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: name || 'Category',
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
        , [navigation, categoryName]);

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
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <ActivityIndicator color={COLORS.primary} s />

            </View> :
                error ?

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <EmptyStateComponent img={require('@/assets/images/notFound.png')} title={"Nothing Found"} subTitle={error} />
                    </View>
                    :

                    <View >


                        <FlatList
                            data={categoryAdData?.data}
                            renderItem={({ item }) => (
                                <View style={{ marginVertical: 10, width: '100%' }} >

                                    <AdCard
                                        id={item._id}
                                        title={item.title}
                                        expiry={item?.offerExpiryDate}
                                        location={ item.businessProfile?.location?.addressLine1 + ", " + item.businessProfile?.location?.city}
                                        image={item.featuredImage}
                                        businessName={item?.businessProfile?.name}
                                        businessLogo={item?.businessProfile?.logo}
                                        fullWidth={true}
                                    />
                                </View>
                            )}
                            scrollEnabled={true}
                            scrollEventThrottle={16}
                            style={{ height: '100%', paddingHorizontal: 20 }}
                            keyExtractor={item => item._id}
                            ListFooterComponent={<View style={{ height: 100 }} />} // Footer component for space after the list
                        />

                    </View>}
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

export default index;