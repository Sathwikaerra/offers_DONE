import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, StatusBar, Platform, FlatList, Alert } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { ChevronRight } from 'lucide-react-native'
import { COLORS, FONT, SIZES } from '@/constants/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { router, Stack } from 'expo-router'
import { settingsTabs } from '@/constants'
import { fetchData } from '@/lib/axiosUtility'
import { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useSession } from '@/provider/ctx'
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@/constants/theme'

const three = () => {
    const navigation = useNavigation()
    const [currentUser, setCurrentUser] = useState('');
    const { signOut } = useSession();

    const getCurrentUserDetails = async () => {


        try {
            
            //  const res = await axios.get(`${BACKEND_URL}/user/v1/current`).then(res => res.data) as any;
            //send request with token in header
            const res = await fetchData(`${BACKEND_URL}/user/v1/current`)
            setCurrentUser(res);
           
            
        

        } catch (error: any) {
            console.log('error', error.response.data.message)
            Alert.alert('Error', error.response.data.message)
        }
    }
  useFocusEffect(
    React.useCallback(() => {
        getCurrentUserDetails();
    }, [])
);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Settings',
            headerBackTitleVisible: false,
            headerLargeTitle: true,
            headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.white,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerShadowVisible: false,
            customAnimationOnGesture: true,
            fullScreenGestureEnabled: true,
            animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'none',
            animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }
        , [navigation]);

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
    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
            <View >
                {/* Interest Section */}
                <View style={styles.interestsContainer}>
                    <View style={styles.profileImgContainer}>

                        <Image
                            style={styles.profileImage}
                            source={{ uri: currentUser?.profilePic }}
                        />
                    </View>
                    <View style={styles.profileContainer}>
                        <Text numberOfLines={2} style={styles.profileName}>{currentUser?.name?.first } {currentUser?.name?.middle} {currentUser?.name?.last}
                                                        </Text>
                        <Text numberOfLines={currentUser?.email?.length > 20 ? 2 : 1} style={{ fontFamily: FONT.regular, fontSize: SIZES.small, width: '100%' }} >{currentUser?.email || currentUser?.mobileNumber}</Text>
                    </View>
                </View>
                <FlatList
                    data={settingsTabs}
                    keyExtractor={item => item.title}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: COLORS.white2, padding: 20, margin: 10, borderRadius: 16 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (item.title === 'Sign Out') {
                                        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                            {
                                                text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel'
                                            },
                                            {
                                                text: 'OK', onPress: () => {
                                                    signOut();
                                                    SecureStore.deleteItemAsync('token');
                                                }
                                            }
                                        ])
                                    } else {
                                        router.push(item.route as any)
                                    }
                                }
                                }
                                style={styles.interestsHeader}>
                                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                                    {item.icon}
                                    <Text style={styles.interestsTitle}>{item.title}</Text>
                                </View>

                                <ChevronRight color={COLORS.gray} size={24} />

                            </TouchableOpacity>
                        </View>
                    )}
                    style={{ padding: 20 }}
                />
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default three

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.tabWhite,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    profileContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 10,
    },
    profileImgContainer: {
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        width: 80,
        height: 80,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: COLORS.tabWhite,
        overflow: 'hidden'


    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius:10,
    },
    profileName: {
        fontSize: 22,
        fontFamily: FONT.bold,
        width: '80%',
        color: '#000',
        textAlign: 'left',
    },
    interestsContainer: {
        flexDirection: 'row',
        textAlign: 'left',
        backgroundColor: COLORS.white,
        borderRadius: 25,
        padding: 20,
        gap: 10,
        margin: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    interestsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    interestsTitle: {
        fontSize: SIZES.medium - 1,
        fontFamily: FONT.semiBold,
        color: '#000',
    },

});