import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AUTH_TYPES, COLORS, FONT, SIZES } from '../../constants/theme'
import tw from 'tailwind-react-native-classnames'
import Input from '../ui/Input'
import { router } from 'expo-router'
import { Button } from '../ui/Button'
import { postData } from '@/lib/axiosUtility'

const MobileLogin = () => {
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false) // <-- Added loading state

  // validate number
  useEffect(() => {
    if (mobile.length > 10) {
      setError(true)
      setErrorMessage('Mobile number must be 10 digits')
    } else {
      setError(false)
      setErrorMessage('')
    }
  }, [mobile])

  const handleSubmit = async () => {
    if (mobile.length !== 10) {
      setError(true)
      setErrorMessage('Mobile number must be 10 digits')
      return
    }

    try {
      setLoading(true) // start loading
      const res = await postData(`/auth/v1/user-mobile-login`, { mobileNumber: mobile })
      console.log(res)

      if (res.data.Status === "Success") {
        router.push(`/auth/otpVerificationScreen/${mobile}`)
      } else {
        setError(true)
        setErrorMessage(res.data.msg || 'Failed to send OTP')
      }
    } catch (error: any) {
      setError(true)
      setErrorMessage(error?.response?.data?.msg || 'Something went wrong')
    } finally {
      setLoading(false) // stop loading
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}>
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
            placeholder="eg. 99999 99999"
            type="phone"
          />

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={mobile.length !== 10 || loading}
            onPress={handleSubmit}
            style={{
              backgroundColor: loading ? COLORS.gray2 : COLORS.primary,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              opacity: mobile.length !== 10 ? 0.6 : 1
            }}
          >
            {loading ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={{ color: 'white', marginLeft: 10, fontFamily: FONT.medium }}>Sending OTP...</Text>
              </>
            ) : (
              <Text style={{ color: 'white', fontFamily: FONT.medium, fontSize: 16 }}>Request OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[tw`text-sm`, { fontFamily: FONT.medium, color: COLORS.gray }]}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/registerScreen')}>
            <Text style={[tw`text-sm mx-1`, { fontFamily: FONT.medium, color: COLORS.primary }]}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MobileLogin
