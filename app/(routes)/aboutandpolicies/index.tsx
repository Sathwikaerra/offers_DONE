import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import { FlatList } from 'react-native-gesture-handler'
import { ChevronRight } from 'lucide-react-native'
import { COLORS, FONT, SIZES } from '@/constants/theme'
import { aboutAndPoliciesTabs } from '@/constants'

const index = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'About & Policies',
            headerBackTitleVisible: true,
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
          animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }
        , [navigation]);
    return (
        <View style={{ flex: 1, }}>
            <FlatList
                data={aboutAndPoliciesTabs}
                keyExtractor={item => item.title}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: COLORS.white2, padding: 20, margin: 10, borderRadius: 16 }}>
                        <TouchableOpacity
                            onPress={() =>
                               {
                                if (item.title === 'Request Account Deletion') {
                                    Linking.openURL(item.route as any)
                                    return
                                }
                                else {
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
    )
}

export default index

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