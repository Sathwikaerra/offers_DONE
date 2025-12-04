import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AUTH_TYPES, BACKEND_URL, COLORS, FONT, SHADOWS, SIZES } from '../../constants/theme'
import { Button } from '../ui/Button'
import Input from '../ui/Input'
import tw from 'tailwind-react-native-classnames'
import { router } from 'expo-router'
import axios from 'axios'


 
const LoginWithEmail = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);



    const handlesubmit = async () => {
        setError(false);
        setErrorMessage('');
        if (email.length < 4) {
            setError(true);
            setErrorMessage('Email is too short');
        }
        else if (email.length > 4 && !email.includes('@')) {
            setError(true);
            setErrorMessage('Invalid email address');
        } 
        setLoading(true);
        try {
            // Add submit logic here
              
           


              console.log(email)

                const res = await axios.post(`${BACKEND_URL}/auth/v1/user-email-login`,{email}) as any;
                
        
                if (res.status == 200) {

                setLoading(false);
                router.push(`/auth/otpVerificationScreen/${email}`);
               }
                else {
                    setError(true);
                    setErrorMessage(res.data.msg);
                    setLoading(false);
                }
               



            // Handle the response or perform any actions based on the response

            // Reset error state
            // setError(false);
            // setErrorMessage('');


            // Alert or navigate to the next screen
            // alert('Login successful');
            // router.push('/register-screen');

        } catch (error: any) {
            console.log(error.response.data);
            setError(true);
            setErrorMessage(error.response.data.msg);
            setLoading(false);
            // console.error('Error:', error);

            // Handle error, update UI, show error message, etc.
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}>
           
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <View style={{ margin: SIZES.small, gap: 8, justifyContent: 'center' }}>
                        {loading ? <View style={{ height: 100, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text>
                                Requesting OTP!...
                            </Text>
                        </View>
                            : <Input
                                label={true}
                                labelTitle="Enter Your Email Address"
                                value={email}
                                setInputError={error}
                                setInputErrorMessage={errorMessage}
                                onTextChange={(text) => setEmail(text)}
                                placeholder="eg. example@gmail.com" type="email" />}

                        <Button label='Continue with Email' onPress={() => handlesubmit()} disabled={email.length < 1} variant="default" >Continue with Email</Button>
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

export default LoginWithEmail