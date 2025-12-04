import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TextInput, Platform, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { COLORS, FONT, SHADOWS, SIZES } from '../../constants/theme';
import * as Haptics from 'expo-haptics';
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import { DevicePhoneMobileIcon, EnvelopeIcon } from 'react-native-heroicons/solid';
import { Lock } from 'lucide-react-native';

interface InputProps {
    type: string;
    onTextChange: (text: string) => void;
    label?: boolean;
    setInputError?: boolean;
    setInputErrorMessage?: string;
    labelTitle?: string;
    required?: boolean;
    description?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyPress?: () => void;
    value?: string;
    style?: any;
    keyboardType?: any;
    disabled?: boolean;
    placeholder?: string;
    editable?: boolean;
    message?: string;
}

export default function Input({
    type,
    onTextChange,
    label,
    setInputError,
    required,
    message,
    setInputErrorMessage,
    labelTitle,
    description,
    disabled,
    ...props
}: InputProps) {
    const [value, setValue] = useState(props.value || '');
    const [error, setError] = useState(setInputError || false);
    const [errorMessage, setErrorMessage] = useState(setInputErrorMessage || '');
    const [showPassword, setShowPassword] = useState(true);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        setError(setInputError || false);
        setErrorMessage(setInputErrorMessage || '');
        if (description !== '') {
            setShowDescription(true);
        }
    }, [value, setInputError, setInputErrorMessage, description, type]);

    let keyboardType: any = 'default';
    if (type === 'numeric') keyboardType = 'numeric';
    if (type === 'email') keyboardType = 'email-address';
    if (type === 'phone') keyboardType = 'phone-pad';

    const hapticFeedback = () => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    return (
        <TouchableWithoutFeedback onPress={handleFocus}>
            <>
                {label && (
                    <Text
                        onPress={handleFocus}
                        style={[tw`text-sm`, { fontFamily: FONT.medium, color: COLORS.gray }]}
                    >
                        {labelTitle || ''} {required && <Text style={{ color: 'red' }}>*</Text>}
                    </Text>
                )}
                <View
                    className='bg-gray-200'
                    style={[
                        tw`flex-row items-center overflow-hidden`,
                        {
                            width: '100%',
                            backgroundColor: COLORS.white2,
                            borderRadius: SIZES.medium,
                            padding: 12,
                            paddingVertical: Platform.OS === 'ios' ? 16 : 14,
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                        },
                    ]}
                >
                    {type === 'phone' ? (
                        <DevicePhoneMobileIcon
                            color={COLORS.primary}
                            size={20}
                            style={{ marginRight: 4 }}
                            onPress={handleFocus}
                        />
                    ) : type === 'password' ? (
                        <Lock
                            color={COLORS.primary}
                            size={20}
                            style={{ marginRight: 4 }}
                            onPress={handleFocus}
                        />
                    ) : (
                        type === 'email' && (
                            <EnvelopeIcon
                                color={COLORS.primary}
                                size={20}
                                style={{ marginRight: 4 }}
                                onPress={handleFocus}
                            />
                        )
                    )}

                    {type === 'phone' && (
                        <Text
                            style={[
                                styles.text,
                                { marginHorizontal: 4, color: COLORS.primary, fontSize: SIZES.medium },
                            ]}
                        >
                            +91
                        </Text>
                    )}

                    <TextInput
                        ref={inputRef}
                        placeholderTextColor={COLORS.gray2}
                        onFocus={props.onFocus}
                        editable={!disabled}
                        keyboardAppearance='light'
                        onKeyPress={() => {
                            props.onKeyPress && props.onKeyPress();
                            hapticFeedback();
                        }}
                        multiline={type === 'description'}
                        secureTextEntry={type === 'password' && showPassword}
                        selectionColor={COLORS.primary}
                        value={value}
                        onChangeText={(text) => {
                            setValue(text);
                            onTextChange && onTextChange(text);
                        }}
                        onBlur={props.onBlur}
                        style={[styles.container, type === 'description' && { height: 80 }, { opacity: disabled ? 0.5 : 1 }]}
                        keyboardType={keyboardType}
                        returnKeyType='done'
                        {...props}
                    />

                    {type === 'password' &&
                        (showPassword ? (
                            <EyeIcon
                                onPress={() => setShowPassword(!showPassword)}
                                style={[tw`absolute right-3 top-3`]}
                                width={23}
                                height={23}
                                color={COLORS.gray}
                            />
                        ) : (
                            <EyeSlashIcon
                                onPress={() => setShowPassword(!showPassword)}
                                style={[tw`absolute right-3 top-3`]}
                                width={23}
                                height={23}
                                color={COLORS.gray}
                            />
                        ))}
                </View>

                {message && (
                    <Text
                        style={[
                            tw`text-gray-500`,
                            { fontFamily: FONT.medium, marginTop: 4, fontSize: SIZES.small - 2, opacity: 0.8 },
                        ]}
                    >
                        {message}
                    </Text>
                )}
                {error && (
                    <Text style={[tw`text-sm text-red-500`, { fontFamily: FONT.medium }]}>{errorMessage}</Text>
                )}
                {showDescription && (
                    <Text style={[tw`text-xs mt-1 text-gray-400`, { fontFamily: FONT.medium }]}>{description}</Text>
                )}
            </>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.white2,
        width: '100%',
    },
    text: {
        fontFamily: FONT.medium,
    },
});
