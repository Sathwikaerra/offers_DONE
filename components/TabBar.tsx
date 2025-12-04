import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, Feather } from '@expo/vector-icons';
import TabBarButton from '../components/TabBarButton';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

interface TabBarProps {
    state: any,
    descriptors: any,
    navigation: any
}

const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {


    const primaryColor = '#0891b2';
    const greyColor = '#737373';
const [isSubscribed, setIsSubscribed] = React.useState(true);
    return (

        <View style={styles.tabbar}>
            <BlurView experimentalBlurMethod='dimezisBlurView' intensity={100} style={styles.blurContainer}>
                {state.routes.slice(0, 2).map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    if (['_sitemap', '+not-found'].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarButton
                            key={route.name}
                            style={styles.tabbarItem}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            isFocused={isFocused}
                            routeName={route.name}
                            color={isFocused ? COLORS.primary : greyColor}
                            label={label}
                            index={index}
                            totalTabs={state.routes.length}

                        />
                    )

                    // return (
                    //   <TouchableOpacity
                    //     key={route.name}
                    //     style={styles.tabbarItem}
                    //     accessibilityRole="button"
                    //     accessibilityState={isFocused ? { selected: true } : {}}
                    //     accessibilityLabel={options.tabBarAccessibilityLabel}
                    //     testID={options.tabBarTestID}
                    //     onPress={onPress}
                    //     onLongPress={onLongPress}
                    //   >
                    //     {
                    //         icons[route.name]({
                    //             color: isFocused? primaryColor: greyColor
                    //         })
                    //     }
                    //     <Text style={{ 
                    //         color: isFocused ? primaryColor : greyColor,
                    //         fontSize: 11
                    //     }}>
                    //       {label}
                    //     </Text>
                    //   </TouchableOpacity>
                    // );
                })}
                {/* create route  */}
                {
                    state.routes.filter((route: any) => route.name === 'create').map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        if (['_sitemap', '+not-found'].includes(route.name)) return null;

                        const isFocused = state.index === route.index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                // navigation.navigate(isSubscribed ? route.name : 'subscriptionPlans', route.params);
                                router.push(isSubscribed ? route.name : 'subscriptionPlans');
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <TabBarButton
                                key={route.name}
                                style={styles.tabbarItem}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                isFocused={isFocused}
                                routeName={route.name}
                                color={isFocused ? COLORS.primary : greyColor}
                                label={label}
                                index={index}
                                totalTabs={state.routes.length}

                            />
                        );
                    }
                    )
                }
                {/* last two routes */}
                {
                    state.routes.slice(2, 4).map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        if (['_sitemap', '+not-found'].includes(route.name)) return null;

                        const isFocused = state.index === index + 2;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        return (
                            <TabBarButton
                                key={route.name}
                                style={styles.tabbarItem}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                isFocused={isFocused}
                                routeName={route.name}
                                color={isFocused ? COLORS.primary : greyColor}
                                label={label}
                                index={index}
                                totalTabs={state.routes.length}

                            />
                        )

                        // return (
                        //   <TouchableOpacity
                        //     key={route.name}
                        //     style={styles.tabbarItem}
                        //     accessibilityRole="button"
                        //     accessibilityState={isFocused ? { selected: true } : {}}
                        //     accessibilityLabel={options.tabBarAccessibilityLabel}
                        //     testID={options.tabBarTestID}
                        //     onPress={onPress}
                        //     onLongPress={onLongPress}
                        //   >
                        //     {
                        //         icons[route.name]({
                        //             color: isFocused? primaryColor: greyColor
                        //         })
                        //     }
                        //     <Text style={{ 
                        //         color: isFocused ? primaryColor : greyColor,
                        //         fontSize: 11
                        //     }}>
                        //       {label}
                        //     </Text>
                        //   </TouchableOpacity>
                        // );
                    })}


            </BlurView>
        </View>

    )
}

const styles = StyleSheet.create({
    blurContainer: {
        // flex: 1,
        padding: 20,
        paddingVertical: 12,
        // margin: 16,
        textAlign: 'center',
        flexDirection: 'row',
        backgroundColor: '#ffffffcc',
        justifyContent: 'center',
        // overflow: 'hidden',
        borderRadius: 25,
        // position: 'relative',
        // borderWidth: 1,
        // borderColor: COLORS.gray2,
    },
    tabbar: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginHorizontal: 10,
        // paddingVertical: 15,
        // paddingHorizontal: 0,
        borderRadius: 25,
        // zIndex: 100,
        overflow: 'hidden',
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,

    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default TabBar