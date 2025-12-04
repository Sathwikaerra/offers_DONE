import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, useBottomSheet, } from '@gorhom/bottom-sheet';
import { ChevronDown, ChevronLeft, ChevronLeftIcon, ChevronRight, XIcon } from 'lucide-react-native'
import { COLORS, FONT, SIZES } from '../constants/theme'
import { BlurView } from 'expo-blur';
import tw from 'tailwind-react-native-classnames';

interface BottomSheetComponentProps {
    bottomSheetRef: any
    snapPoints: any[]
    handleClosePress: () => void
    title: string
    children?: React.ReactNode
}

export const BottomSheetComponent = ({ bottomSheetRef, snapPoints, handleClosePress, title, children }: BottomSheetComponentProps) => {
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
        ,
        []
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
        style={{zIndex: 100}}
            backgroundStyle={{ backgroundColor: '#fff', borderRadius: 30 }}
            backdropComponent={renderBackdrop}
        >


            <BottomSheetView style={styles.contentContainer}>

                <View style={{ paddingHorizontal: 24, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                    <Text
                        style={{ fontSize: SIZES.large, fontFamily: FONT.semiBold, color: COLORS.tertiary, }}
                    >{title}</Text>
                    <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 5, zIndex: 50 }} onPress={() => handleClosePress()}>
                        <View >

                            <XIcon size={20} color={"black"} onPress={handleClosePress} />

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginTop: 10, backgroundColor: COLORS.white2 }}>
                    {children}
                </View>
            </BottomSheetView>

        </BottomSheet>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: "grey",
    },
    contentContainer: {
        flex: 1,
        // paddingHorizontal: 24,

    },
});