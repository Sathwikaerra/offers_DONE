import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AUTH_TYPES, BACKEND_URL, COLORS, FONT, SHADOWS, SIZES } from '../../constants/theme'
import { Button } from '../ui/Button'
import tw from 'tailwind-react-native-classnames'
import { router } from 'expo-router'
import Input from '../ui/Input'
import axios from 'axios'
import { postData } from '@/lib/axiosUtility'
// import axios from 'axios'
// import { useAuth } from '../context/AuthContext'
// import { Backend_Url } from '../constants'
// import { set } from 'date-fns'

const RegiserWithEmail = () => { 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [mobile, setMobile] = useState('')
    const [fullname, setFullname] = useState('');
    const [loading, setLoading] = useState(false);
    // const registeredEmail = 'kingarsh175@gmail.com'; //dummy email for login
    // const registeredPassword = '123456'; //dummy password 



    const handlesubmit = async () => {

        setError(false);
        setErrorMessage('');
        setLoading(true);
        //add submit logic here
        if (email.length > 4 && !email.includes('@')) {
            setError(true);
            setErrorMessage('Invalid email address');
        }
        else {

            try {
                
                const response = await axios.post(`${BACKEND_URL}/auth/v1/send-register-otp`, {
                    email: email.toLowerCase(),
                })

                

                if (response.data.ok === true) {
                    router.push(`/auth/otpVerificationScreen/${email + " " + 'registerType'}`)
                    setLoading(false);
                }

            } catch (error:any) {
                console.log(error.response.data.msg)
                setError(true);
                setErrorMessage(error.response.data.msg);
                setLoading(false);
            }


        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white2 }}>
            {AUTH_TYPES.EMAIL_WITH_OTP === false ?
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <View style={{ margin: SIZES.small, gap: 8, justifyContent: 'center' }}>
                        <Input
                            label={true}
                            labelTitle="Enter Your Full Name"
                            value={email}
                            onTextChange={(text) => setEmail(text)}
                            placeholder="eg. example@gmail.com" type="email" />
                        <Input
                            label={true}
                            labelTitle="Enter Your Email Address"
                            value={email}
                            onTextChange={(text) => setEmail(text)}
                            placeholder="eg. example@gmail.com" type="email" />
                       

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <TouchableOpacity>
                                <Text style={[tw`text-sm mx-1`, { fontFamily: FONT.medium, color: COLORS.primary }]}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <Button label='login' onPress={handlesubmit} disabled={email.length < 1} variant="white" >Login</Button>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[tw`text-sm`, { fontFamily: FONT.medium, color: COLORS.gray }]}>Don't have an account?</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/auth/registerScreen')}

                        >
                            <Text style={[tw`text-sm mx-1`, { fontFamily: FONT.medium, color: COLORS.primary }]}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    {AUTH_TYPES.GOOGLE_PROVIDER &&
                        <>
                            <View style={[tw`my-4 mx-6`, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>
                                <View style={[tw`flex-1`, { height: 1, backgroundColor: COLORS.gray2, opacity: 0.8 }]}></View>
                                <Text style={[tw`text-center my-2 mx-3`, { fontFamily: FONT.medium, color: COLORS.gray }]}> OR </Text>
                                <View style={[tw`flex-1`, { height: 1, backgroundColor: COLORS.gray2, opacity: 0.8 }]}></View>
                            </View>
                            <View style={[tw`flex-row justify-center items-center`, { gap: 10 }]}>
                                <TouchableOpacity style={[tw`flex-row p-2 rounded-xl flex-1 mx-6 justify-center items-center`, { borderWidth: 1, backgroundColor: COLORS.white2, gap: 6, borderColor: COLORS.gray2 }, SHADOWS.small]}>
                                    {/* <Image source={require('../assets/GoogleLogo.png')} style={{ width: 20, height: 20 }} /> */}
                                    <Text style={[tw`text-center my-2`, { fontFamily: FONT.semiBold, color: COLORS.tertiary }]}>Login With Google</Text>
                                </TouchableOpacity>
                            </View>
                        </>}

                </KeyboardAvoidingView> :
                <KeyboardAvoidingView behavior="padding" >
               {  loading ? <View style={{ margin: SIZES.small, gap: 6, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
                 :
               
               <View style={{ margin: SIZES.small, gap: 6, justifyContent: 'center' }}>
                    
                        <Input
                            label={true}
                            labelTitle="Enter Your Email Address"
                            value={email}
                            onTextChange={(text) => setEmail(text)}
                            setInputError={error}
                            setInputErrorMessage={errorMessage}
                            placeholder="eg. example@gmail.com" type="email" />

                        <Button label='Continue with Email' onPress={handlesubmit} disabled={email.length < 1 || loading} variant="default" >Continue with Email</Button>
                    </View>}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[tw`text-sm`, { fontFamily: FONT.medium, color: COLORS.gray }]}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/auth/loginScreen')}

                        >
                            <Text style={[tw`text-sm mx-1`, { fontFamily: FONT.medium, color: COLORS.primary }]}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    {AUTH_TYPES.GOOGLE_PROVIDER &&
                        <>
                            <View style={[tw`my-4 mx-6`, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>
                                <View style={[tw`flex-1`, { height: 1, backgroundColor: COLORS.gray2, opacity: 0.8 }]}></View>
                                <Text style={[tw`text-center my-2 mx-3`, { fontFamily: FONT.medium, color: COLORS.gray }]}> OR </Text>
                                <View style={[tw`flex-1`, { height: 1, backgroundColor: COLORS.gray2, opacity: 0.8 }]}></View>
                            </View>
                            <View style={[tw`flex-row justify-center items-center`, { gap: 10 }]}>
                                <TouchableOpacity style={[tw`flex-row p-2 rounded-xl flex-1 mx-6 justify-center items-center`, { borderWidth: 1, backgroundColor: COLORS.white2, gap: 6, borderColor: COLORS.gray2 }, SHADOWS.small]}>
                                    {/* <Image source={require('../assets/GoogleLogo.png')} style={{ width: 20, height: 20 }} /> */}
                                    <Text style={[tw`text-center my-2`, { fontFamily: FONT.semiBold, color: COLORS.tertiary }]}>Login With Google</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    }
                </KeyboardAvoidingView>

            }
        </SafeAreaView>

    )
}

export default RegiserWithEmail