import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { Map } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { DrawerToggleButton } from '@react-navigation/drawer';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';

interface HeaderProps {
  pressed: () => void;
  User?: any;
  addressLine?: string;
}

function Header({ pressed, addressLine }: HeaderProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [status] = Location.useForegroundPermissions();

  useEffect(() => {
    if (status?.granted === false) {
      setAddress('Location permission not granted.');
      return;
    }
    if (status?.granted === true) {
      getLocation();
    }
  }, [status]);

  const getLocation = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const addressArray = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addressArray && addressArray.length > 0) {
        const { city, region, district, isoCountryCode, formattedAddress } = addressArray[0];
        setAddress(
          formattedAddress
            ? formattedAddress
            : `${district ?? ''}, ${city ?? ''}, ${region ?? ''}, ${isoCountryCode ?? ''}`
        );
      } else {
        setAddress('Unable to determine address.');
      }
    } catch (err) {
      setAddress('Error fetching location.');
    }
  };

  return (
    <SafeAreaView
      style={[
        tw`flex-col`,
        {
          backgroundColor: COLORS.primary,
          borderBottomWidth: 0.2,
          borderBottomColor: COLORS.gray2,
          marginTop: Platform.OS === 'android' ? 40 : 0,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        },
      ]}
    >
      <View style={[tw`flex-row justify-between items-center`, { height: 70, paddingHorizontal: 14 }]}>
        {/* Drawer Menu Button */}
        <TouchableOpacity style={tw`flex-row items-center`}>
          <DrawerToggleButton tintColor={COLORS.white} />
        </TouchableOpacity>

        {/* Location Display */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pressed}
          style={[tw`flex-row items-center justify-center`]}
        >
          <View style={tw`flex-col items-center`}>
            <Text
              style={{
                fontSize: SIZES.small,
                fontFamily: FONT.medium,
                letterSpacing: 0.01,
                color: COLORS.white,
                textAlign: 'center',
              }}
            >
              {addressLine ? 'Location' : 'Current Location'}
            </Text>
            {addressLine ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: SIZES.medium - 4,
                  width: 200,
                  fontFamily: FONT.semiBold,
                  color: COLORS.white,
                  textAlign: 'center',
                }}
              >
                {addressLine}
              </Text>
            ) : address ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: SIZES.medium - 4,
                  width: 200,
                  fontFamily: FONT.semiBold,
                  color: COLORS.white,
                  textAlign: 'center',
                }}
              >
                {address}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: FONT.semiBold,
                  color: COLORS.white,
                  textAlign: 'center',
                }}
              >
                Fetching address...
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Map Icon Button */}
        <TouchableOpacity
          onPress={() => router.push('/(routes)/addressBook')}
          style={[tw`flex-row items-center p-1`, { backgroundColor: COLORS.primary }]}
        >
          <Map style={[tw`w-6 h-6`, { color: COLORS.white }]} />
        </TouchableOpacity>
      </View>

      <ExpoStatusBar style="light" backgroundColor={COLORS.primary} />
    </SafeAreaView>
  );
}

export default Header;
