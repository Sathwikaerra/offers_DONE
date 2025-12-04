import { Platform, StatusBar, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications'; // Import Expo notifications
import * as IntentLauncher from 'expo-intent-launcher'; // Import for redirecting to settings on Android
import { COLORS, FONT } from '@/constants/theme';
import EmptyStateComponent from '@/components/emptyStateComponent';
import { Button } from '@/components/ui/Button';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import * as Constants from 'expo-constants';
import * as Device from 'expo-device';
import { postData } from '@/lib/axiosUtility';
import { Stack } from 'expo-router';

const openAppSettings = () => {
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:'); // Redirect to iOS app settings
    } else {
        IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
            data: `package:${Application.applicationId}`, // Redirect to Android app settings
        });
    }
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // openAppSettings();
            Alert.alert(
                'Enable Notifications',
                'You need to enable notifications to receive important updates and alerts.',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'Enable', onPress: openAppSettings },
                ]
            );
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // EAS projectId is used here.
        try {
            const projectId =
                Constants?.default?.expoConfig?.extra?.eas?.projectId ?? Constants?.default?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found');
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
    
        } catch (e) {
            token = `${e}`;
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

const index = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Enable notifications",
            headerBackTitleVisible: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.tabWhite,
                shadowColor: 'transparent',
                elevation: 0,
            },
            animation: Platform.OS === 'ios' ? 'fade' : 'default',
            animationTypeForReplace: Platform.OS === 'ios' ? 'fade' : 'push',
            animationDuration: Platform.OS === "android" ? undefined : 200,
            customAnimationOnGesture: true,
            headerTintColor: COLORS.primary,
            headerTransparent: true,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle('dark-content', true);
            Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.tabWhite, true);

            return () => {
                // Cleanup (if needed)
            };
        }, [])
    );


    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const handleEnableNotifications = async () => {
        try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                setExpoPushToken(token);

               

                // Send token to backend
                const response = await postData('user/v1/save-push-token', {
                    
                    pushToken: token 
                });

               

                console.log('Push token sent to backend successfully');

                if (Platform.OS === 'android') {
                    const channelsValue = await Notifications.getNotificationChannelsAsync();
                    setChannels(channelsValue ?? []);
                }

                notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                    setNotification(notification);
                });

                responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                    console.log(response);
                });
            }
        } catch (error) {
            console.error('Error in handleEnableNotifications:', error);
        }
    };

    useEffect(() => {
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            
            <EmptyStateComponent
                img={require('@/assets/images/noNotification.png')}
                title="Enable Notifications"
                subTitle={"Enable notifications to receive important updates and alerts."}
            />
        
            <View style={{ padding: 20, paddingBottom: Platform.OS === 'ios' ? 60 : 40 }}>
                <Button label="Enable notifications" variant={"default"} onPress={handleEnableNotifications} />
            </View>
        </View>
    );
};


export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tabWhite,
    },
});
