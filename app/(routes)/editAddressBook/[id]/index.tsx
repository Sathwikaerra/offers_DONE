import { View, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COLORS, FONT } from '@/constants/theme';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { putData, fetchData } from '@/lib/axiosUtility';
import DropdownComponent from '@/components/ui/dropdown';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';


const EditAddress = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [currentCoordinates, setCurrentCoordinates] = useState({ latitude: 0, longitude: 0 });
    const [addressLandmark, setAddressLandmark] = useState('');
    const [city, setCity] = useState('');
    const [stateProvince, setStateProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [addressName, setAddressName] = useState('');
    const [addressType, setAddressType] = useState('');
    const [addressLine, setAddressLine] = useState('');
    const [error, setError] = useState('');
    const snapPoints = useMemo(() => ['35%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );


    // Address type options
    const AddressType = [
        { label: 'Home', value: 'home' },
        { label: 'Office', value: 'office' },
        { label: 'Other', value: 'other' },
    ];

    const saveAddress = async () => {

        if (!addressName) {
            setError('Please enter address name');
            snapToIndex(0);
            return;
        }
        if (!addressType) {
            setError('Please enter an address type');
            snapToIndex(0);
            return;
        }
        if (!city) {
            setError('Please enter city');
            snapToIndex(0);
            return;
        }
        if (!stateProvince) {
            setError('Please enter state');
            snapToIndex(0);
            return;
        }
        if (!postalCode || isNaN(Number(postalCode))) {
            setError('Please enter pin code');
            snapToIndex(0);
            return;
        }

        try {
            const addressData = {
                addressType: addressType,
                addressLine1: addressLine,
                landmark: addressLandmark,
                city: city,
                state: stateProvince,
                pincode: postalCode,
                country: country,
                addressName: addressName,
            };

            const response = await putData(`/user/v1/address/update/${id}`, addressData);

            if (response) {
                Alert.alert('Success', 'Address Edited successfully.');
            }
        } catch (error) {
            console.error('Error updating address:', (error as Error).message);


        }
        router.back();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Edit Address",
            headerBackTitleVisible: true,
            headerLargeTitle: true,
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: COLORS.white },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerShadowVisible: false,
            animationDuration: Platform.OS === "android" ? undefined : 200,
        });
    }, [navigation]);
    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                const response = await fetchData(`/user/v1/address/${id}`);
              
                if (response) {
                    setAddressType(response.addressType);
                    setAddressName(response.addressName);
                    setAddressLine(response.addressLine);
                    setAddressLandmark(response.landmark);
                    setCity(response.city);
                    setStateProvince(response.state);
                    setPostalCode(response.pincode);
                    setCountry(response.country);
                    if (response.coordinates && response.coordinates.coordinates) {
                        setCurrentCoordinates({
                            longitude: response.coordinates.coordinates[0],
                            latitude: response.coordinates.coordinates[1]
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching address details:', error);
                Alert.alert('Error', 'Failed to load address details');
            }
        };

        fetchAddressDetails();
    }, [id]);

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <DropdownComponent
                        onChange={(item: any) => {
                            setAddressType(item.value);
                        }
                        }
                        required
                        isAddressType={true}
                        label={`${addressType ? addressType : 'Select Address Type'}`}
                        data={AddressType as any}
                        value={addressType}
                    />
                    <Input
                        label
                        required
                        labelTitle="Address Name"
                        placeholder="e.g. Main Branch"
                        type="text"
                        value={addressName}
                        onTextChange={setAddressName}
                    />
                    <Input
                        label
                        labelTitle="Address Line"
                        placeholder="e.g. 123 Main St, Banjara Hills"
                        type="text"
                        value={addressLine}
                        onTextChange={setAddressLine}
                    />
                    <Input
                        label
                        labelTitle="Address Landmark"
                        placeholder="e.g Near XYZ School"
                        type="text"
                        value={addressLandmark}
                        onTextChange={setAddressLandmark}
                    />
                    <Input
                        label
                        required
                        labelTitle="City"
                        placeholder="e.g. Hyderabad"
                        type="text"
                        value={city}
                        onTextChange={setCity}
                    />
                    <Input
                        label
                        required
                        labelTitle="State/Province"
                        placeholder="e.g. Telangana"
                        type="text"
                        value={stateProvince}
                        onTextChange={setStateProvince}
                    />
                    <Input
                        label
                        required
                        labelTitle="Pin Code"
                        placeholder="e.g. 500081"
                        type="number"
                        value={postalCode}
                        onTextChange={setPostalCode}
                    />
                    <Input
                        label
                        labelTitle="Country"
                        placeholder="e.g. India"
                        type="text"
                        value={country}
                        disabled={true}
                        onTextChange={setCountry}
                    />
                    <View style={{ marginTop: 20 }}>
                        <Button
                            label="Save Address"
                            variant="default"
                            onPress={saveAddress}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
            <BottomSheetComponent title={error} bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} handleClosePress={handleClosePress} >
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 10, padding: 20 }}>
                        <View style={{ flex: 1 }}>
                            <Button label='Okay' onPress={() => {
                                handleClosePress();
                            }} variant='default' />
                        </View>
                    </View>
                </View>
            </BottomSheetComponent>
        </>
    );
};

export default EditAddress;
