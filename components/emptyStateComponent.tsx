import { StatusBar, Animated, StyleSheet, Text, View, ImageSourcePropType } from 'react-native'
import React, { useRef } from 'react'
import { COLORS, FONT } from '@/constants/theme'
import { useFocusEffect } from 'expo-router';


interface EmptyStateComponentProps {
    img: ImageSourcePropType;
    title: string;
    subTitle: string;
}

const EmptyStateComponent = ({ img, title, subTitle }: EmptyStateComponentProps) => {

    const scaleValue = useRef(new Animated.Value(0)).current;
    const animatePop = () => {
        scaleValue.setValue(0); // Reset the animation value
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 5,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    useFocusEffect(
        React.useCallback(() => {
            animatePop(); // Start the animation whenever the screen is focused
        }, [])


    );

    return (
        <View style={styles.container}>
            <Animated.Image source={img} style={{ width: 160, height: 160, transform: [{ scale: scaleValue }], objectFit: 'contain', marginBottom: 20, marginLeft: -10 }} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subTitle}</Text>
            <StatusBar animated={true} barStyle="dark-content" backgroundColor={COLORS.tabWhite} />
        </View>
    )
}

export default EmptyStateComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        // backgroundColor: COLORS.tabWhite
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: FONT.bold
    },
    subTitle: {
        color: COLORS.gray,
        fontFamily: FONT.medium,
        textAlign: 'center',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});