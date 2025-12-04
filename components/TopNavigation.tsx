import { BANNER_H, TOPNAVI_H } from '@/constants';
import { COLORS, FONT } from '@/constants/theme';
import { router } from 'expo-router';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';


const TopNavigation = (props: any) => {
    const safeArea = useSafeArea();

    const { title, scrollA } = props;
    const isFloating = !!scrollA;
    const [isTransparent, setTransparent] = useState(isFloating);

    useEffect(() => {
        if (!scrollA) {
            return;
        }
        const listenerId = scrollA.addListener((a: { value: number; }) => {
            const topNaviOffset = BANNER_H - TOPNAVI_H - safeArea.top;
            isTransparent !== a.value < topNaviOffset &&
                setTransparent(!isTransparent);
        });
        return () => scrollA.removeListener(listenerId);
    });

    return (
        <>
            <StatusBar
                barStyle={isTransparent ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <View style={styles.container(safeArea, isFloating, isTransparent, props.backBtn) as any}>
                {
                    props.backBtn === false ? null :
                        Platform.OS === "ios" ? <ChevronLeft onPress={
                            () => {
                               router.canGoBack() ? router.back() : router.push('/');
                            }
                        } width={35} height={35} color={isTransparent ? '#FFF' : '#000'} /> :
                            <ArrowLeft onPress={
                                () => {
                                    router.canGoBack() ? router.back() : router.push('/');

                                }
                            } width={22} height={22} style={{ marginLeft: 20 }} color={isTransparent ? '#FFF' : '#000'} />}
                <Text numberOfLines={1} style={styles.title(isTransparent, props.backBtn) as any}>{isTransparent ? 'Offer Details' : title}</Text>
            </View>
        </>
    );
};

const styles = {
    container: (safeArea: { top: number; }, isFloating: any, isTransparent: any, backBtn: any) => ({
        paddingTop: safeArea.top,
        marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
        height: TOPNAVI_H + safeArea.top,

        flexDirection: 'row',
        alignItems: 'center',
        shadowOffset: { y: 0 },
        backgroundColor: isTransparent ? backBtn !== false ? '#0001' : COLORS.tabWhite : '#FFF',
        shadowOpacity: isTransparent ? 0 : 0.01,
        elevation: isTransparent ? 0 : 5,
        zIndex: 100,
    }),
    title: (isTransparent: any, backBtn: any) => ({
        textAlign: 'left',
        fontFamily: FONT.semiBold,
        fontSize: backBtn === false ? 20 : 16,
        width: '80%',
        marginLeft: backBtn === false ? 18 : 0,
        color: isTransparent ? '#FFF' : '#000',
    }),
};

export default TopNavigation;