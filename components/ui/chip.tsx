import { FONT } from '@/constants/theme';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

interface ChipProps {
    label: string;
    color?: string;
    children: React.ReactNode;
    onPress?: () => void;
    textColor?: string;
    style?: any;
    textStyle?: any;
}


const Chip = ({ label, color, onPress, textColor = '#FFF', style, textStyle }: ChipProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.chipContainer, { backgroundColor: color }, style]}>
            <Text style={[styles.chipText, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chipContainer: {
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        marginVertical: 4,
        alignSelf: 'flex-start',
    },
    chipText: {
        fontSize: 14,
        fontFamily: FONT.regular,
    },
});

export default Chip;
