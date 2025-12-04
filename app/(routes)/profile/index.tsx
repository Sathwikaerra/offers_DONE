// import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, StatusBar, Platform, ScrollView, Alert } from 'react-native'
// import React, { useEffect, useLayoutEffect, useState } from 'react'
// import { PencilIcon } from 'lucide-react-native'
// import Chip from '@/components/ui/chip'
// import { COLORS, FONT, SHADOWS, SIZES } from '@/constants/theme'
// import { useFocusEffect } from '@react-navigation/native'
// import { Stack, useNavigation } from 'expo-router'
// import tw from 'tailwind-react-native-classnames'
// import Input from '@/components/ui/Input'
// import * as ImagePicker from 'expo-image-picker'
// import * as FileSystem from 'expo-file-system'
// import { fetchData, putData } from '@/lib/axiosUtility'
// import { Button } from '@/components/ui/Button'
// import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
// import app, { storage } from '@/firebase/config'

// const index = () => {

//     const [User, setUser] = useState([]) as any
//     const [isEditing, setIsEditing] = useState(false)

//     const getCurrentUserDetails = async () => {
//         try {
//             const res = await fetchData('/user/v1/current')
         
//             setUser(res)
//             console.log(User)

//         } catch (error) {
//             console.log('Error in getCurrentUserDetails:', error);
//         }
//     }

//     useEffect(() => {
//         getCurrentUserDetails()
//     }, [])

//     const [firstName, setFirstName] = useState(User?.name?.first)
//     const [middleName, setMiddleName] = useState(User?.name?.middle)
//     const [lastName, setLastName] = useState(User?.name?.last)
//     const [image, setImage] = useState(User?.profileUrl);

//     useEffect(() => {
//         if (User) {
//             setFirstName(User?.name?.first)
//             setMiddleName(User?.name?.middle)
//             setLastName(User?.name?.last)
//             setImage(User?.profilePic)
//         }
//     }, [User])

//     useEffect(() => {
    
//         if (User?.name?.first !== firstName || User?.name?.middle !== middleName || User?.name?.last !== lastName || User?.profilePic !== image){
//             setIsEditing(true)
//         } else {
//             setIsEditing(false)
//         }
//     }, [firstName, middleName, lastName, image ,User])


//     useFocusEffect(
//         React.useCallback(() => {
//             // Set the status bar style for this screen
//             StatusBar.setBarStyle('dark-content', true); // Adjust the style if needed
//             Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white2, true); // Adjust the background color if needed

//             return () => {
//                 // Optional cleanup for status bar (if needed)

//             };
//         }, [])
//     );

 
  
//     async function uploadImageToFirebase(uri: string): Promise<string> {
//         const fileName = new Date().getTime()

//         // Why are we using XMLHttpRequest? See:
//         // https://github.com/expo/expo/issues/2402#issuecomment-443726662
//         const blob: Blob = await new Promise((resolve, reject) => {
//           const xhr = new XMLHttpRequest();
//           xhr.onload = function () {
//             resolve(xhr.response);
//           };
//           xhr.onerror = function (e) {
//             console.log(e);
//             reject(new TypeError("Network request failed"));
//           };
//           xhr.responseType = "blob";
//           xhr.open("GET", uri, true);
//           xhr.send(null);
//         });

//         const storageRef = ref(storage, `profile-pics/${fileName}`)
  
//        try {
//             const response = await fetch(uri)

//             if (!response.ok) {
//                 throw new Error('Failed to fetch image')
//             }

//             const blob = await response.blob()

//             const uploadTask = await uploadBytesResumable(storageRef, blob)

//             setImage(await getDownloadURL(uploadTask.ref))
//             return await getDownloadURL(uploadTask.ref)

            
//        } catch (error) {
//         console.log('Error in uploadImageToFirebase:', error);  
//        }
      
//         // await uploadBytes(fileRef, blob);
      
//         // // We're done with the blob, close and release it
//         // blob.close();
      
//         // return await getDownloadURL(fileRef);
//       }
//     const pickImage = async () => {
       
//         // No permissions request is necessary for launching the image library
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.All,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         });

    
//         if (!result.canceled) {
//             const file = result.assets[0]
//             console.log(file)
//             const uploadUrl = await uploadImageToFirebase(file.uri);
//             setImage(uploadUrl)
//         }
//     };

   


//     const updateProfile = async () => {
//         try {
          

//             const res = await putData('/user/v1/update/current', {
//                 profilePic: image ? image : User?.profilePic,
//                 firstName,
//                 middleName,
//                 lastName,
//             })
            
//             setUser(res?.data)
//             if (res?.data) {
//                 Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
//             }
      
//         } catch (error) {
//             console.log('Error in updateProfile:', error);
//         }
//     }


//     const navigation = useNavigation()

//     useLayoutEffect(() => {
//         navigation.setOptions({
//             headerShown: true,
//             headerTitle: 'Your Profile',
//             headerBackTitleVisible: true,
//             headerLargeTitle: true,
//             headerBackTitle: 'Back',
//             headerStyle: {
//                 backgroundColor: COLORS.white,
//             },
//             headerTintColor: COLORS.primary,
//             headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
//             headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
//             headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
//             headerShadowVisible: false,
//             customAnimationOnGesture: true,
//             fullScreenGestureEnabled: true,
//             animationDuration: Platform.OS === "android" ? undefined : 200,
//         });
//     }
//         , [navigation]);



//     return (
//         <ScrollView>

//             <SafeAreaView style={{ flex: 1, justifyContent: 'start', backgroundColor: COLORS.white }}>
//                 <View style={{ padding: 30, justifyContent: 'center', }}>
//                     <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
//                         {image ? <TouchableOpacity
//                             onPress={() => pickImage()}
//                             style={{
//                                 width: 100,
//                                 height: 100,
//                                 borderRadius: 150 / 2,
//                                 backgroundColor: COLORS.white2,
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                             }}
//                         >
//                             <Image source={{ uri: image }} style={{ width: 90, height: 90, borderRadius: 150 / 2, }} />
//                         </TouchableOpacity> :
//                             <View>

//                                 <TouchableOpacity
//                                     style={{
//                                         width: 100,
//                                         height: 100,
//                                         borderRadius: 150 / 2,
//                                         backgroundColor: COLORS.primary,
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                     }}
//                                     onPress={() => pickImage()}
//                                 >
//                                     <PencilIcon size={20} color={COLORS.tertiary} style={{ position: 'absolute', borderRadius: 12, padding: 8, top: 5, right: 5 }} />
//                                     <Text style={{ fontSize: 30, fontFamily: FONT.semiBold, color: COLORS.white2 }}>{User?.name?.first?.charAt(0)}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         }
//                     </View>
//                     <View style={{ flexDirection: 'column', gap: 8, marginTop: 5, width: '100%' }}>
//                         <Input label={true} description={""} labelTitle="First Name" type={"default"} placeholder="First Name" value={firstName} onTextChange={(text) => setFirstName(text)} />
//                         <Input label={true} description={""} labelTitle="Middle Name" type={"default"} placeholder="Middle Name" value={middleName} onTextChange={(text) => setMiddleName(text)} />
//                         <Input label={true} description={""} labelTitle="Last Name" type={"default"} placeholder="Last Name" value={lastName} onTextChange={(text) => setLastName(text)}/>
//                         <Input disabled label={true} description={""} labelTitle="Email" type="email" placeholder="Email" value={User?.email} />
//                         <Input disabled label={true} description={""} labelTitle="Phone Number" placeholder="Phone" type="phone" value={User?.mobileNumber} />
//                     <Button  disabled={!isEditing} variant={"default"} label="Update Profile" onPress={() => updateProfile()} />
//                     </View>

//                 </View>
//             </SafeAreaView>
//         </ScrollView>
//     )
// }

// export default index

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.white,
//         padding: 20,
//     },
//     profileContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     profileImgContainer: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         overflow: 'hidden',
//         marginRight: 20,
//         marginBottom: 20,
//     },
//     profileImage: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     placeholderImage: {
//         width: '100%',
//         height: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: COLORS.primary,
//     },
//     placeholderText: {
//         color: COLORS.white,
//         fontSize: 24,
//         height: '100%',
//         fontFamily: FONT.medium,
//     },
//     nameContainer: {
//         marginBottom: 20,
//     },
//     profileName: {
//         fontSize: 24,
//         fontFamily: FONT.medium,
//     },
//     detailsContainer: {
//         marginBottom: 20,
//     },
//     detailItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     detailLabel: {
//         fontSize: 16,
//         fontFamily: FONT.medium,
//     },
//     detailValue: {
//         fontSize: 16,
//         fontFamily: FONT.regular,
//     },

//     editButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: COLORS.primary,
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 20,
//     },


// })

import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Platform, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { PencilIcon } from 'lucide-react-native'
import { COLORS, FONT } from '@/constants/theme'
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from 'expo-router'
import Input from '@/components/ui/Input'
import * as ImagePicker from 'expo-image-picker'
import { fetchData, putData } from '@/lib/axiosUtility'
import { Button } from '@/components/ui/Button'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/firebase/config'

const Index = () => {
  const [User, setUser] = useState<any>([])
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [firstName, setFirstName] = useState(User?.name?.first)
  const [middleName, setMiddleName] = useState(User?.name?.middle)
  const [lastName, setLastName] = useState(User?.name?.last)
  const [image, setImage] = useState(User?.profileUrl)

  const getCurrentUserDetails = async () => {
    try {
      const res = await fetchData('/user/v1/current')
      setUser(res)
    } catch (error) {
      console.log('Error in getCurrentUserDetails:', error)
    }
  }

  useEffect(() => {
    getCurrentUserDetails()
  }, [])

  useEffect(() => {
    if (User) {
      setFirstName(User?.name?.first)
      setMiddleName(User?.name?.middle)
      setLastName(User?.name?.last)
      setImage(User?.profilePic)
    }
  }, [User])

  useEffect(() => {
    if (
      User?.name?.first !== firstName ||
      User?.name?.middle !== middleName ||
      User?.name?.last !== lastName ||
      User?.profilePic !== image
    ) {
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
  }, [firstName, middleName, lastName, image, User])

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white2, true)
      return () => {}
    }, [])
  )

  async function uploadImageToFirebase(uri: string): Promise<string> {
    setUploading(true)
    const fileName = new Date().getTime()
    const storageRef = ref(storage, `profile-pics/${fileName}`)

    try {
      const response = await fetch(uri)
      if (!response.ok) throw new Error('Failed to fetch image')

      const blob = await response.blob()
      const uploadTask = await uploadBytesResumable(storageRef, blob)

      const downloadUrl = await getDownloadURL(uploadTask.ref)
      setImage(downloadUrl)
      return downloadUrl
    } catch (error) {
      console.log('Error in uploadImageToFirebase:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const file = result.assets[0]
      try {
        const uploadUrl = await uploadImageToFirebase(file.uri)
        setImage(uploadUrl)
      } catch (e) {
        Alert.alert('Error', 'Image upload failed. Please try again.')
      }
    }
  }

  const updateProfile = async () => {
    try {
      const res = await putData('/user/v1/update/current', {
        profilePic: image ? image : User?.profilePic,
        firstName,
        middleName,
        lastName,
      })

      setUser(res?.data)
      if (res?.data) {
        Alert.alert('Profile Updated', 'Your profile has been successfully updated.')
      }
    } catch (error) {
      console.log('Error in updateProfile:', error)
    }
  }

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Your Profile',
      headerBackTitleVisible: true,
      headerLargeTitle: true,
      headerBackTitle: 'Back',
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
      headerShadowVisible: false,
      customAnimationOnGesture: true,
      fullScreenGestureEnabled: true,
      animationDuration: Platform.OS === 'android' ? undefined : 200,
    })
  }, [navigation])

  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1, justifyContent: 'start', backgroundColor: COLORS.white }}>
        <View style={{ padding: 30, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                width: 100,
                height: 100,
                borderRadius: 150 / 2,
                backgroundColor: COLORS.white2,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {uploading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : image ? (
                <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 150 / 2 }} />
              ) : (
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 150 / 2,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PencilIcon
                    size={20}
                    color={COLORS.tertiary}
                    style={{ position: 'absolute', borderRadius: 12, padding: 8, top: 5, right: 5 }}
                  />
                  <Text style={{ fontSize: 30, fontFamily: FONT.semiBold, color: COLORS.white2 }}>
                    {User?.name?.first?.charAt(0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'column', gap: 8, marginTop: 5, width: '100%' }}>
            <Input
              label
              description={''}
              labelTitle="First Name"
              type={'default'}
              placeholder="First Name"
              value={firstName}
              onTextChange={(text) => setFirstName(text)}
            />
            <Input
              label
              description={''}
              labelTitle="Middle Name"
              type={'default'}
              placeholder="Middle Name"
              value={middleName}
              onTextChange={(text) => setMiddleName(text)}
            />
            <Input
              label
              description={''}
              labelTitle="Last Name"
              type={'default'}
              placeholder="Last Name"
              value={lastName}
              onTextChange={(text) => setLastName(text)}
            />
            <Input disabled label description={''} labelTitle="Email" type="email" placeholder="Email" value={User?.email} />
            <Input disabled label description={''} labelTitle="Phone Number" placeholder="Phone" type="phone" value={User?.mobileNumber} />
            <Button disabled={!isEditing || uploading} variant={'default'} label="Update Profile" onPress={() => updateProfile()} />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
})
