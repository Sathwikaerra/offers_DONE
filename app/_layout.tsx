import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider, useNavigation } from '@react-navigation/native';
import {
  useFonts,
} from '@expo-google-fonts/inter';
import { Redirect, Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../globals.css"
import React from 'react';
import { create } from 'tailwind-react-native-classnames';
import { Platform, StatusBar, Text, View } from 'react-native';
import Splash from '@/components/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { SessionProvider } from '@/provider/ctx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'auth/landingScreen',
  // Configure deeplinking for the domain zephyrapps.in
  linking: {
    prefixes: ['https://offersholic.zephyrapps.in', 'offersholic.zephyrapps.in://', 'offersholic://'],
    config: {
      screens: {
        Home: 'home',
        Profile: 'profile',
        Settings: 'settings',
      },
    },


  },
  
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [isSignedIn, setIsSignedIn] = React.useState() as any
  // const [loading, setLoading] = React.useState(true)

  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Lexend-Thin': require('../assets/fonts/Lexend/Lexend-Thin.ttf'),
    'Lexend-ExtraLight': require('../assets/fonts/Lexend/Lexend-ExtraLight.ttf'),
    'Lexend-Light': require('../assets/fonts/Lexend/Lexend-Light.ttf'),
    'Lexend-Regular': require('../assets/fonts/Lexend/Lexend-Regular.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend/Lexend-Medium.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend/Lexend-SemiBold.ttf'),
    'Lexend-ExtraBold': require('../assets/fonts/Lexend/Lexend-ExtraBold.ttf'),
    'Lexend-Bold': require('../assets/fonts/Lexend/Lexend-Bold.ttf'),
    ...FontAwesome.font,
  });

//   const getToken = async () => {
//   const token = await AsyncStorage.getItem('token')
//   if (token !== null) {
//     setIsSignedIn(true)
//   }
//   else {
//     setIsSignedIn(false)
//   }
  
//   return token
// }


// useEffect(() => {
// getToken()
// setLoading(false)
//   // if (isSignedIn !== null) {
//   //   setLoading(false)
//   // }
//   // else {
//   //   setLoading(true)
//   // }
// } ,[isSignedIn, loading])
//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
      
      return  <Splash />
  }

  return (
    <SafeAreaProvider>

    <GestureHandlerRootView style={{ flex: 1 }}>
    <SessionProvider>
    <MenuProvider>

      <Stack
      
      screenOptions={
        {
          headerShown: false,
          headerBackVisible: true,
          headerBackTitle: 'Back',
          // animationDuration: 200,
          animation: Platform.OS === 'android' ? 'none' : 'default',
        }
      }
      
      />
      </MenuProvider>
    </SessionProvider>
      </GestureHandlerRootView>
      </SafeAreaProvider>
  );


}

