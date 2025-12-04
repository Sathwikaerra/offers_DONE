import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, router, usePathname } from 'expo-router';
import { Alert, Image, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BACKEND_URL, COLORS, FONT, SIZES } from '@/constants/theme';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { sideBarTabs } from '@/constants';
import { useSession } from '@/provider/ctx';
import Splash from '@/components/SplashScreen';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { fetchData } from '@/lib/axiosUtility';
import { PlusCircle } from 'lucide-react-native';
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
import { Stack } from "expo-router";
import * as Linking from "expo-linking";

export  function RootLayout() {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("App opened with URL:", url);
    });
    return () => subscription.remove();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}


const CustomDrawerContent = (props: any) => {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState() as any


    const getCurrentUserDetails = async () => {

        try {
            //  const res = await axios.get(`${BACKEND_URL}/user/v1/current`).then(res => res.data) as any;
            //send request with token in header
            const res = await fetchData(`/user/v1/current`)
            setCurrentUser(res);
        

        } catch (error: any) {
            console.log('error', error.response.data.message)

        }
        // setCurrentUser(user);
    }
    useEffect(() => {
        getCurrentUserDetails();
    }, [])

    const { session, isLoading, signOut } = useSession();
    if (isLoading) {
        return <Splash />;
    }
    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/auth/landingScreen" />;
    }

    return !isLoading && (
        <DrawerContentScrollView {...props}>
            <View style={styles.userInfoWrapper}>
                <Image
                    source={{ uri: currentUser?.profilePic }}
                    width={60}
                    height={60}
                    style={styles.userImg}
                />
                <View style={styles.userDetailsWrapper}>
                    <Text style={styles.userName}>
                        {currentUser?.name && currentUser.name?.first}
                        {currentUser?.name && currentUser.name?.last}
                        {
                            !currentUser?.name && !currentUser?.name?.first && !currentUser?.name?.last && "No Name"
                        }
                        {!currentUser?.name && !currentUser?.name?.first && !currentUser?.name?.last &&
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => router.push('/(routes)/profile')}
                            >
                                <PlusCircle size={20} />
                            </TouchableOpacity>}

                    </Text>
                    <Text style={styles.userEmail}>{currentUser?.email}</Text>
                </View>
            </View>
            {/* <DrawerItem
                icon={({ color, size }) => (
                    <Feather

                        size={size}
                        color={pathname == "/index" ? "#fff" : "#000"}
                    />
                )}
                label={"Feed"}
                labelStyle={[
                    styles.navItemLabel,
                    { color: pathname == "/index" ? COLORS.white : 'black' },
                ]}
                style={{ backgroundColor: pathname == "/index" ? COLORS.primary : COLORS.white }}
                onPress={() => {
                    router.push("/(drawer)/(tabs)/feed");
                }}
            /> */}
            {
                sideBarTabs.map((tab: any, index: any) => (
                    <DrawerItem
                        key={index}
                        icon={({ color, size }) => (
                            tab.icon
                        )}
                        label={tab.label}
                        labelStyle={[
                            styles.navItemLabel,
                            { color: pathname == tab.route ? COLORS.white : 'black' },
                        ]}
                        style={{ backgroundColor: pathname == tab.route ? COLORS.primary : COLORS.white }}
                        onPress={() => {
                            if (tab.route == '/signout') {
                                Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'OK', onPress: () => {
                                            signOut();
                                            SecureStore.deleteItemAsync('token');
                                        }
                                    }
                                ])


                            }
                            else {
                                router.push(tab.route);
                            }

                            props.navigation.closeDrawer();
                        }}
                    />
                ))
            }


        </DrawerContentScrollView>
    );
};

export default function TabLayout() {


    return (
        <>
            <StatusBar barStyle="dark-content" />
            <Drawer
                drawerContent={(props: any) => <CustomDrawerContent {...props} />}

                screenOptions={{
                    headerShown: false,
                    drawerActiveBackgroundColor: COLORS.primary,
                    drawerInactiveBackgroundColor: "transparent",
                    drawerActiveTintColor: COLORS.white,
                    drawerInactiveTintColor: COLORS.gray,
                    drawerHideStatusBarOnOpen: Platform.OS === 'ios' ? true : false,
                    overlayColor: "transparent",
                    drawerStyle: {
                        backgroundColor: COLORS.white,
                        width: '70%',
                    },
                    sceneContainerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                }}>


                {/* <Drawer.Screen name="(auth)/landingScreen" options={{ headerShown: false }} /> */}
                {/* <Drawer.Screen
                name="create"
                options={{
                    headerShown: false,
                    title: 'Home',

                }}
            /> */}
                {/* <Drawer.Screen name="settings" options={{ headerShown: false }} /> */}
            </Drawer>
        </>

    );
}

const styles = StyleSheet.create({
    navItemLabel: {
        marginLeft: -20,
        fontSize: 16,
        fontFamily: FONT.regular
    },
    userInfoWrapper: {
        flexDirection: "column",
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    userImg: {
        borderRadius: 25,
    },
    userDetailsWrapper: {
        marginTop: 10,
        marginLeft: 10,
    },
    userName: {
        fontSize: SIZES.large,
        fontFamily: FONT.semiBold
    },
    userEmail: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular
    }
});