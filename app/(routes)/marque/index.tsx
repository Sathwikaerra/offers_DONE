import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, Dimensions, StyleSheet } from 'react-native';
import { FONT, COLORS } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface MarqueeProps {
  text: string;
  duration?: number; // optional, default speed
}

export const MarqueeText: React.FC<MarqueeProps> = ({ text, duration = 8000 }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textWidth === 0) return;

    const animate = () => {
      translateX.setValue(screenWidth); // start from off-screen right
      Animated.timing(translateX, {
        toValue: -textWidth, // move to off-screen left
        duration,
        useNativeDriver: true,
      }).start(() => animate()); // loop
    };

    animate();
  }, [textWidth]);

  return (
    <View style={styles.container}>
      <Animated.Text
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        style={[styles.text, { transform: [{ translateX }] }]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    height: 30,
  },
  text: {
    fontFamily: FONT.bold,
    fontSize: 20,
    color: COLORS.black,
  },
});
