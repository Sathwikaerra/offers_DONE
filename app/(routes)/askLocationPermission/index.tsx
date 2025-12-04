import { Platform, StatusBar, StyleSheet, View, Alert } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Import Expo Location
import * as IntentLauncher from 'expo-intent-launcher'; // Import for redirecting to settings on Android
import { COLORS, FONT } from '@/constants/theme';
import EmptyStateComponent from '@/components/emptyStateComponent';
import { Button } from '@/components/ui/Button';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

const index = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Enable Location",
            headerBackTitleVisible: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.tabWhite,
                shadowColor: 'transparent',
                elevation: 0,
            },
            animation: Platform.OS === 'ios' ? 'fade' : 'default',
            animationDuration: Platform.OS === "android" ? undefined : 200,
            customAnimationOnGesture: true,
            headerTintColor: COLORS.primary,
            headerTransparent: true,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.tabWhite, true);

            return () => {
                // Cleanup (if needed)
            };
        }, [])
    );

    const openAppSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:'); // Redirect to iOS app settings
        } else {
            IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
                data: `package:${Application.applicationId}`, // Redirect to Android app settings
            });
        }
    };

const handleEnableLocation = async () => {
  // Always check current status
  let { status } = await Location.getForegroundPermissionsAsync();

  if (status !== 'granted') {
    // Ask permission
    let { status: requestStatus } = await Location.requestForegroundPermissionsAsync();
    status = requestStatus;
  }

  if (status === 'granted') {
    // Permission granted → fetch location
    let location = await Location.getCurrentPositionAsync({});
    console.log("User location:", location);
    router.replace('/'); // Navigate after success
  } else {
    // Permission denied or blocked → tell user to go to settings
    Alert.alert(
      "Location Permission Required",
      "We need your location to show nearby offers. Please enable it in Settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Go to Settings", onPress: openAppSettings }
      ]
    );
  }
};


    const [status, requestPermission] = Location.useForegroundPermissions();
    useFocusEffect(
        React.useCallback(() => {
            if (status?.granted === true) {
                router.replace('/');
            }
            return () => {
                // Optional cleanup for status bar (if needed)
            };
        }, [status])
    );

    return (
        <View style={styles.container}>
           
            <EmptyStateComponent
                img={require('@/assets/images/noLocationPermission.png')}
                title="We need your location!"
                subTitle={"We require your location to provide you with \nthe best offers near you"}
            />
            <View style={{ padding: 20, paddingBottom: Platform.OS === 'ios' ? 60 : 40 }}>
                <Button label="Continue" variant={"default"} onPress={handleEnableLocation} />
            </View>
        </View>
    );
};

export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tabWhite,
    },
});
