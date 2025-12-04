// import { View, TouchableOpacity, Text, ScrollView, Platform } from 'react-native'
// import React, { useCallback, useMemo, useRef } from 'react'
// import { Stack, useNavigation } from 'expo-router'
// import { APP_NAME, AUTH_TYPES, COLORS, FONT, SHADOWS, SIZES } from '../../constants/theme'
// import tw from 'tailwind-react-native-classnames'
// import * as Haptics from 'expo-haptics';
// import RegisterWithEmail from '@/components/RegisterScreen/RegisterWithEmail'
// import RegisterWithMobile from '@/components/RegisterScreen/RegisterWithMobile'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { Button } from '@/components/ui/Button'
// import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
// import { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
// import { BottomSheetComponent } from '@/components/bottomSheetComponent'
// import { termsOfServiceContent } from '@/constants'

// const RegisterScreen = () => {
//     const navigation = useNavigation()
//     const [activeTab, setActiveTab] = React.useState('Email')

//     const snapPoints = useMemo(() => ['40%', '50%', '100%'], []);
//     const bottomSheetRef = useRef<BottomSheet>(null);
//     const handleClosePress = () => bottomSheetRef.current?.close();
//     const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
//     const renderBackdrop = useCallback(
//         (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
//         []
//     );

//     const hapticFeedback = (type: string) => {
//         if (type == 'success') {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//         }
//         else if (type == 'error') {
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
//         }
//         else if (type == 'warning') {
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
//         }
//         else if (type == 'selection') {
//             Haptics.selectionAsync();
//         }
//         else if (type == 'heavy') {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
//         }
//         else if (type == 'medium') {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//         }
//         else {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//         }
//     };



//     return (
//         <>
//             <Stack.Screen options={
//                 {
//                     headerShown: true,
//                     headerTitle: Platform.OS == 'ios' ? APP_NAME : APP_NAME,
//                     headerLargeTitle: false,
//                     headerStyle: {
//                         backgroundColor: COLORS.white2
//                     },
//                     headerLargeStyle: {
//                         backgroundColor: COLORS.white2
//                     },
//                     headerTitleAlign: 'center',
//                     headerTitleStyle: {
//                         fontFamily: FONT.semiBold,
//                         fontSize: Platform.OS === 'ios' ? SIZES.medium : SIZES.large,
//                         color: COLORS.tertiary
//                     },
//                     headerBackTitleVisible: false,
//                     headerLargeTitleStyle: {
//                         fontFamily: FONT.bold,
//                         fontSize: SIZES.xLarge,
//                         color: COLORS.tertiary
//                     },
//                     headerTintColor: COLORS.tertiary,
//                     headerShadowVisible: false,
//                     headerBackVisible: true,
//                     gestureEnabled: false,
//                     animationDuration: Platform.OS === "android" ? undefined : 200,
//                 }
//             }
//             />


//             <SafeAreaView style={tw` bg-white h-full`}>

//                 <View style={tw`pt-4`}>
//                     <Text style={[tw`text-left  mx-4`, { fontFamily: FONT.bold, fontSize: Platform.OS === 'ios' ? SIZES.xxLarge : SIZES.xLarge }]}>
//                         Create Account
//                     </Text>
//                     {AUTH_TYPES.MOBILE && AUTH_TYPES.EMAIL && <Text style={[tw`text-left mx-4 my-1`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.medium }]}>
//                         {activeTab == 'Mobile' ? 'Register via Mobile' : 'Register via Email'}
//                     </Text>}

//                     {AUTH_TYPES.MOBILE && !AUTH_TYPES.EMAIL && <Text style={[tw`text-left mx-4 my-1`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.medium }]}>
//                         Register via Mobile
//                     </Text>}

//                     {!AUTH_TYPES.MOBILE && AUTH_TYPES.EMAIL && <Text style={[tw`text-left mx-4 my-1`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.medium }]}>
//                         Register via Mobile
//                     </Text>}
//                 </View>

//                 {AUTH_TYPES.MOBILE && AUTH_TYPES.EMAIL &&
//                     <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//                         <View style={{ flexDirection: 'row', width: '92%', gap: 10, padding: 10, borderRadius: 20, backgroundColor: COLORS.white, margin: 20, justifyContent: 'center', alignItems: 'center' }}>
//                             <View style={{ flexDirection: 'row', width: '48%', justifyContent: 'center', alignItems: 'center' }}>
//                                 <Button
//                                     label="Email"
//                                     onPress={() => {
//                                         setActiveTab('Email')
//                                         hapticFeedback('selection')
//                                     }}
//                                     variant={activeTab === 'Email' ? 'default' : 'white'}
//                                 />
//                             </View>
//                             <View style={{ flexDirection: 'row', width: '48%', justifyContent: 'center', alignItems: 'center' }}>
//                                 <Button
//                                     label="Mobile"
//                                     onPress={() => {
//                                         setActiveTab('Mobile')
//                                         hapticFeedback('selection')
//                                     }}
//                                     variant={activeTab === 'Mobile' ? 'default' : 'white'}
//                                 />
//                             </View>


//                         </View>

//                         <View style={{ width: '100%', paddingHorizontal: 20, flex: 1 }}>
//                             {activeTab === 'Mobile' ? <RegisterWithMobile /> : <RegisterWithEmail />}
//                         </View>
//                     </View>
//                 }

//                 {AUTH_TYPES.MOBILE && !AUTH_TYPES.EMAIL &&
//                     <RegisterWithMobile />
//                 }

//                 {!AUTH_TYPES.MOBILE && AUTH_TYPES.EMAIL &&
//                     <RegisterWithEmail />
//                 }

//                 {/* by clicking continue you agree to our terms and conditions */}
//                 <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//                     <Text style={[tw`text-center`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.small }]}>
//                         By continuing, you agree to our
//                     </Text>
//                     <TouchableOpacity
//                         onPress={() => {
//                             hapticFeedback('selection')
//                             snapToIndex(0)
//                         }
//                         }
//                     >
//                         <Text style={[tw`text-center`, { fontFamily: FONT.medium, color: COLORS.primary, fontSize: SIZES.small }]}>
//                             Terms and Conditions
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//                 <BottomSheetComponent
//   title="Terms and Conditions"
//   bottomSheetRef={bottomSheetRef}
//   snapPoints={snapPoints}
//   handleClosePress={handleClosePress}
// >
 
//     <ScrollView
//       contentContainerStyle={{ padding: 20 }}
//       showsVerticalScrollIndicator={true}
//     >
//       <Text style={[tw`text-left`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.small }]}>
//         {termsOfServiceContent}
//       </Text>
//     </ScrollView>
 
// </BottomSheetComponent>

//             </SafeAreaView>
//         </>

//     )
// }

// export default RegisterScreen

import { View, TouchableOpacity, Text, ScrollView, Platform } from 'react-native'
import React, { useCallback, useMemo, useRef } from 'react'
import { Stack } from 'expo-router'
import { APP_NAME, COLORS, FONT, SIZES } from '../../constants/theme'
import tw from 'tailwind-react-native-classnames'
import * as Haptics from 'expo-haptics';
import RegisterWithEmail from '@/components/RegisterScreen/RegisterWithEmail'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BottomSheetComponent } from '@/components/bottomSheetComponent'
import { termsOfServiceContent } from '@/constants'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';

const RegisterScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '50%', '100%'], []);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: APP_NAME,
          headerStyle: { backgroundColor: COLORS.white2 },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: FONT.semiBold,
            fontSize: Platform.OS === 'ios' ? SIZES.medium : SIZES.large,
            color: COLORS.tertiary,
          },
          headerTintColor: COLORS.tertiary,
          headerShadowVisible: false,
          gestureEnabled: false,
          animationDuration: Platform.OS === 'android' ? undefined : 200,
        }}
      />

      <SafeAreaView style={tw`bg-white h-full`}>
        <View style={tw`pt-4`}>
          <Text
            style={[
              tw`text-left mx-4`,
              { fontFamily: FONT.bold, fontSize: Platform.OS === 'ios' ? SIZES.xxLarge : SIZES.xLarge },
            ]}
          >
            Create Account
          </Text>
          <Text
            style={[
              tw`text-left mx-4 my-1`,
              { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.medium },
            ]}
          >
            Register via Email
          </Text>
        </View>

        {/* 👉 Directly render Email registration form */}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <RegisterWithEmail />
        </View>

        {/* Terms and Conditions */}
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={[tw`text-center`, { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.small }]}>
            By continuing, you agree to our
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              snapToIndex(0);
            }}
          >
            <Text style={[tw`text-center`, { fontFamily: FONT.medium, color: COLORS.primary, fontSize: SIZES.small }]}>
              Terms and Conditions
            </Text>
          </TouchableOpacity>
        </View>

        <BottomSheetComponent
          title="Terms and Conditions"
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          handleClosePress={handleClosePress}
        >
          <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={true}>
            <Text
              style={[
                tw`text-left`,
                { fontFamily: FONT.medium, color: COLORS.gray, fontSize: SIZES.small },
              ]}
            >
              {termsOfServiceContent}
            </Text>
          </ScrollView>
        </BottomSheetComponent>
      </SafeAreaView>
    </>
  );
};

export default RegisterScreen;
