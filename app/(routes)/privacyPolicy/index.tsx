import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Platform, } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { Stack, useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { privacypolicyContent } from '@/constants';

interface PrivacyItemProps {
    item: {
        question: string;
        answer: string;
    };
    index: number;
}

const PrivacyItem = ({ item, index }: PrivacyItemProps) => {
    const [expanded, setExpanded] = useState(false);

    return (

        <TouchableOpacity activeOpacity={0.5} onPress={() => setExpanded(!expanded)} style={styles.privacyItem}>
            <View style={[styles.questionContainer, { flexDirection: 'row' }]}>
                <Text style={styles.questionText}>{index + 1}. {item.question}</Text>
                <Icon style={{ marginLeft: 'auto' }}
                    name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} // Change icon based on expanded state
                    size={24}
                    color={COLORS.white}
                />
            </View>
            {expanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const PrivacyScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Privacy and Policy",
            headerBackTitleVisible: true,
            headerLargeTitle: true,
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: COLORS.white },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerShadowVisible: false,
            animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }, [navigation]);

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
                        >{privacypolicyContent}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: SIZES.medium,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.gray,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.primary,
        marginBottom: SIZES.medium,
    },
    privacyItem: {
        marginBottom: SIZES.small,
        borderRadius: SIZES.small,
        backgroundColor: COLORS.lightWhite,
        overflow: 'hidden',
    },
    questionContainer: {
        padding: SIZES.medium,
        backgroundColor: COLORS.primary,
    },
    questionText: {
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.white,
    },
    answerContainer: {
        padding: SIZES.medium,
    },
    answerText: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
});
