import { StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from './constants/theme';

const themeStyles = StyleSheet.create({
    buttonPrimary: {
        backgroundColor: COLORS.primary,
        padding: 14,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: {
        backgroundColor: COLORS.secondary,
        padding: 14,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWhite: {
        backgroundColor: COLORS.white,
        padding: 14,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.small + 2,
        fontFamily: FONT.medium,
    },
    buttonTextPrimary: {
        color: COLORS.white,
        fontSize: SIZES.small + 2,
        fontFamily: FONT.medium,
    },
    buttonTextSecondary: {
        color: COLORS.white,
        fontSize: SIZES.small + 2,
        fontFamily: FONT.medium,
    },
    buttonTextWhite: {
        color: COLORS.tertiary,
        fontSize: SIZES.small + 2,
        fontFamily: FONT.medium,
    },
    buttonDisabled: {
        backgroundColor: COLORS.gray2,
        padding: 14,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 25,
        fontFamily: FONT.bold,
    }
});

export default themeStyles;