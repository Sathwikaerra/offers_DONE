import { COLORS, FONT, SIZES } from '@/constants/theme';
import { router } from 'expo-router';
import { MapPinIcon } from 'lucide-react-native';
import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface PromoCardProps {
    _id: string;
    businessName: string;
    location: string;
    logo: string;
    deleteBusiness: (id: string) => void;
    handleEditBusiness: (item: any) => void;
}

const PromoCard: React.FC<PromoCardProps> = ({ _id, businessName, location, logo, deleteBusiness, handleEditBusiness }) => {
    const swipeableRef = useRef<Swipeable | null>(null);

    const renderRightActions = (progress: any, dragX: any, item: any) => {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    backgroundColor: '#FFECEB', // Light red background for the swipe
                    borderRadius: 16, // Rounded corners
                    paddingRight: 15,
                    flex: 0.3,
                }}
            >
                <TouchableOpacity onPress={() => {
                    deleteBusiness(item?._id);
                    swipeableRef.current?.close(); // Close the swipeable after deleting
                }} style={{ paddingHorizontal: 20 }}>
                    <Text style={{ color: '#EB5757', fontSize: 16, fontFamily: FONT.semiBold }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    handleEditBusiness(item);
                    swipeableRef.current?.close(); // Close the swipeable after editing
                }} style={{ paddingHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ color: '#4A90E2', fontSize: 16, fontFamily: FONT.semiBold }}>Edit</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, borderRadius: 16, backgroundColor: '#FFECEB' }}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, { _id })}
                overshootRight={false}
                rightThreshold={40}
                friction={2}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        router.push(`/(routes)/businessProfile/${_id}`);
                    }}
                    style={styles.card}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={{
                                uri: logo || 'https://via.placeholder.com/150',
                            }}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text numberOfLines={1} style={[styles.title]}>{businessName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <MapPinIcon size={16} color={COLORS.gray} />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white2,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    logoContainer: {
        backgroundColor: COLORS.tabWhite,
        borderRadius: 16,
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 16,
    },
    textContainer: {
        width: '70%',
    },
    title: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        width: '100%',
        color: COLORS.primary, // matching the color of the title text
        marginBottom: 5,
    },
    locationText: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.gray, // matching the color of the discount text
    },
});

export default PromoCard;
