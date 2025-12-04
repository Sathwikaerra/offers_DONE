import { View, Animated, TouchableOpacity, Text, SafeAreaView, ScrollView, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { APP_NAME, AUTH_TYPES, COLORS, FONT, SHADOWS, SIZES } from '../../constants/theme'
import { SearchBar } from 'react-native-screens'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MobileLogin from '@/components/LoginScreen/LoginWithMobile'
import LoginWithEmail from '@/components/LoginScreen/LoginWithEmail'
import tw from 'tailwind-react-native-classnames'
import { NavigationContainer } from '@react-navigation/native'
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/ui/Button'

const loginScreen = () => {
 
    const [activeTab, setActiveTab] = React.useState('Email')

    const hapticFeedback = (type: string) => {
        if (type == 'success') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        else if (type == 'error') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        else if (type == 'warning') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        else if (type == 'selection') {
            Haptics.selectionAsync();
        }
        else if (type == 'heavy') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        else if (type == 'medium') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

   
   
    return (
        <>
            <Stack.Screen options={
                {
                    headerShown: true,
                    headerTitle: Platform.OS == 'ios' ? APP_NAME : APP_NAME,
                    headerLargeTitle: false,
                    headerStyle: {
                        backgroundColor: COLORS.white2
                    },
                    headerLargeStyle: {
                        backgroundColor: COLORS.white2
                    },
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontFamily: FONT.semiBold,
                        fontSize: Platform.OS === 'ios' ? SIZES.medium : SIZES.large,
                        color: COLORS.tertiary
                    },
                    headerBackTitleVisible: false,
                    headerLargeTitleStyle: {
                        fontFamily: FONT.bold,
                        fontSize: SIZES.xLarge,
                        color: COLORS.tertiary
                    },
                    headerTintColor: COLORS.tertiary,
                    headerShadowVisible: false,
                    headerBackVisible: true,
                    gestureEnabled: true,
                    animationDuration: Platform.OS === "android" ? undefined : 200,
                }
            }
            />

            <SafeAreaView style={[tw` h-full`, { backgroundColor: COLORS.white2, flex: 1 }]}>

                <View style={tw`pt-4`}>
                    <Text style={[tw`text-left  mx-4`, { fontFamily: FONT.bold, fontSize: Platform.OS === 'ios' ? SIZES.xxLarge : SIZES.xLarge }]}>
                        Login to Your Account
                    </Text>
                    {AUTH_TYPES.MOBILE && AUTH_TYPES.EMAIL && <Text style={[tw`text-left mx-4 my-1`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.medium }]}>
                        {activeTab == 'Mobile' ? 'Login via Mobile' : 'Login via Email'}
                    </Text>}


                </View>

                {AUTH_TYPES.MOBILE && AUTH_TYPES.EMAIL && (
                    <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '92%', gap: 10, padding: 10, borderRadius: 20, backgroundColor: COLORS.white, margin: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '48%', justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    label="Email"
                                    onPress={() => {
                                        setActiveTab('Email')
                                        hapticFeedback('selection')
                                    }}
                                    variant={activeTab === 'Email' ? 'default' : 'white'}
                                />

                            </View>
                            <View style={{ flexDirection: 'row', width: '48%', justifyContent: 'center', alignItems: 'center' }}>
                                <Button
                                    label="Mobile"
                                    onPress={() => {
                                        setActiveTab('Mobile')
                                        hapticFeedback('selection')
                                    }}
                                    variant={activeTab === 'Mobile' ? 'default' : 'white'}
                                />

                            </View>

                        </View>
                        <View style={{ width: '100%', paddingHorizontal: 20, flex: 1 }}>
                            {activeTab === 'Mobile' ? <MobileLogin /> : <LoginWithEmail />}
                        </View>
                    </View>
                )}





            </SafeAreaView>
        </>
    )
}

export default loginScreen

const styles = StyleSheet.create({})