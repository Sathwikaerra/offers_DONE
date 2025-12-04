import { View, SafeAreaView, ScrollView, Alert, TouchableOpacity, FlatList, Image, Animated, Text, StyleSheet, Platform } from 'react-native';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COLORS, FONT } from '@/constants/theme';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { putData, fetchData } from '@/lib/axiosUtility';
import DropdownComponent from '@/components/ui/dropdown';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/config';

// Add this type definition at the top of your file, outside the component
type ImageItem = string | { imageUrl: string };

const EditAddress = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [businessName, setBusinessName] = useState('');
    const [GSTN, setGSTN] = useState('');
    const [description, setDescription] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [businessLogo, setBusinessLogo] = useState('');
    const [businessGallery, setBusinessGallery] = useState('');
    const [businessAddressOptions, setBusinessAddressOptions] = useState([]);
    const [selectedBusinessAddress, setSelectedBusinessAddress] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [businessAddressName, setBusinessAddressName] = useState('');
    const [businessAddressId, setBusinessAddressId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<string | null>(null) as any;
    const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
    const [error, setError] = useState('');
    const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );
    const saveBusinessProfile = async () => {
        if (!businessAddressOptions) {
            setError('Please select an address');
            snapToIndex(0);
            return;
        }
        if (!categoryOptions) {
            setError('Please select a category');
            snapToIndex(0);
            return;
        }
        if (!phoneNumber || isNaN(Number(phoneNumber))) {
            setError('Please enter a valid phone number');
            snapToIndex(0);
            return;
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            snapToIndex(0);
            return; // Return early
        }
        let galleryImages = [] as any
        if (selectedImages.length > 0) {
            if (typeof selectedImages[0] === 'object' && 'imageUrl' in selectedImages[0]) {
                // For existing images, format them into objects
                galleryImages = selectedImages as { imageUrl: string }[];
            } else {
                // For newly uploaded images, format them as { imageUrl: 'url' }
                galleryImages = await uploadGalleryImagesToFirebase(selectedImages as string[]);
            }
        }
        try {
            let logoUrl = '' as any;
            if (image.includes('http')) {
                logoUrl = image;
            } else {
                logoUrl = await uploadFeaturedImage(image);
            }
            const BusinessProfileData = {
                businessName: businessName,
                GSTN: GSTN,
                category: categoryId,
                categoryName: categoryName,
                description: description,
                phoneNumber: phoneNumber,
                email: email,
                website: website,
                businessLogo: businessLogo,
                businessGallery: businessGallery,
                location: selectedBusinessAddress, // Set the location ID
                locationName: businessAddressName,
                logo: logoUrl,
                businessPictureGallery: businessGallery,

            };

            const response = await putData(`/business/v1/${id}`, BusinessProfileData)

            if (response) {
                Alert.alert('Success', 'Business Profile Updated successfully.');
            }
        } catch (error) {
            console.error('Error updating address:', (error as Error).message);
            // Alert.alert(error?.response?.data?.message || 'Failed to update Business profile');
        }
        router.back();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Edit Business Profile",
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
    const fetchBusinessProfileDetails = async () => {
        try {
            const response = await fetchData(`/business/v1/${id}`);
           
            if (response) {
                setBusinessName(response.name);
                setGSTN(response.GSTIN);
                setDescription(response.description);
                setPhoneNumber(response.phoneNumber);
                setEmail(response.email);
                setWebsite(response.website);
                setBusinessLogo(response?.logo);
                setBusinessGallery(response?.businessPictureGallery);
                setBusinessAddressName(response?.location?.addressName || ''); // Set the address name
                setSelectedBusinessAddress(response?.location?._id || ''); // Set the address ID
                setBusinessAddressId(response?.location?._id || ''); // Set the business address ID
                setCategoryId(response?.category?._id);
                setCategoryName(response?.category?.name);
            }
        } catch (error) {
            console.error('Error fetching Business Profile details:', error);
            Alert.alert('Error', 'Failed to load Business Profile details');
        }
        try {
            const res = await fetchData("/user/v1/address/get/current") as any;
            const data = res?.data?.map((item: any) => {
                return {
                    label: item?.addressName + " - " + item?.landmark,
                    value: item?._id
                }
            })
            setBusinessAddressOptions(data);
        }
        catch (error) {
            console.log(error);
        }
        try {
            const responseCategory = await fetchData(`/categories/v1/all`);
            const data = responseCategory?.map((item: any) => {
                return {
                    label: item?.name,
                    value: item?._id
                }
            })
            setCategoryOptions(data);
        } catch (error) {
            console.error('Error fetching Category:', error);
            Alert.alert('Error', 'Failed to load Category');
        }
    };

    useEffect(() => {

        fetchBusinessProfileDetails();
    }, []);

    async function uploadFeaturedImage(uri: string): Promise<string> {
        setUploading(true)
        const fileName = new Date().getTime()

        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const storageRef = ref(storage, `BusinessProfileImages/logo/${fileName}`)

        try {
            const response = await fetch(uri)

            if (!response.ok) {
                throw new Error('Failed to fetch image')
            }

            const blob = await response.blob()

            const uploadTask = await uploadBytesResumable(storageRef, blob)

            setImage(await getDownloadURL(uploadTask.ref))
            setUploading(false)
            return await getDownloadURL(uploadTask.ref)


        } catch (error) {
            console.log('Error in uploadImageToFirebase:', error);
        }
    }

    const onPickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                //square
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                startAnimation();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image.');
        }
    };

    const uploadGalleryImagesToFirebase = async (images: string[]): Promise<{ imageUrl: string }[]> => {
        try {
            setUploading(true)
            const uploadPromises = images.map(async (image) => {
                const fileName = new Date().getTime(); // Unique name for each image
                const storageRef = ref(storage, `OffersImages/gallery/${fileName}`);

                const blob: Blob = await fetch(image).then(res => res.blob());

                // Upload the image to Firebase Storage
                const uploadTask = await uploadBytesResumable(storageRef, blob);

                // Get the download URL after the upload
                const downloadURL = await getDownloadURL(uploadTask.ref);

                // Return the imageUrl object format directly
                return { imageUrl: downloadURL };
            });

            // Wait for all uploads to finish
            const uploadedImages = await Promise.all(uploadPromises);
            setSelectedImages(uploadedImages)
            setUploading(false)
           
            return uploadedImages; // This will be an array of { imageUrl: 'url' }

        } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error('Failed to upload images to Firebase');
        }
    };

    const galleryPickImage = async () => {
        try {

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                // allowsEditing: true,
                allowsMultipleSelection: true,
                aspect: [1, 1],
                selectionLimit: 3,
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImages(result.assets.map((asset) => asset.uri));

            }

        }
        catch (error) {
            Alert.alert('Error', 'Failed to pick image.');
        }
    }

    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(animation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };

    const animatedStyle = {
        opacity: animation,
        transform: [
            {
                scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                }),
            },
        ],
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Input
                        label
                        required
                        labelTitle="Business Name"
                        placeholder="e.g. Main Branch"
                        type="text"
                        disabled={true}
                        value={businessName}
                        onTextChange={setBusinessName}
                    />
                    <Input
                        label
                        required
                        labelTitle="GSTN"
                        placeholder="e.g. 1234567890"
                        type="text"
                        disabled={true}
                        value={GSTN}
                        onTextChange={setGSTN}
                    />
                    <DropdownComponent
                        required
                        isAddressType={true}
                        label={`${businessAddressName ? businessAddressName : 'Select Business Address'}`} // Display the selected address name as the label
                        data={businessAddressOptions} // List of address options
                        value={selectedBusinessAddress} // Ensure this value is correctly set to the selected address ID
                        onChange={(item: any) => {
                          
                            setSelectedBusinessAddress(item.value); // Update the selected address ID
                            setBusinessAddressId(item.value); // Update the businessAddressId as well
                            // Find the address name from the options list based on the selected ID and set it.
                            const selectedAddress = businessAddressOptions.find(option => option.value === item.value);
                            setBusinessAddressName(selectedAddress?.label || ''); // Update the address name label
                        }}
                    />
                    <DropdownComponent
                        required
                        labelTitle="Offer Category"
                        isCategory={true}
                        label={`${categoryName ? categoryName : 'Select Category'}`}
                        data={categoryOptions}
                        value={categoryId} // Bind the dropdown value to `categoryId`
                        onChange={(item: any) => {
                        
                            setCategoryId(item.value); // Ensure `categoryId` is updated when a category is selected
                            setSelectedCategory(item.value); // Also update `selectedCategory` if necessary
                        }}
                    />
                    <Input
                        label
                        labelTitle="Business Description"
                        placeholder="e.g. 123 Main St, Banjara Hills"
                        type="text"
                        value={description}
                        onTextChange={setDescription}
                    />
                    <Input
                        label
                        required
                        labelTitle="Phone Number"
                        placeholder="e.g. 9876543210"
                        type="text"
                        value={phoneNumber}
                        onTextChange={setPhoneNumber}
                    />
                    <Input
                        label
                        required
                        labelTitle="Email"
                        placeholder="e.g. example@gmail.com"
                        type="text"
                        value={email}
                        onTextChange={setEmail}
                    />
                    <Input
                        label
                        labelTitle="Website"
                        placeholder="e.g. www.example.com"
                        type="text"
                        value={website}
                        onTextChange={setWebsite}
                    />
                    <View style={{ flex: 1, marginBottom: 50, width: '100%' }}>
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                            <TouchableOpacity
                                disabled={uploading}
                                onPress={onPickImage} style={[styles.logouploadContainer, { opacity: uploading ? 0.5 : 1 }]}>
                                {image && typeof image === 'string' ? (
                                    <Animated.View style={[styles.logoContainer, animatedStyle]}>
                                        <Image source={{ uri: image }} style={styles.logo} />
                                    </Animated.View>
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Text style={styles.placeholderText}>Edit Business Logo</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <Text
                                onPress={onPickImage}
                                disabled={uploading}
                                style={[styles.uploadText, { opacity: uploading ? 0.5 : 1 }]}>{image ? 'Change Image' : 'Upload Business Logo'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                            <Text numberOfLines={2} style={{ fontFamily: FONT.bold, width: '60%', fontSize: 20, marginBottom: 10 }}>Edit Gallery Images {selectedImages.length} / 3</Text>
                            <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                                {selectedImages.length > 0 ?

                                    <Button label="Remove" variant="default" onPress={() => setSelectedImages([])} disabled={uploading} />
                                    : <Button label="Add" variant="default" onPress={galleryPickImage} disabled={uploading} />
                                }
                            </View>
                        </View>

                        <FlatList
                            data={selectedImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={{ width: 200, height: 200, opacity: uploading ? 0.5 : 1, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 10, marginRight: 10 }}>
                                    <Image source={{ uri: item }} style={styles.image} />
                                </View>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 20 }}
                        />
                    </View>
                    <View>
                        <Button
                            label="Update Business Profile"
                            variant="default"
                            onPress={saveBusinessProfile}
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

const styles = StyleSheet.create({
    logouploadContainer: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.gray,
        borderRadius: 16,
        width: 100,
        height: 100,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    logoContainer: {
        width: 100,
        height: 100,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,

    },
    logo: {
        width: 100,
        height: 100,
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,

        height: 100,
    },
    placeholderText: {
        color: COLORS.gray,
        fontSize: 16,
        fontFamily: FONT.regular,
    },
    uploadText: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLORS.primary,
    },
});



export default EditAddress;