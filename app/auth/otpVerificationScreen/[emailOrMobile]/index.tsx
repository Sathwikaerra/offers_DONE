// import { Button } from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import OtpInput from '@/components/ui/otpinput';
// import { BACKEND_URL, COLORS, FONT, SIZES } from '@/constants/theme';
// import { useSession } from '@/provider/ctx';
// import axios from 'axios';
// import { router, Stack, useLocalSearchParams } from 'expo-router';
// import { ChevronLeftIcon } from 'lucide-react-native';
// import React, { useState } from 'react'
// import { Alert, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// function Index() {
//     const params = useLocalSearchParams();

//     const [otp, setOtp] = useState('');
//     const { signIn } = useSession();
//     const [loading, setLoading] = useState(false)
//     const [fullname, setFullname] = useState('');
//     const type = params.emailOrMobile.includes('registerType') ? 'register' : 'login'
//     const emailOrMobile = params.emailOrMobile.split(' ')[0]
//     const [askName, setAskName] = useState(type === 'register' ? true : false)
//     const [error, setError] = useState(false);
//     const [errorMessage, setErrorMessage] = useState(false);
//     const [hideOtp, setHideOtp] = useState(false)


//     const verifyOTP = async () => {
//         try {
//             setLoading(true)
//             if (params.emailOrMobile.includes('@')) {


//                 if (type == 'register') {

//                     const res = await axios.post(`${BACKEND_URL}/auth/v1/register`, { email: emailOrMobile, otp: otp }).then(res => res.data) as any
//                     console.log(res)
//                     if (res?.ok == true) {
//                         router.push(`/auth/askNameScreen/${res.token}`)

//                     }
//                 }
//                 else {
//                     const res = await axios.post(`${BACKEND_URL}/auth/v1/verify-otp`, { email: emailOrMobile, otp: otp }).then(res => res.data) as any

//                     if (res?.ok == true) {
//                         signIn(res.token)

//                         router.dismiss()
//                         router.replace('/')
//                     }
//                 }
//             }
//             else {
//                 if (type == 'register') {

//                     const res = await axios.post(`${BACKEND_URL}/auth/v1/register`, { mobileNo: emailOrMobile, otp: otp }).then(res => res.data) as any

//                     if (res?.ok == true) {
//                         router.push(`/auth/askNameScreen/${res.token}`)



//                     }
//                 }
//                 else {


//                     const res = await axios.post(`${BACKEND_URL}/auth/v1/verify-otp`, { mobileNo: emailOrMobile, otp: otp }).then(res => res.data) as any

//                     if (res?.ok == true) {
//                         //  await AsyncStorage.setItem('token', res.token)
//                         signIn(res.token)


//                         router.dismiss()
//                         router.replace('/')
//                     }
//                 }
//             }
//         } catch (error: any) {
//             console.error(error.response.data.msg)
//             Alert.alert('Error', error.response.data.msg)
//         }
//         finally {
//             setLoading(false)
//         }


//     }

//     const handleResendOTP = async () => {
//         try {

//             if (params.emailOrMobile.includes('@')) {
//                 const res = await axios.post(`${BACKEND_URL}/auth/v1/resend-otp`, { email: emailOrMobile }).then(res => res.data) as any
//                 if (res?.ok == true) {
//                     Alert.alert('Success', 'OTP has been sent successfully')
//                 }
//             }
//             else {
//                 const res = await axios.post(`${BACKEND_URL}/auth/v1/resend-otp`, { mobileNo: emailOrMobile }).then(res => res.data) as any
//                 if (res?.ok == true) {
//                     Alert.alert('Success', 'OTP has been sent successfully')
//                 }
//             }
//         } catch (error: any) {
//             console.error(error.response.data.msg)
//             Alert.alert('Error', error.response.data.msg)
//         }
//     }

//     return (
//         <>
//             {/* <StatusBar barStyle='dark-content' backgroundColor={COLORS.white} /> */}
//             <Stack.Screen
//                 options={{
//                     headerTitle: 'OTP Verification',
//                     headerTitleAlign: 'center',
//                     headerStyle: {
//                         backgroundColor: COLORS.white2
//                     },
//                     headerLargeStyle: {
//                         backgroundColor: COLORS.white
//                     },
//                     headerTitleStyle: {
//                         fontFamily: FONT.semiBold,
//                         fontSize: SIZES.medium,
//                         color: COLORS.tertiary
//                     },
//                     headerTintColor: COLORS.tertiary,
//                     headerShadowVisible: false,
//                     headerBackTitleVisible: false,
//                     headerLargeTitleShadowVisible: false,
//                     gestureEnabled: false,
//                     headerBackButtonMenuEnabled: false,
//                     headerLeft: () => {
//                         return (
//                             <View >
//                                 <TouchableOpacity onPress={() => {
//                                     Alert.alert(
//                                         "Are you sure? ",
//                                         "You will be redirected to login screen",
//                                         [
//                                             {
//                                                 text: "Cancel",
//                                                 style: "cancel"
//                                             },
//                                             { text: "OK", onPress: () => router.back() }
//                                         ],
//                                         { cancelable: true }
//                                     );
//                                 }}>
//                                     <ChevronLeftIcon width={24} height={24} color={COLORS.tertiary} />
//                                 </TouchableOpacity>
//                             </View>
//                         )

//                     },

//                 }}
//             />
//             <SafeAreaView style={{ flex: 1, margin: SIZES.medium, justifyContent: 'center', alignItems: 'center' }}>
//                 {/* <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={0} style={{ flex: 1 }}> */}

//                 <View style={{ flex: 1, flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'center' }}>

//                 {!hideOtp &&   <View >
//                         <View style={{ marginBottom: SIZES.xLarge }}>
//                             <Text style={{ fontFamily: FONT.semiBold, fontSize: SIZES.xLarge, color: COLORS.tertiary }}>Enter OTP</Text>
//                             <View style={{ marginTop: SIZES.xxSmall }}>
//                                 <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray }}>
//                                     A 6 digit OTP has been sent to
//                                 </Text>
//                                 <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray }}>
//                                     {emailOrMobile}
//                                 </Text>
//                             </View>

//                         </View>
//                         <View >
//                             <OtpInput
//                                 length={6}
//                                 value={otp}
//                                 onOtpChange={(text) => setOtp(text)} />
//                         </View>
//                         <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: SIZES.small }}>

//                             <Button label={loading ? 'Verifying...' : 'Verify'} disabled={otp.length != 6 ? true : false || loading} variant="default" onPress={
//                                 () => verifyOTP()
//                                 }>Verify</Button>
//                             <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: SIZES.small }}>
//                                 <Text style={{ fontFamily: FONT.medium, marginTop: SIZES.xxSmall, fontSize: SIZES.medium, color: COLORS.gray }}>Didn't receive the OTP?</Text>
//                                 <TouchableOpacity onPress={() => handleResendOTP()}>
//                                     <Text style={{ fontFamily: FONT.medium, marginTop: SIZES.xxSmall, fontSize: SIZES.medium, color: COLORS.tertiary }}>Resend OTP</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>

//                     </View>}
//                         {
//                            hideOtp && askName &&
//                             <View style={{ justifyContent: 'center', alignItems: 'left' ,gap: 8, marginTop: SIZES.small }}>
//                                 <Text style={{ fontFamily: FONT.semiBold, fontSize: SIZES.xLarge, color: COLORS.tertiary }}>Enter OTP</Text>

//                                 <Input
//                                     label={true}

//                                     labelTitle="Enter Your Full Name"
//                                     value={fullname}
//                                     description={""}

//                                     onTextChange={(text: React.SetStateAction<string>) => setFullname(text)}
//                                     setInputError={error}
//                                     setInputErrorMessage={errorMessage}
//                                     placeholder="eg. John Doe" type="name" />
//                             </View>

//                         }
//                 </View>
//                 {/* </KeyboardAvoidingView> */}

//             </SafeAreaView>
//         </>
//     )
// }

// export default Index


import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import OtpInput from '@/components/ui/otpinput';
import { BACKEND_URL, COLORS, FONT, SIZES } from '@/constants/theme';
import { useSession } from '@/provider/ctx';
import axios from 'axios';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ChevronLeftIcon } from 'lucide-react-native';
import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Index() {
  const params = useLocalSearchParams();
  const { signIn } = useSession();

  const [otp, setOtp] = useState('');
  const [mobile, setMobile] = useState('');
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hideOtp, setHideOtp] = useState(false);

  const type = params.emailOrMobile.includes('registerType') ? 'register' : 'login';
  const emailOrMobile = params.emailOrMobile.split(' ')[0];
  const [askName, setAskName] = useState(type === 'register');

  const verifyOTP = async () => {
    try {
      setLoading(true);

      if (params.emailOrMobile.includes('@')) {
        // ✅ Email-based
        if (type === 'register') {
          const res = await axios
            .post(`${BACKEND_URL}/auth/v1/register`, { 
              email: emailOrMobile, 
              otp, 
              mobileNo: mobile   // 👈 extra field for mobile
            })
            .then(res => res.data);

          if (res?.ok === true) {
            router.push(`/auth/askNameScreen/${res.token}`);
          }
        } else {
          const res = await axios
            .post(`${BACKEND_URL}/auth/v1/verify-otp`, { email: emailOrMobile, otp })
            .then(res => res.data);

          if (res?.ok === true) {
            signIn(res.token);
            router.dismiss();
            router.replace('/');
          }
        }
      } else {
        // ✅ Mobile-based
        if (type === 'register') {
          const res = await axios
            .post(`${BACKEND_URL}/auth/v1/register`, { 
              mobileNo: emailOrMobile, 
              otp 
            })
            .then(res => res.data);

          if (res?.ok === true) {
            router.push(`/auth/askNameScreen/${res.token}`);
          }
        } else {
          const res = await axios
            .post(`${BACKEND_URL}/auth/v1/verify-otp`, { mobileNo: emailOrMobile, otp })
            .then(res => res.data);

          if (res?.ok === true) {
            signIn(res.token);
            router.dismiss();
            router.replace('/');
          }
        }
      }
    } catch (error: any) {
      console.error(error.response?.data?.msg);
      Alert.alert('Error', error.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (params.emailOrMobile.includes('@')) {
        const res = await axios
          .post(`${BACKEND_URL}/auth/v1/resend-otp`, { email: emailOrMobile })
          .then(res => res.data);
        if (res?.ok === true) {
          Alert.alert('Success', 'OTP has been sent successfully');
        }
      } else {
        const res = await axios
          .post(`${BACKEND_URL}/auth/v1/resend-otp`, { mobileNo: emailOrMobile })
          .then(res => res.data);
        if (res?.ok === true) {
          Alert.alert('Success', 'OTP has been sent successfully');
        }
      }
    } catch (error: any) {
      console.error(error.response?.data?.msg);
      Alert.alert('Error', error.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'OTP Verification',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: COLORS.white2 },
          headerTitleStyle: {
            fontFamily: FONT.semiBold,
            fontSize: SIZES.medium,
            color: COLORS.tertiary,
          },
          headerTintColor: COLORS.tertiary,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          gestureEnabled: false,
          headerLeft: () => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Are you sure?',
                    'You will be redirected to login screen',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'OK', onPress: () => router.back() },
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <ChevronLeftIcon width={24} height={24} color={COLORS.tertiary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <SafeAreaView style={{ flex: 1, margin: SIZES.medium, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          {/* OTP Input */}
          {!hideOtp && (
            <View>
              <View style={{ marginBottom: SIZES.xLarge }}>
                <Text style={{ fontFamily: FONT.semiBold, fontSize: SIZES.xLarge, color: COLORS.tertiary }}>
                  Enter OTP
                </Text>
                <View style={{ marginTop: SIZES.xxSmall }}>
                  <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray }}>
                    A 6 digit OTP has been sent to
                  </Text>
                  <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray }}>
                    {emailOrMobile}
                  </Text>
                </View>
              </View>

              <OtpInput length={6} value={otp} onOtpChange={(text) => setOtp(text)} />

              {/* 👇 Add Mobile number input */}
              {
                type=="register" && <View style={{ marginTop: SIZES.medium }}>
                <Input
                  label
                  labelTitle="Enter Your Mobile Number"
                  value={mobile}
                  onTextChange={setMobile}
                  placeholder="eg. 9876543210"
                  type="numeric"
                />
              </View>

              }
              
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: SIZES.small }}>
                <Button
                  label={loading ? 'Verifying...' : 'Verify'}
                  disabled={otp.length !== 6 || loading}
                  variant="default"
                  onPress={verifyOTP}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: SIZES.small }}>
                  <Text
                    style={{
                      fontFamily: FONT.medium,
                      marginTop: SIZES.xxSmall,
                      fontSize: SIZES.medium,
                      color: COLORS.gray,
                    }}
                  >
                    Didn't receive the OTP?
                  </Text>
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text
                      style={{
                        fontFamily: FONT.medium,
                        marginTop: SIZES.xxSmall,
                        fontSize: SIZES.medium,
                        color: COLORS.tertiary,
                      }}
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Ask Name Step */}
          {hideOtp && askName && (
            <View style={{ justifyContent: 'center', alignItems: 'flex-start', gap: 8, marginTop: SIZES.small }}>
              <Text style={{ fontFamily: FONT.semiBold, fontSize: SIZES.xLarge, color: COLORS.tertiary }}>
                Enter Your Full Name
              </Text>

              <Input
                label
                labelTitle="Full Name"
                value={fullname}
                onTextChange={setFullname}
                setInputError={error}
                setInputErrorMessage={errorMessage}
                placeholder="eg. John Doe"
                type="name"
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

export default Index;
