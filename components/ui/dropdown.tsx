import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { BriefcaseBusiness, MapPin, Search, Megaphone, BookPlusIcon } from 'lucide-react-native';
import SearchComponent from '../SearchComponent';
import CategoriesCard from '../Create/CategoriesCard';

interface item {
    label: string;
    currentValue: string;
}

interface DropdownProps {
    data: item[];
    label: string;
    onChange: (item: item) => void;
    isAddressType?: boolean;
    isOfferType?: boolean;
    isCategory?: boolean;
    labelTitle?: string;
    value?: string;
    required?: boolean;
    isBusinessProfile?: boolean
}


const DropdownComponent = ({ data, label, onChange, isAddressType, isOfferType, isCategory, isBusinessProfile, value, required }: DropdownProps) => {
    const [currentValue, setCurrentValue] = useState();
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (currentValue || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: COLORS.primary }]}>
                    {isAddressType ? 'Select Address' : isOfferType ? 'Select Offer' : isCategory ? 'Select Category' : isBusinessProfile ? 'Select Business Profile' : label || 'Select item'}
                </Text>
            );
        }
        return null;
    };
    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: COLORS.primary }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data as any}
                search
                searchField="label"
                fontFamily={FONT.regular}
                maxHeight={300}
                labelField="label"
                valueField="label"
                placeholder={!isFocus ? label + (required ? ' *' : '') || 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={value}
                itemTextStyle={{ fontFamily: FONT.regular }}
                itemContainerStyle={{ borderRadius: SIZES.medium, marginHorizontal: 10 }}
                renderItem={(item: any) => (
                    <View

                        style={{ padding: 16, marginVertical: 4 }}>
                        <Text style={{ fontFamily: FONT.regular }}>{item.label}</Text>
                    </View>
                )
                }
                dropdownPosition="bottom"
                containerStyle={{ borderRadius: SIZES.medium, marginTop: 5, paddingBottom: 10 }}
                onFocus={() => { setIsFocus(true) }}
                onBlur={() => setIsFocus(false)}
                onChange={(item: any) => {
                    setCurrentValue(item.label);
                    setIsFocus(false);
                    onChange(item);
                }}
                renderInputSearch={(onSearch: (text: string) => void) => (
                    <View style={{ padding: 16 }}>

                        <SearchComponent
                            value={currentValue as any}
                            placeholder="Search..."
                            onChangeText={(item: any) => {
                                setCurrentValue(item);
                                onSearch(item);
                            }}
                        />
                    </View>
                )}

                renderLeftIcon={() => (
                    isOfferType ?
                        <Megaphone
                            size={20}
                            style={{ marginRight: 5 }}
                            color={isFocus ? COLORS.primary : 'black'}
                        />
                        :
                        isAddressType ?
                            <MapPin
                                size={20}
                                style={styles.icon}
                                color={isFocus ? COLORS.primary : 'black'}
                            />
                            :
                            isCategory ?
                                <BookPlusIcon
                                    size={20}
                                    style={styles.icon}
                                    color={isFocus ? COLORS.primary : 'black'}
                                />
                                :
                                <BriefcaseBusiness
                                    size={20}
                                    style={styles.icon}
                                    color={isFocus ? COLORS.primary : 'black'}
                                />
                )}
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
        // padding: 16,
        marginBottom: 16,
    },
    dropdown: {
        // height: 60,
        backgroundColor: COLORS.white2,
        // borderColor: 'gray',
        borderWidth: 1, borderColor: '#e5e7eb',
        borderRadius: SIZES.medium,
        // paddingHorizontal: 8,
        padding: 16,
        fontFamily: FONT.regular,

    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        fontFamily: FONT.regular,
    },
    placeholderStyle: {
        fontSize: 16,
        fontFamily: FONT.regular,

    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: FONT.regular,

    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {

        fontSize: 16,
        // padding: 16,
        height: 50,
        margin: 10,
        color: 'black',

        borderRadius: SIZES.medium,
        fontFamily: FONT.regular,

    },
});