import { FlatList, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import TopNavigation from '@/components/TopNavigation';
import Carousel from 'react-native-reanimated-carousel';
import { Button } from '@/components/ui/Button';

const index = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: true,
        headerTitle: 'Subscribe to a Plan',
        headerBackTitleVisible: true,
        headerLargeTitle: true,
        headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
        headerBackTitle: 'Back',
        headerStyle: {
            backgroundColor: COLORS.white,
            shadowColor: 'transparent',
            elevation: 0,
        },        
        headerTintColor: COLORS.primary,
        headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
        headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
        headerShadowVisible: false,
     
        customAnimationOnGesture: true,
        fullScreenGestureEnabled: true,
        animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'default',
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
}
, [navigation]);

useFocusEffect(
    React.useCallback(() => {
        // Set the status bar style for this screen
        StatusBar.setBarStyle('dark-content', true); // Adjust the style if needed
        Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white, true); // Adjust the background color if needed

        return () => {
            // Optional cleanup for status bar (if needed)
        };
    }, [])
);

const width = useWindowDimensions().width;
  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />
    {/* <SafeAreaView> */}
      {/* <TopNavigation backBtn={true} title="Subscription Plans" /> */}
      {/* <ScrollView> */}

      <View style={{ flex: 1,}}>
        {/* <Text>Subscription Plans</Text> */}
    
      <FlatList
        data={[...Array(5).keys()]}
        renderItem={({item, index}) => (
          <View style={{backgroundColor: 'white', width: 300, height:400, flexDirection: 'column', gap:4, padding: 20,margin:10, borderRadius: 20, shadowColor: 'black', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5}}>
            <View style={{flex:1}}>
            <Text style={{fontFamily: FONT.semiBold, fontSize: SIZES.large}}>Plan {item}</Text>
            <Text style={{fontFamily: FONT.regular}}>Description of the plan {item}</Text>
            <Text style={{fontFamily: FONT.bold}}>Price: $10/m</Text>
            </View>
           <View style={{marginTop: 20}}>
           {
            Platform.OS !== 'ios' ?
            <Button label="Subscribe" variant={"default"} onPress={() => {}} />
          : <Text style={{fontFamily: FONT.regular, fontSize: SIZES.xSmall}}>*You cannot subscribe to a plan on iOS, we know that's not ideal!*</Text>
          }
           </View>

          </View>
        )}
        horizontal
        // scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
        </View>
        {/* <Carousel 
          data={[...Array(5).keys()]}
          width={width}
          height={200}
          renderItem={({item, index}) => (
            <View style={{backgroundColor: 'white',  padding: 20, borderRadius: 20, shadowColor: 'black', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5}}>
              <Text>Plan {item}</Text>
            </View>
          )}
        /> */}

      {/* </ScrollView> */}
    </SafeAreaView>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})