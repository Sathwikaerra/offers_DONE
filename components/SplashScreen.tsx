import { APP_AUTHOR, APP_NAME, COLORS, FONT } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Linking, Platform, StatusBar, Text, View } from 'react-native';
import Constants from 'expo-constants'; // Import Constants to get the app version
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router, useRootNavigationState, useRouter } from 'expo-router';


function Splash() {
    // Create animation values
    const imageOpacity = useRef(new Animated.Value(0)).current; // For fade-in animation
    const imageTranslateY = useRef(new Animated.Value(20)).current; // For slide-up animation
    const breatheAnim = useRef(new Animated.Value(1)).current; // For the breathing animation

    const textOpacity = useRef(new Animated.Value(0)).current; // For text fade-in animation
    const textTranslateY = useRef(new Animated.Value(5)).current; // For text slide-up animation

    const [appVersion, setAppVersion] = useState('');
    const router = useRouter();
    const rootNavigationState = useRootNavigationState();

   
  useEffect(() => {
    const handleInitialDeepLink = async () => {
      // Get the initial URL that triggered the app to open
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleUrl({ url: initialUrl });
      }
    };

    handleInitialDeepLink();

    // Listen for future deep links
 Linking.addEventListener('url', handleUrl);


  }, []);


    const handleUrl = ({ url }: { url: string }) => {
        console.log('Received URL:', url); // Debugging URL received by handleUrl

        // Check if the URL contains 'offer' and extract the ID
        if (url.includes('offer/')) {
            const offerId = url.split('offer/')[1].split('?')[0]; // Split to avoid query params issues
            console.log('Navigating to offer with ID:', offerId); // Debugging extracted offer ID
          

            return router.push(`/ad/${offerId}`); // Navigate to the correct offer path

            
        } else if (url.includes('business/')) {
            const businessId = url.split('business/')[1].split('?')[0]; // Split to avoid query params issues
            console.log('Navigating to business with ID:', businessId); // Debugging extracted business ID
            return router.push(`/businessProfile/${businessId}`); // Navigate to the correct business path
        } else {
            console.warn('Unhandled URL path:', url); // Debugging any unhandled URL paths
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            // Set the status bar style for this screen
            StatusBar.setBarStyle('light-content', true);
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(COLORS.primary, true);
            }

            return () => {
                // Cleanup if necessary
            };
        }, [])
    );

  

    useEffect(() => {
        // Get the current app version from expo-constants
        setAppVersion(Constants.expoConfig?.version as string);

        // Fade and slide-up animation for the image
        Animated.parallel([
            Animated.timing(imageOpacity, {
                toValue: 1, // Fade in
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(imageTranslateY, {
                toValue: 0, // Slide up
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Breathing animation after initial pop
            Animated.loop(
                Animated.sequence([
                    Animated.timing(breatheAnim, {
                        toValue: 1.1, // Increase size
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(breatheAnim, {
                        toValue: 1, // Back to normal size
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });

        // Fade and slide-up animation for the text with a delay
        Animated.sequence([
            // Animated.delay(500), // Delay after the image animation
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1, // Fade in
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: 0, // Slide up
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [imageOpacity, imageTranslateY, breatheAnim, textOpacity, textTranslateY]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
            {/* Animated View for the pop and breathing effect */}
            <Animated.View
                style={{
                    opacity: imageOpacity, // Fade in effect
                    transform: [
                        { translateY: imageTranslateY }, // Slide up effect
                        { scale: breatheAnim }, // Breathing effect
                    ],
                }}
            >
                <Image source={require('@/assets/images/adaptive_icon.png')} style={{ width: 200, height: 200 }} />
            </Animated.View>
            <Animated.View
                style={{
                    opacity: textOpacity, // Fade in effect
                    transform: [
                        { translateY: textTranslateY }, // Slide up effect
                        // { scale: breatheAnim }, // Breathing effect
                    ],
                    position: 'absolute',
                    bottom: 80,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: COLORS.white, opacity: 0.5, fontSize: 12, textAlign: 'center', fontFamily: FONT.regular }}>
                    {`v${appVersion}`}
                </Text>
            </Animated.View>
        </View>
    );
}

export default Splash;
