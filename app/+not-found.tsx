import { Animated, Image, Platform, StatusBar, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
// import { Text } from "react-native";
import { View, Text } from '@/components/Themed';
import DrawerSceneWrapper from '@/components/drawerScreenWrapper';
import { COLORS, FONT } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack, useNavigation } from 'expo-router';


export default function NotFoundScreen() {

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
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Not Found",
      headerBackTitleVisible: true,
      headerBackTitle: 'Back',
      // gestureEnabled: true,
      // fullScreenGestureEnabled: true,
      headerStyle: {
        backgroundColor: COLORS.tabWhite,
        shadowColor: 'transparent',
        elevation: 0
      },
      animation: Platform.OS === 'ios' ? 'fade' : 'default',
      animationTypeForReplace: Platform.OS === 'ios' ? 'fade' : 'default',
      customAnimationOnGesture: true,
      headerTintColor: COLORS.primary,
      headerTransparent: true,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },

    });

  }
    , [navigation]);
  return (
    <View style={styles.container}>
      <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: "Not Found",
        headerBackTitleVisible: true,
        headerBackTitle: 'Back',
        animation: 'fade',
      }}
      />
     
      <Animated.Image source={require('@/assets/images/notFound.png')} style={{ width: 175, height: 175, transform: [{ scale: scaleValue }], objectFit: 'contain' }} />
      <Text style={styles.title}>Page Not Found!</Text>
      <Text style={{ color: COLORS.gray, fontFamily: FONT.medium }}>The page you are looking for does not exist</Text>
      <View style={{ marginTop: 20, backgroundColor: COLORS.tabWhite }}>
        {router.canGoBack() ? <Button label="Go Back" variant="default" onPress={() => navigation.goBack()} /> : <Button label="Go to Home" variant="default" onPress={() => router.replace("/")} />}
      </View>
      <StatusBar animated={true} barStyle="dark-content" backgroundColor={COLORS.tabWhite} />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tabWhite
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
