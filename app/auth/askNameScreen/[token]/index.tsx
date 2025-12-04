import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import OtpInput from '@/components/ui/otpinput';
import { BACKEND_URL, COLORS, FONT, SIZES } from '@/constants/theme';
import { postData, putData } from '@/lib/axiosUtility';
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
    const [loading, setLoading] = useState(false)
    const [fullname, setFullname] = useState('');

    const token = params.token

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [hideOtp, setHideOtp] = useState(false)

    const updateName = async () => {
        setLoading(true)
        setError(false)
        try {
        const firstName = fullname.split(' ')[0]
        const middleName = fullname.split(' ')[1]
        const lastName = fullname.split(' ')[2]

        const data = JSON.stringify({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName
        })
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${BACKEND_URL}/user/v1/update/current`,
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            },
            data : data
          };
          
         const res = await axios.request(config).then(res => res.data)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            if (response?.ok == true) {
                setHideOtp(true)
                signIn(token)  
                router.dismiss()
                router.replace('/')
            }
          })
          .catch((error) => {
            console.log("err", error.response.data);
            setError(true)
            setErrorMessage(error.response.data.error)
          });

      
            // console.log(token)
            // const res = await axios.put(`${BACKEND_URL}/users/v1/update/current`, {
            //     firstName: firstName,
            // middleName: middleName,
            // lastName: lastName
            // } , {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
                    
            //       }
            // }).then(res => res.data) as any

           

        // await putData(`/user/v1/update/current'`, {
        //     firstName: firstName,
        //     middleName: middleName,
        //     lastName: lastName
        // }, {headers: {Authorization: `Bearer ${token}`}}).then(res => res.data).then(res => {
        //     console.log(res)
        //     if (res?.ok == true) {
        //         setHideOtp(true)
        //         signIn(res.token)  
        //         router.dismiss()
        //         router.replace('/')
        //     }

        // })
    } catch (error) {
        console.log("error dsdf", error)
        setError(true)
        setErrorMessage(error.error)
    }
    }



    return (
        <>
            {/* <StatusBar barStyle='dark-content' backgroundColor={COLORS.white} /> */}
            <Stack.Screen
                options={{
                    headerTitle: 'Enter Your Full Name',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: COLORS.white2
                    },
                    headerLargeStyle: {
                        backgroundColor: COLORS.white
                    },
                    headerTitleStyle: {
                        fontFamily: FONT.semiBold,
                        fontSize: SIZES.medium,
                        color: COLORS.tertiary
                    },
                    headerTintColor: COLORS.tertiary,
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                    headerLargeTitleShadowVisible: false,
                    gestureEnabled: false,
                    headerBackButtonMenuEnabled: false,
                    headerLeft: () => {
                        return (
                            <View >
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        "Are you sure? ",
                                        "You will be redirected to login screen",
                                        [
                                            {
                                                text: "Cancel",
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => router.back() }
                                        ],
                                        { cancelable: true }
                                    );
                                }}>
                                    <ChevronLeftIcon width={24} height={24} color={COLORS.tertiary} />
                                </TouchableOpacity>
                            </View>
                        )

                    },

                }}
            />
            <SafeAreaView style={{ flex: 1, margin: SIZES.medium, justifyContent: 'center', alignItems: 'center' }}>
                {/* <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={0} style={{ flex: 1 }}> */}

                <View style={{ flex: 1, flexDirection: 'column', gap: 8, justifyContent: 'center', alignItems: 'center' }}>


                    <View style={{ justifyContent: 'center', alignItems: 'left', gap: 8, width: "100%", marginTop: SIZES.small }}>
                        <Text style={{ fontFamily: FONT.semiBold, fontSize: SIZES.xLarge, color: COLORS.tertiary }}>Let's Start with knowing your name. </Text>
                        <Input
                            label={true}

                            labelTitle="Enter Your Full Name"
                            value={fullname}
                            description={""}

                            onTextChange={(text: React.SetStateAction<string>) => setFullname(text)}
                            setInputError={error}
                            setInputErrorMessage={errorMessage}
                            placeholder="eg. John Doe" type="name" />
                        <View style={{ width: "100%" }}>

                            <Button label={loading ? 'Updating...' : 'Update'} disabled={fullname.length < 3 } variant="default" onPress={
                                () => updateName()
                            }>Update</Button>
                        </View>
                    </View>


                </View>
                {/* </KeyboardAvoidingView> */}

            </SafeAreaView>
        </>
    )
}

export default Index