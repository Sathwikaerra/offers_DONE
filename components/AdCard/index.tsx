import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';

type AdCardProps = {
  id: string;
  title: string;
  expiry: string;
  location: string;
  image: string;
  fullWidth?: boolean;
};

const AdCard: React.FC<AdCardProps> = ({ title, expiry, location, image, fullWidth }) => {
  return (
    <TouchableOpacity
      style={[styles.card, fullWidth && { width: '100%' }]}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>Expires: {expiry}</Text>
        <Text style={styles.meta}>📍 {location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    overflow: 'hidden',
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: SIZES.small,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
    marginBottom: 4,
  },
  meta: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});

export default AdCard;
