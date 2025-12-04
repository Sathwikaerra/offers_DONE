import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { Compass, Home, Settings } from 'lucide-react-native';
import TabBar from '@/components/TabBar';
import * as Notifications from 'expo-notifications';
import { useSession } from '@/provider/ctx';
import Splash from '@/components/SplashScreen';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
export default function TabLayout() {
  const [notificationCount, setNotificationCount] = React.useState(0);
  const getNotificationCount = async () => {
    const notificationBadge = await Notifications.getBadgeCountAsync();

    setNotificationCount(notificationBadge);
    return notificationBadge;
  }
  useEffect(() => {
    getNotificationCount();

  }
    , [Notifications.getBadgeCountAsync()])
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const { session, isLoading } = useSession();
  if (isLoading) {
    return <Splash />;
  }
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth/landingScreen" />;
  }

  return (

    <Tabs
      tabBar={props => <TabBar {...props} />}
      initialRouteName="index"

    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused, color }) => focused ? <Compass stroke={COLORS.primary} color={COLORS.primary} /> : <Compass color={focused ? COLORS.primary : COLORS.gray2} />,
          tabBarLabelStyle: {
            fontFamily: FONT.semiBold,
            fontSize: SIZES.small,
          },
          tabBarActiveTintColor: COLORS.primary,
          headerShown: false,
          headerTitleStyle: { fontFamily: 'Lexend-SemiBold' },
          tabBarActiveBackgroundColor: COLORS.white2,
          tabBarStyle: {
            backgroundColor: COLORS.white2,
            borderTopColor: COLORS.white2,
            height: Platform.OS === 'android' ? 60 : 80

          },
          tabBarItemStyle: {
            borderRadius: 20,
            marginHorizontal: 10,
            padding: 0,
            marginVertical: Platform.OS === 'android' ? 5 : 0,

          },
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="Saved"


        options={{
          headerShown: false,
          title: 'Saved',
          headerTitleStyle: { fontFamily: 'Lexend-SemiBold' },
          tabBarIcon: ({ focused, color }) => focused ? <TabBarIcon name="code" color={COLORS.primary} /> : <TabBarIcon name="code" color={COLORS.gray} />,
          tabBarLabelStyle: {
            fontFamily: FONT.semiBold,
            fontSize: SIZES.small,
          },
          tabBarActiveTintColor: COLORS.primary,

          tabBarActiveBackgroundColor: COLORS.white2,
          tabBarStyle: {
            backgroundColor: COLORS.white2,
            borderTopColor: COLORS.white2,
            height: Platform.OS === 'android' ? 60 : 80

          },
          tabBarItemStyle: {
            borderRadius: 20,
            marginHorizontal: 10,
            padding: 0,
            marginVertical: Platform.OS === 'android' ? 5 : 0,

          },

        }}
      />
      <Tabs.Screen
        name="Notifications"


        options={{
          title: 'Notifications',
          headerTitleStyle: { fontFamily: 'Lexend-SemiBold' },
          tabBarIcon: ({ focused, color }) => focused ? <Settings color={COLORS.primary} /> : <Settings color={COLORS.gray} />,
          tabBarLabelStyle: {
            fontFamily: FONT.semiBold,
            fontSize: SIZES.small,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarBadge: notificationCount,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.white
          },
          tabBarActiveBackgroundColor: COLORS.white2,
          tabBarStyle: {
            backgroundColor: COLORS.white2,
            borderTopColor: COLORS.white2,
            height: Platform.OS === 'android' ? 60 : 80

          },
          
          tabBarItemStyle: {
            borderRadius: 20,
            marginHorizontal: 10,
            padding: 0,
            marginVertical: Platform.OS === 'android' ? 5 : 0,

          },

        }}
      />
      <Tabs.Screen
        name="Settings"


        options={{
          title: 'Settings',
          headerTitleStyle: { fontFamily: 'Lexend-SemiBold' },
          tabBarIcon: ({ focused, color }) => focused ? <TabBarIcon name="cog" color={COLORS.primary} /> : <TabBarIcon name="cog" color={COLORS.gray} />,
          tabBarLabelStyle: {
            fontFamily: FONT.semiBold,
            fontSize: SIZES.small,
          },
          tabBarActiveTintColor: COLORS.primary,

          tabBarActiveBackgroundColor: COLORS.white2,
          tabBarStyle: {
            backgroundColor: COLORS.white2,
            borderTopColor: COLORS.white2,
            height: Platform.OS === 'android' ? 60 : 80

          },
          tabBarItemStyle: {
            borderRadius: 20,
            marginHorizontal: 10,
            padding: 0,
            marginVertical: Platform.OS === 'android' ? 5 : 0,
          },
        }}
      />
    </Tabs>
  );
}
