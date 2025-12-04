import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AUTH_TYPES, BACKEND_URL, COLORS, FONT, SHADOWS, SIZES } from '@/constants/theme'
import tw from 'tailwind-react-native-classnames'
import { router } from 'expo-router'
import Input from '../ui/Input'
import { Button } from '../ui/Button'
import axios from 'axios'


const RegisterWithMobile = () => {
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState(false);
    const [fullname, setFullname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        //set errors upon typing ends
        if (mobile.length > 10) {
            setError(true);
            setErrorMessage('Mobile number must be 10 digits');
        } else {
            setError(false);
            setErrorMessage('');
        }
    }, [mobile]);

    const handlesubmit = async () => {
        try {
            //add submit logic here
            // signup firebase mobile otp logic

            const mobileNumber = mobile;
            if (mobileNumber.length < 10) {
                setError(true);
                setErrorMessage('Mobile number must be 10 digits');

            } else {
             try {
             
                const res = await axios.post(`/auth/v1/send-register-otp`, { mobileNumber: mobileNumber
                    
                }).then(res =>  res.data) as any
                
                if (res.ok === true) {
                    router.push(`/auth/otpVerificationScreen/${mobileNumber + " " + 'registerType'}`)
                }
               
             } catch (error:any) {
                setLoading(false)
                setError(true)
                setErrorMessage(error.response.data.msg)
                console.log("error", error)
             }

            }
        } catch (error) {

        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', width:'100%' }}>
            <View style={{ margin: SIZES.small, gap: 6, justifyContent: 'center' }}>
               
                <Input
                    label={true}
                 
                    labelTitle="Enter Your Mobile Number"
                    value={mobile}
                    description={""}

                    onTextChange={(text: React.SetStateAction<string>) => setMobile(text)}
                    setInputError={error}
                    setInputErrorMessage={errorMessage}
                    placeholder="eg. 99999 99999" type="phone" />
                <Button label="Request OTP" disabled={mobile.length != 10}
                    onPress={handlesubmit} variant="default" >Request OTP</Button>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[tw`text-sm`, { fontFamily: FONT.medium, color: COLORS.gray }]}>Already have an account?</Text>
                <TouchableOpacity
                    onPress={() => router.push('/auth/loginScreen')}

                >
                    <Text style={[tw`text-sm mx-1`, { fontFamily: FONT.medium, color: COLORS.primary }]}>Login</Text>
                </TouchableOpacity>
            </View>
            {AUTH_TYPES.GOOGLE_PROVIDER === true &&
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
        </SafeAreaView>
    )
}

export default RegisterWithMobile