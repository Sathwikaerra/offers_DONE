import { View, Text, SafeAreaView, ScrollView, Platform } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { FONT, SIZES, COLORS } from '@/constants/theme'
import { termsOfServiceContent } from '@/constants'


const Termsandconditionsscreen = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true, // Set this to false to hide the header bar across the entire app
                    headerLargeTitle: false, // Set this to true to use the large title iOS feature
                    headerTitle: 'Terms of Service', // Set the header title here
                    headerStyle: {
                        backgroundColor: COLORS.white,
                    },
                    headerTitleStyle: {
                        color: COLORS.primary,
                        fontFamily: FONT.bold,
                        fontSize: SIZES.medium
                    },
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    
                        fontFamily: FONT.regular,
                        fontSize: SIZES.medium
                    },
                    headerTintColor: COLORS.primary,
                    headerShadowVisible: false,
                    animationDuration: Platform.OS === "android" ? undefined : 200,
                }}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, }}>
                <ScrollView style={{ padding: 20 }}>
                    <View style={{ marginBottom: 20, gap: 4 }}>

                        <Text
                            style={{
                                fontFamily: FONT.regular,
                            
                                color: COLORS.gray
                            }}
                        >{termsOfServiceContent}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Termsandconditionsscreen
