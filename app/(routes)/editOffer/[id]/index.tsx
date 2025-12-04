import { View, SafeAreaView, ScrollView, Alert, TouchableOpacity, Platform, Text, Animated, Image, FlatList, StyleSheet } from 'react-native';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { putData, fetchData } from '@/lib/axiosUtility';
import DropdownComponent from '@/components/ui/dropdown';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { storage } from '@/firebase/config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';


// Add this constant at the top of your file, after the imports
const offerTypeOptions = [
    { label: 'Discount', value: 'discount' },
    { label: 'Buy-One-Get-One', value: 'buy-one-get-one' },
    { label: 'Free-Shipping', value: 'free-shipping' },
    { label: 'other', value: 'other' },
    // Add more offer types as needed
];
type ImageItem = string | { imageUrl: string };


// Update this type definition
const EditOffer = () => {
    const { id } = useLocalSearchParams();
    const animation = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const [offerTitle, setOfferTitle] = useState('');
    const [description, setDescription] = useState('');
    const [offerExpiryDate, setOfferExpiryDate] = useState('');
    const [offerImage, setOfferImage] = useState('');
    const [offerGallery, setOfferGallery] = useState('');
    const [offerType, setOfferType] = useState('');
    const [offerValue, setOfferValue] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<string | null>(null) as any;
    const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
    const snapPoints = useMemo(() => ['35%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );


    const fetchOfferDetails = async () => {
        try {
            const response = await fetchData(`/offer/v1/${id}`);
            if (response) {
                setOfferTitle(response.title);
                setCategoryId(response?.category?._id);
                setCategoryName(response?.category?.name);
                setDescription(response.description);
                setOfferExpiryDate(response.offerExpiryDate);
                setOfferType(response.offerType);
                setOfferValue(response.offerValue);
                setOfferDetails(response.offerDetails);

            }
        } catch (error) {
            console.error('Error fetching Offer details:', error);
            Alert.alert('Error', 'Failed to load Offer details');
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

    const updateOffer = async () => {
        if (!offerTitle) {
            setError('Please enter an offer title');
            snapToIndex(0);
            return;
        }
        if (!categoryId) {
            setError('Please select a category');
            snapToIndex(0);
            return;
        }
        if (!offerType) {
            setError('Please select an offer type');
            snapToIndex(0);
            return;
        }
        if (!offerExpiryDate) {
            setError('Please select an offer expiry date');
            snapToIndex(0);
            return;
        }
        if (offerType === 'discount') {
            if (!offerValue || isNaN(Number(offerValue))) {
                setError('Offer Value is required and must be a number for discount type')
                snapToIndex(0);
                return;
            }
        }
        if (!offerDetails) {
            setError('Please enter offer details');
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
            let featuredImageUrl = '' as any;
            if (image && typeof image === 'string') {
                if (image.includes('http')) {
                    // If the image is already a valid URL, just use it
                    featuredImageUrl = image;
                } else {
                    // If the image is a new file, upload it and get the new URL
                    featuredImageUrl = await uploadFeaturedImage(image);
                    if (!featuredImageUrl) {
                        setError('Image upload failed or returned an empty URL');
                        snapToIndex(0);
                        return;
                    }
                }
            }
            const offerData = {
                title: offerTitle,
                category: categoryId,
                categoryName: categoryName,
                description: description,
                offerExpiryDate: offerExpiryDate,
                offerType: offerType,
                offerValue: offerValue,
                offerDetails: offerDetails,
                gallery: galleryImages,
                featuredImage: featuredImageUrl,
            };
            const response = await putData(`/offer/v1/${id}`, offerData);
            if (response) {
                Alert.alert('Success', 'Offer Updated successfully.');
            }
        } catch (error) {
            console.error('Error updating Offer:', (error as Error).message);
        }
        router.back();

    };

    const [show, setShow] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Edit Ad",
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
        fetchOfferDetails();
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

        const storageRef = ref(storage, `OffersImages/featured/${fileName}`)

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
                        labelTitle="Offer Title"
                        placeholder="e.g. Main Branch"
                        type="text"
                        value={offerTitle}
                        onTextChange={setOfferTitle}
                    />
                    <DropdownComponent
                        required
                        labelTitle="Offer Type"
                        isOfferType={true}
                        label={`${offerType ? offerType : 'Select Offer Type'}`}
                        data={offerTypeOptions as any}
                        value={offerType}
                        onChange={(item: any) => setOfferType(item.value)}
                    />
                    <DropdownComponent
                        required
                        labelTitle="Offer Category"
                        isCategory={true}
                        label={`${categoryName ? categoryName : 'Select Offer Category'}`}
                        data={categoryOptions}
                        value={categoryId}
                        onChange={(item: any) => setSelectedCategory(item.value)}
                    />
                    <Input
                        label
                        labelTitle="Offer Description"
                        placeholder="Type here..."
                        type="text"
                        value={description}
                        onTextChange={setDescription}
                    />
                    {Platform.OS === "android" && <TouchableOpacity onPress={() => setShow(true)}>
                        <Input
                            required
                            type="text"
                            label
                            labelTitle="Offer Expiry Date"
                            placeholder='e.g. 2024-12-31'
                            value={offerExpiryDate ? new Date(offerExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            onTextChange={() => { }}
                            style={{ opacity: 0.8 }}
                            editable={false}
                        />

                    </TouchableOpacity>}
                    {Platform.OS === "ios"
                        ? (
                            <View style={{ opacity: 1 }}>
                                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.gray }}>Offer Expiry Date</Text>

                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={offerExpiryDate ? new Date(offerExpiryDate) : new Date()}
                                    mode="date"
                                    textColor={COLORS.primary}
                                    minimumDate={new Date()}
                                    accentColor={COLORS.primary}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        const currentDate = selectedDate || new Date();
                                        setShow(false);
                                        setOfferExpiryDate(currentDate.toISOString().split('T')[0]);
                                    }}
                                />
                            </View>
                        ) : (
                            show &&
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={offerExpiryDate ? new Date(offerExpiryDate) : new Date()}
                                mode="date"
                                minimumDate={new Date()}
                                textColor={COLORS.primary}
                                accentColor={COLORS.primary}
                                collapsable={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || new Date();
                                    setShow(false);
                                    setOfferExpiryDate(currentDate.toISOString().split('T')[0]);
                                }}
                            />
                        )}
                    <Input
                        required
                        label
                        labelTitle="Offer Details"
                        placeholder="Type here..."
                        type="text"
                        value={offerDetails}
                        onTextChange={setOfferDetails}
                    />
                    <Input
                        label
                        labelTitle="Offer Value"
                        placeholder="e.g. 10%"
                        type="text"
                        value={offerValue}
                        onTextChange={setOfferValue}
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
                                        <Text style={styles.placeholderText}>Edit Offer Feature Image</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <Text
                                onPress={onPickImage}
                                disabled={uploading}
                                style={[styles.uploadText, { opacity: uploading ? 0.5 : 1 }]}>{image ? 'Change Image' : 'Upload Featured Image'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                            <Text numberOfLines={2} style={{ fontFamily: FONT.bold, width: '60%', fontSize: 20, marginBottom: 10 }}>Edit Offer Gallery Images {selectedImages.length} / 3</Text>
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
                    <View style={{ marginTop: 20 }}>
                        <Button
                            label="Update Offer"
                            variant="default"
                            onPress={updateOffer}
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


export default EditOffer;
