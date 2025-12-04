import { Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { COLORS, FONT, SIZES } from '@/constants/theme'
import { Search } from 'lucide-react-native'
import tw from 'tailwind-react-native-classnames'
import { router } from 'expo-router'

interface SearchComponentProps {
    value: string
    placeholder: string
    onChangeText: (value: string) => void
    redirect?: boolean
    focus?: boolean

}

const SearchComponent = ({ value, placeholder, onChangeText, redirect, focus }: SearchComponentProps) => {
    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => {
        inputRef.current?.focus();
    };

    const redirectSearch = () => {
        if (redirect) {
            router.push('/search');
            //remove focus
            inputRef.current?.blur();

        }
    }
    useEffect(() => {
        if (focus) {
            handleFocus()
        }
    }
        , [focus])
    return (
        <TouchableWithoutFeedback onPress={handleFocus}>
            <View className='bg-gray-200' style={[tw`flex-row items-center overflow-hidden`, { width: '100%', backgroundColor: COLORS.white2, borderRadius: SIZES.medium, padding: 12, paddingVertical: Platform.OS === 'ios' ? 16 : 14, borderWidth: 1, borderColor: '#e5e7eb' }]}>
                <Search color={COLORS.primary} size={20} style={{ marginRight: 4 }} onPress={handleFocus} />
                <TextInput
                    ref={inputRef}
                    inputMode='search'
                    cursorColor={COLORS.primary}
                    placeholder={placeholder}
                    value={value}
                    onFocus={redirectSearch}
                    onChangeText={onChangeText}
                    style={styles.container}
                />
            </View>

        </TouchableWithoutFeedback>
    )
}

export default SearchComponent

const styles = StyleSheet.create({
    container: {

        fontFamily: FONT.medium,

        fontSize: SIZES.medium,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.white2,
    },
    text: {
        fontFamily: FONT.medium,

    }
})