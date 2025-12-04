import { Stack } from 'expo-router'
import React from 'react'

function _layout() {


  return  <Stack>
    <Stack.Screen name="landingScreen" />
    <Stack.Screen name="loginScreen"  />
    <Stack.Screen name="registerScreen"  />

     <Stack.Screen name="adminLoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="adminOtpVerificationScreen/[email]" options={{ headerShown: false }} />
   
  </Stack>

}

export default _layout