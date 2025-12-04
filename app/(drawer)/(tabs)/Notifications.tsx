import { Animated, FlatList, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { View, Text } from '@/components/Themed';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import NotificationComponent from '@/components/Notification/notificationComponent';
import { deleteData, fetchData } from '@/lib/axiosUtility';
import EmptyStateComponent from '@/components/emptyStateComponent';
import { RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function TabTwoScreen() {
  const [notifications, setNotifications] = React.useState([]) as any;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(null);

  useEffect(() => {
    const checkNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        setIsNotificationEnabled(false);
        console.log('Notifications permissions are not enabled');
      } else {
        console.log('Notifications permissions are enabled');
        setIsNotificationEnabled(true);
      }
    };

    checkNotificationPermissions();
  }, []);

  const getNotifications = async () => {
    try {
      const response = await fetchData('/notifications/v1/all');
      const data = response
      setNotifications(data)
  
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  useEffect(() => {
    getNotifications();
    // handleReadNotifications();
  }, []);

  const animatePop = () => {
    scaleValue.setValue(0); // Reset the animation value
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      animatePop(); // Start the animation whenever the screen is focused
    }, [])
  );
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({}); // Store refs for each Swipeable

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotifications().then(() => setRefreshing(false));
  }, []);

  const renderRightActions = (progress: any, dragX: any, item: any) => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                backgroundColor: '#FFECEB', // Light red background for the swipe
                borderRadius: 16, // Rounded corners
                paddingRight: 15,
                flex: 0.2,
            }}
        >
            <TouchableOpacity onPress={() => {
                handleDeletePress(item._id);
                swipeableRefs.current[item._id]?.close(); // Close the swipeable after deleting
            }} style={{ paddingHorizontal: 20 }}>
               
                <Trash
                size={24}
                color="#EB5757"
                />
            </TouchableOpacity>
           
        </View>
    );
};

const handleDeletePress =  async(id: string) => {
  try {
    const response = await deleteData(`/notifications/v1/delete/${id}`);

    getNotifications();
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
}

  const renderItem = ({ item }: { item: any }) => (
    <View style={{backgroundColor:'#FFECEB', borderRadius:16}}>
    <Swipeable
      ref={(ref) => { if (ref) swipeableRefs.current[item._id] = ref; }} // Assign the ref
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      overshootRight={false}
      rightThreshold={40}
      friction={2}
    >
      <NotificationComponent
        isRead={item.isRead}
        type={item.type}
        Clarification={item.clarificationMessage}
        time={item.createdAt}
        message={item.message}
      />
    </Swipeable>
    </View>
  );

      

  return (
    <>
     {isNotificationEnabled === false && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
             <View style={{ flex: 1, justifyContent: 'center', }}>
              <Text style={{ fontSize: SIZES.medium, fontFamily: FONT.semiBold, color: '#333' }}>
                Notifications not enabled
              </Text>
              <Text style={{ marginTop: 4, width: '90%' , fontSize: SIZES.small, fontFamily: FONT.regular, color: '#666' }}>
                It's time to stay updated! Enable notifications to receive important updates and offers.
              </Text>
              </View>
              <View>
                <Button 
                label="Enable"
                variant={'default'}
                onPress={() => {
                  router.push('/askNotificationPermission');
                }}
                />
              </View>
          
            </View>
          )}
 
    {notifications?.data?.length || notifications?.length > 0 ?
      (
        <ScrollView
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={COLORS.primary}
            colors={[COLORS.white]}
            tintColor={COLORS.primary}
            title="Refreshing..."
            titleColor={COLORS.primary}
            style={{ backgroundColor: COLORS.white }} />}
          style={{ flex: 1, backgroundColor: COLORS.tabWhite }}>
         
          <View>
            {notifications?.data && (
              <>
                {/* Today's notifications */}
                {notifications.data.filter((item: any) =>
                  new Date(item.createdAt).toDateString() === new Date().toDateString()
                ).length > 0 && (
                    <View>
                      <Text style={styles.sectionTitle}>Today</Text>
                      <FlatList
                        data={notifications.data.filter((item: any) =>
                          new Date(item.createdAt).toDateString() === new Date().toDateString()
                        )}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          
                          renderItem({ item })
                          // <NotificationComponent
                          //   isRead={item.isRead}
                          //   type={item.type}
                          //   Clarification={item.clarificationMessage}
                          //   time={item.createdAt}
                          //   message={item.message}
                          // />
                        )}
                        keyExtractor={(item) => item._id}
                      />
                    </View>
                  )}

                {/* Last 7 days notifications */}
                {notifications.data.filter((item: any) => {
                  const itemDate = new Date(item.createdAt);
                  const today = new Date();
                  const diffTime = Math.abs(today.getTime() - itemDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7 && diffDays > 1;
                }).length > 0 && (
                    <View>
                      <Text style={styles.sectionTitle}>Last 7 Days</Text>
                      <FlatList
                        data={notifications.data.filter((item: any) => {
                          const itemDate = new Date(item.createdAt);
                          const today = new Date();
                          const diffTime = Math.abs(today.getTime() - itemDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return diffDays <= 7 && diffDays > 1;
                        })}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                         renderItem({ item })
                        )}
                        keyExtractor={(item) => item._id}
                      />
                    </View>
                  )}

                {/* Older notifications */}
                {notifications.data.filter((item: any) => {
                  const itemDate = new Date(item.createdAt);
                  const today = new Date();
                  const diffTime = Math.abs(today.getTime() - itemDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 7;
                }).length > 0 && (
                    <View>
                      <Text style={styles.sectionTitle}>Older</Text>
                      <FlatList
                        data={notifications.data.filter((item: any) => {
                          const itemDate = new Date(item.createdAt);
                          const today = new Date();
                          const diffTime = Math.abs(today.getTime() - itemDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return diffDays > 7;
                        })}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          renderItem({ item })
                        )}
                        keyExtractor={(item) => item._id}
                      />
                    </View>
                  )}
              </>
            )}

            {notifications?.data?.length === 0 && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: COLORS.tabWhite }}>
                <EmptyStateComponent
                  title="No Notifications"
                  subTitle="You haven't received any notifications yet"
                  img={require('@/assets/images/noNotification.png')}
                />
              </View>
            )}
          </View>
        </ScrollView>
      ) :
      (
        <View style={styles.container}>
          <Animated.Image source={require('@/assets/images/noNotification.png')} style={{ width: 175, height: 175, transform: [{ scale: scaleValue }], objectFit: 'contain' }} />
          <Text style={styles.title}>No Notifications!</Text>
          <Text style={{ color: COLORS.gray, fontFamily: FONT.medium }}>You haven't received any notifications yet</Text>
          <StatusBar barStyle="dark-content" />
        </View>

      )}
      </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.tabWhite
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    marginLeft: 20,
    marginTop: 20
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tabWhite
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: FONT.bold,
    textAlign: 'center'
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: 10
  },

});
