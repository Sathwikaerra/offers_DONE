import { View, Text, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BellRing, Bookmark, Home, Plus, Settings } from 'lucide-react-native';
import { COLORS, FONT } from '@/constants/theme';

interface TabBarButtonProps {
    isFocused: boolean;
    label: string;
    routeName: string;
    color: string;
    index: number;
    onPress?: (event: GestureResponderEvent) => void;
    onLongPress?: (event: GestureResponderEvent) => void;
}

const TabBarButton = ({
    isFocused,
    label,
    routeName,
    color,
    index,
    onPress,
    onLongPress
}: TabBarButtonProps) => {

    const scale = useSharedValue(0);
    const barTranslateX = useSharedValue(0);
    const previousIndexRef = useRef(index);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });

        const direction = index > previousIndexRef.current ? 1 : -1;

        barTranslateX.value = withSpring(
            isFocused ? 0 : direction * 50,
            { duration: 200 }
        );

        // ✅ update after animating so direction stays correct
        previousIndexRef.current = index;
    }, [isFocused, index]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
        const top = interpolate(scale.value, [0, 1], [0, 8]);
        return {
            transform: [{ scale: scaleValue }],
            top,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return { opacity };
    });

    const animatedBarStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: barTranslateX.value }] };
    });

    if (routeName === 'create') {
        return (
            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.createButton}
            >
                <Plus size={18} color={'#fff'} />
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.container}
        >
            <Animated.View style={animatedIconStyle}>
                {routeName === 'index' && <Home size={19} color={color} />}
                {routeName === 'Notifications' && <BellRing size={19} color={color} />}
                {routeName === 'Saved' && <Bookmark size={19} color={color} />}
                {routeName === 'Settings' && <Settings size={19} color={color} />}
            </Animated.View>

            <Animated.Text
                style={[{ color, fontSize: 9, fontFamily: FONT.semiBold }, animatedTextStyle]}
            >
                {label}
            </Animated.Text>

            {/* Top bar indicator */}
            <Animated.View
                style={[
                    {
                        backgroundColor: color,
                        height: 4,
                        width: '60%',
                        position: 'absolute',
                        top: -12,
                        borderRadius: 20,
                        opacity: isFocused ? 1 : 0,
                    },
                    animatedBarStyle,
                ]}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // RN 0.71+ supports gap
        ...(typeof View.prototype?.props?.gap !== 'undefined'
            ? { gap: 4 }
            : {} // For older versions, add marginBottom to text manually
        ),
    },
    createButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        width: 35,
        height: 40,
        fontSize:12,
        bottom:3,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
});

export default TabBarButton;
