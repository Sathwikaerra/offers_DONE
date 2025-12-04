import React from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { CheckCircle } from 'lucide-react-native'; // You can use any icon library here
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from "expo-linear-gradient";



interface AdCardProps {
    id: string;
    title: string;
    image: string;
    fullWidth?: boolean;
    selected: boolean;
    onSelect: (id: string) => void;
}

const CategoriesCard = ({ id, title, image, fullWidth, selected, onSelect }: AdCardProps) => {
    const scale = useSharedValue(selected ? 0.95 : 1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        if (selected) {
            // Deselect the card
            onSelect(null as any);
            scale.value = withSpring(1, {
                damping: 10,
                stiffness: 100,
            });
        } else {
            // Select the card
            onSelect(id);
            scale.value = withSpring(0.95, {
                damping: 10,
                stiffness: 100,
            });
        }
    };

    const handleLongPress = () => {
        // Scale down on long press
        scale.value = withTiming(0.9, { duration: 150 });
    };

    const handlePressOut = () => {
        // Scale back when long press is released
        scale.value = withTiming(1, { duration: 150 });
    };

    return (
       <TouchableWithoutFeedback
  onPressIn={handleLongPress}
  onPress={handlePress}
  onPressOut={handlePressOut}
>
  <Animated.View
    style={[
      animatedStyle,
      { width: fullWidth ? '100%' : 150, borderRadius: 12 }
    ]}
  >
    <LinearGradient
      colors={['#FBC2EB', '#A6C1EE']} // full card gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={adCardStyles.card}
    >
      {/* Image */}
      <View style={adCardStyles.imageContainer}>
        <Image
          source={{
            uri:
              image ||
              'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop'
          }}
          style={adCardStyles.image}
        />
        {selected && (
          <View style={adCardStyles.checkIconContainer}>
            <CheckCircle color={COLORS.primary} size={30} />
          </View>
        )}
      </View>

      {/* Details */}
      <View style={adCardStyles.detailsContainer}>
        <Text
          numberOfLines={1}
          style={[
            adCardStyles.title,
            { color: selected ? COLORS.primary : COLORS.black }
          ]}
        >
          {title || 'Mag Arena - 20% Off'}
        </Text>
      </View>

      {/* Ticket style cutouts */}
      <Text style={adCardStyles.dashedLine} ellipsizeMode="clip" numberOfLines={1}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      </Text>
      <View style={adCardStyles.cutoutLeft} />
      <View style={adCardStyles.cutoutRight} />
    </LinearGradient>
  </Animated.View>
</TouchableWithoutFeedback>

    );
};

export const adCardStyles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: COLORS.white2,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    gradientBg: {
  flex: 1,
  borderRadius: 12,
  paddingBottom: 12,
  // add inner padding so gradient flows well
},
    imageContainer: {
        position: 'relative',
        padding: 12,
        height: 200,
        width: '100%',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        backgroundColor: COLORS.gray2,
        borderRadius: 10,
        aspectRatio: 1,
        objectFit: 'cover',
    },
    checkIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 5,
    },
    detailsContainer: {
        padding: 10,
        marginTop: -15,
    },
    title: {
        fontFamily: FONT.medium,
        fontSize: SIZES.small,
        textAlign: 'center',
    },
    dashedLine: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? '70%' : '74%',
        marginTop: -1,
        width: '100%',
        fontWeight: 'semibold',
        left: 20,
        fontSize: 20,
        opacity: 0.5,
        color: COLORS.gray,
    },
    cutoutLeft: {
        position: 'absolute',
        left: -20,
        top: Platform.OS === 'ios' ? '75%' : '80%',
        marginTop: -20,
        width: 40,
        height: 40,
        backgroundColor: COLORS.white,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    cutoutRight: {
        position: 'absolute',
        right: -20,
        top: Platform.OS === 'ios' ? '75%' : '80%',
        marginTop: -20,
        width: 40,
        height: 40,
        backgroundColor: COLORS.white,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
});

export default CategoriesCard;
