
import { ActivityIndicator, Alert, Animated, Dimensions, FlatList, Image, Modal, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { businessProfileTabs } from '@/constants';
import { COLORS, FONT } from '@/constants/theme';
import { TabbedHeaderPager } from 'react-native-sticky-parallax-header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TopNavigation from '@/components/TopNavigation';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import AdCard from '@/components/HomeScreen/AdCard';
import { fetchData, putData } from '@/lib/axiosUtility';
import * as Location from 'expo-location';
import { computeDistance } from '@/lib/utils';
import { Phone } from 'lucide-react-native';
import * as Linking from "expo-linking";
const ITEM_HEIGHT = 190;
const ITEM_MARGIN_VERTICAL = 5;

export const TABBED_SECTION_ITEM_HEIGHT = ITEM_HEIGHT + 2 * ITEM_MARGIN_VERTICAL;

const index = () => {
    const [businessProfileData, setBusinessProfileData] = useState({}) as any;
    const params = useLocalSearchParams();
    const [currentLocation, setCurrentLocation] = useState({}) as any;
    const [distance, setDistance] = useState(0);
    const _id = params.id;
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gallery, setGallery] = useState([]);

    const getBusinesseProfileData = async () => {
        try {
            setLoading(true)
            const res = await fetchData(`/business/v1/${_id}`);

            setBusinessProfileData(res);
            const user = await getUser();
            const isFollowing = res?.followers.followers.includes(user._id)

            setGallery(res?.businessPictureGallery)

            setIsFollowing(isFollowing ? true : false)
            setLoading(false)
        }
        catch (error: any) {
            console.log(error.response.data.message);
        }
    }

    const getUser = async () => {
        try {
            const user = await fetchData('/user/v1/current')

            return user
        } catch (error) {
            console.log("error", error);
        }
    }

    const getLocationAsync = async () => {

        let location = await Location.getCurrentPositionAsync({});
        const region = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }
        setCurrentLocation({ location, region });
    }
    const { width } = Dimensions.get('window');

    useEffect(() => {
        getLocationAsync()
        getBusinesseProfileData();
        const distance = computeDistance([
            currentLocation?.location?.coords?.latitude,
            currentLocation?.location?.coords?.longitude
        ], [
            businessProfileData?.location?.coordinates[1],
            businessProfileData?.location?.coordinates[0]
        ])
    }, [params._id]);

    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerTitle: "Business Profile",
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
            headerShadowVisible: false,
            animationDuration: Platform.OS === "android" ? undefined : 200,

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

    const title = businessProfileData?.name;
    const [topReached, setTopReached] = useState(false);

    const handleAddFollower = async () => {
        try {
            const res = await putData(`/business/v1/increment/followers/${_id}`);
          
            setIsFollowing(!isFollowing)

        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        if (topReached) {
            setHeaderTitle("Business Profile");
        } else {
            setHeaderTitle(title);
        }
    }, [topReached]);
    const [headerTitle, setHeaderTitle] = useState(title);

    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);


    const renderGalleryImage = (imageUri: any) => {
        return (
            <TouchableOpacity onPress={() => setSelectedImage(imageUri)}>
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: 100, height: 100, margin: 5 }}
                />
            </TouchableOpacity>
        );
    };

    const ImageModal = ({ visible, imageUri, onClose }: any) => {
        if (!visible) return null;

        return (
            <Modal
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: '90%',
                            height: '90%',
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        loading ?
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
            :
            <View style={{ position: 'relative', flex: 1, flexDirection: 'column' }}>
                <Stack.Screen

                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                        fullScreenGestureEnabled: false,
                    }}
                />
                <TopNavigation backBtn={true} title={headerTitle} />
                <TabbedHeaderPager
                    contentContainerStyle={styles.lightBackground}
                    containerStyle={{ backgroundColor: COLORS.white}}

                    backgroundColor={COLORS.white2}
                    foregroundImage={{ uri: businessProfileData?.logo }}
                    rememberTabScrollPosition

                    parallaxHeight={50}
                    renderHeaderBar={() => (
                        <View style={{ height: 30, backgroundColor: COLORS.white }} />
                    )}
                   
                   
                    //break the title into two lines when it's too long
                    title={
                        title?.length > 20 && title?.split(' ')[0]?.length > 6
                            ? title?.replace(' ', '\n')
                            : title
                    }

                    titleStyle={styles.text}
                    tabs={businessProfileTabs.map((section) => ({
                        title: section.title,
                        icon(isActive) {
                            return section.icon;
                        },

                        testID: section.title,
                    }))}
                    centerContent={true}
                    
                    tabTextActiveStyle={{ color: COLORS.white, fontFamily: FONT.bold, fontSize: 16 }}
                    tabTextContainerActiveStyle={{ backgroundColor: COLORS.primary, width: '100%', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 6, }}


                    onTopReached={() => {

                        setTopReached(true);
                    }}
                    tabTextStyle={{ color: '#000', fontFamily: FONT.bold, fontSize: 16 }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: COLORS.white }}>

                        <View style={{ backgroundColor: COLORS.white2, width: '100%', flexDirection: 'row', padding: 20, justifyContent: 'space-between', alignItems: 'center' }}>

                            <View style={{ flexDirection: 'column', gap: 4, width: "50%" }}>
                                <Text style={{ fontSize: 16, fontFamily: FONT.regular }}>{businessProfileData?.followers?.count} Followers</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: "50%", gap: 10 }}>
                                <TouchableOpacity


                                    onPress={async () => {
                                        // Remove any characters except + and digits
                                        const phoneNumber = businessProfileData?.phoneNumber?.replace(/[^+\d]/g, "");

                                        if (phoneNumber) {
                                            try {
                                                // Dynamically use the cleaned-up phone number
                                                await Linking.openURL(`tel:${phoneNumber}`);
                                            } catch (error) {
                                                console.error("Error opening phone app:", error);
                                                Alert.alert("Error", "Unable to open phone app. Please try again.");

                                            }
                                        } else {
                                            Alert.alert("Error", "Phone number is not valid or missing");
                                        }

                                    }}

                                    style={{ marginTop: 10, width: "20%" }}>
                                    <Phone size={24} color={COLORS.primary} />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', width: "75%", gap: 10 }}>
                                    {isFollowing ?
                                        <Button onPress={handleAddFollower} label="Following" variant={"white"} />
                                        :
                                        <Button onPress={handleAddFollower} label="Follow" variant={"default"} />}
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 20 }}>
                            {
                                gallery.length > 0 &&
                                gallery.map((item: any) => (
                                    <TouchableOpacity
                                        key={item?._id}
                                        style={{ width: '32%', marginBottom: 10, borderRadius: 16, overflow: 'hidden' }}
                                        onPress={() => {
                                            setSelectedImage(item?.imageUrl);
                                            setModalVisible(true);
                                        }}
                                    >
                                        <Image source={{ uri: item?.imageUrl }} style={{ width: '100%', aspectRatio: 1 }} />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <View style={{ backgroundColor: COLORS.white, padding: 20 }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT.regular, color: COLORS.gray }}>{businessProfileData?.description}</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT.bold, color: COLORS.gray }}>{businessProfileData?.category?.name}</Text>
                        </View>
                        <View style={{ backgroundColor: COLORS.white, padding: 20 }}>
                            <Text style={{ fontSize: 14, fontFamily: FONT.regular, color: COLORS.gray }}>{businessProfileData?.website}</Text>
                            <Text style={{ fontSize: 14, fontFamily: FONT.regular, color: COLORS.gray }}>GSTIN: {businessProfileData?.GSTIN}</Text>
                            <View style={{ backgroundColor: COLORS.white, padding: 20 }}>


                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => setModalVisible(false)}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.9)',
                                        }}
                                        activeOpacity={1}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={{ width: '90%', height: '90%', resizeMode: 'contain' }}
                                        />
                                    </TouchableOpacity>
                                </Modal>
                            </View>
                        </View>
                    </View>

                    <View style={{ backgroundColor: COLORS.white, }}>
                        <Animated.FlatList
                            data={businessProfileData?.offers}
                            renderItem={({ item }) => (
                                <View style={{ marginTop: 10, width: '100%' }} >

                                    <AdCard
                                        id={item._id}
                                        title={item.title}
                                        expiry={item.offerExpiryDate}
                                        location={ businessProfileData?.location?.addressLine1 + ", " + businessProfileData?.location?.city}
                                        image={item.featuredImage}
                                        fullWidth={true}
                                        businessName={businessProfileData?.name}
                                        businessLogo={businessProfileData?.logo}
                                    />
                                </View>
                            )}
                            scrollEnabled={false}
                            // Track the scroll position


                            scrollEventThrottle={16}
                            style={{ height: '100%', paddingHorizontal: 20 }}

                            keyExtractor={item => item._id}

                            ListFooterComponent={<View style={{ height: 10 }} />} // Footer component for space after the list
                        />
                    </View>
                </TabbedHeaderPager>

            </View>
    )
}

export default index

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 25,
    },
    contentText: {
        alignSelf: 'flex-start',
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: 24,
        letterSpacing: -0.2,
        lineHeight: 28,
        paddingBottom: 20,
        paddingTop: 40,
    },
    darkBackground: {
        backgroundColor: COLORS.tertiary,
    },
    lightBackground: {
        backgroundColor: COLORS.white,
    },
    screenContainer: {
        alignItems: 'center',
        // alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
    },
    stretch: {
        alignSelf: 'stretch',
    },
    stretchContainer: {
        alignSelf: 'stretch',
        height: '10%',
    },
    text: {
        fontFamily: FONT.bold,
        color: '#000',

    },
});