import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const SkeletonCard = () => {
    const [opacityAnimation] = useState(new Animated.Value(1));

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacityAnimation, {
                        toValue: 0.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        };

        startAnimation();
    }, [opacityAnimation]);

    return (
        <Animated.View style={[styles.skeletonCard, { opacity: opacityAnimation }]} />
    );
};

const styles = StyleSheet.create({
    skeletonCard: {
        width: '100%',
        height: '100%',
        // marginVertical: 10,
        borderRadius: 12,
        backgroundColor: COLORS.gray2
    },
});

export default SkeletonCard;