import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { FONT, SIZES, COLORS } from '@/constants/theme'
import { aboutContent } from '@/constants'

const Index = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true, // Set this to false to hide the header bar across the entire app
                    headerLargeTitle: false, // Set this to true to use the large title iOS feature
                    headerTitle: 'About', // Set the header title here
                    headerStyle: {
                        backgroundColor: COLORS.white,
                    },
                    headerTitleStyle: {
                        color: COLORS.primary,
                        fontFamily: FONT.bold,
                        fontSize: SIZES.medium
                    },
                    animationDuration: undefined,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {

                        fontFamily: FONT.regular,
                        fontSize: SIZES.medium
                    },
                    headerTintColor: COLORS.primary,
                    headerShadowVisible: false,
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
                        >{aboutContent}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Index
