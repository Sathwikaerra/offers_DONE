import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AUTH_TYPES, COLORS, FONT, SHADOWS, SIZES } from '../../constants/theme'
import tw from 'tailwind-react-native-classnames'
import Input from '../ui/Input'
import { router } from 'expo-router'
import { Button } from '../ui/Button'
import { postData } from '@/lib/axiosUtility'

const MobileLogin = () => {
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



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
        //add submit logic here
        if (mobile.length != 10) {
            setError(true);
            setErrorMessage('Mobile number must be 10 digits');

        } else {
            try {
                const res = await postData(`/auth/v1/user-mobile-login`, { mobileNumber: mobile })
              
                if (res.status == 200) {
                    router.push(`/auth/otpVerificationScreen/${mobile}`)
                } else {
                    setError(true);
                    setErrorMessage(res.data.msg);
                }
                router.push(`/auth/otpVerificationScreen/${mobile}`)
            } catch (error: any) {
                
                setError(true);
                setErrorMessage(error?.response?.data?.msg);
            }
        }

    }


    return (
        <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: 'transparent', }}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <View style={{ margin: SIZES.small, gap: 8, justifyContent: 'center' }}>
                    <Input
                        label={true}
                        disabled={false}
                        labelTitle="Enter Your Mobile Number"
                        value={mobile}
                        onTextChange={(text: any) => setMobile(text)}
                        setInputError={error}
                        setInputErrorMessage={errorMessage}
                        placeholder="eg. 99999 99999" type="phone" />
              
                    <Button label='Request OTP' disabled={mobile.length != 10}
                        onPress={handlesubmit} variant="default" >Request OTP</Button>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[tw`text-sm`, { fontFamily: FONT.medium, color: COLORS.gray }]}>Don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/auth/registerScreen')}
                    >
                        <Text style={[tw`text-sm mx-1`, { fontFamily: FONT.medium, color: COLORS.primary }]}>Register</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>




        </SafeAreaView>
    )
}

export default MobileLogin