import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Animated, Image, StyleSheet, Alert } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import SearchComponent from '../SearchComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { fetchData, postData } from '@/lib/axiosUtility';
import CategoriesCard from '../Create/CategoriesCard';
import * as ImagePicker from 'expo-image-picker';
import { CheckBadgeIcon } from 'react-native-heroicons/solid';
import DropdownComponent from '../ui/dropdown';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { router } from 'expo-router';
import { BottomSheetComponent } from '../bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';


const CreateBusinessProfileForm: React.FC = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3; // Adjust as needed
    const [searchValue, setSearchValue] = useState('');
    const [categories, setCategories] = useState<any[]>([]); // Initialize with your categories data
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [businessProfile, setBusinessProfile] = useState('');
    const [name, setName] = useState('');
    const [GSTIN, setGSTIN] = useState('');
    const [userId, setUserId] = useState('');
    const [offers, setOffers] = useState('')
    const [businessPictureId, setBusinessPictureId] = useState('');
    const [website, setWebsite] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [socialMedia, setSocialMedia] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
    });
    const [isCreated, setIsCreated] = useState(false);
    const [location, setLocation] = useState('');
    const [Addresses, setAddresses] = useState('');
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState<string | null>(null) as any;
    const [error, setError] = useState('');
    const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const getCategories = async () => {
        try {
            const res = await fetchData(`/categories/v1/all`) as any;
            setCategories(res);

        }
        catch (error) {
            console.log(error);
        }
    }

    const getLocations = async () => {
        try {
            const res = await fetchData(`/user/v1/address/get/current`) as any;
            const data = res?.data?.map((item: any) => {
                return {
                    label: item?.addressName + " - " + item?.landmark,
                    value: item?._id
                }
            })
            setAddresses(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategories();
        getLocations();
    }, []);

    const onStepChange = (step: number) => {
        setCurrentStep(step);
    };

    const onSearch = (value: string) => {
        setSearchValue(value);
        // Implement search logic here
    };

    const renderCategories = ({ item }: any) => (
        <View style={{ flex: 1, margin: 5 }}>

            {item ? (
                <CategoriesCard
                    selected={category === item._id}
                    onSelect={() => {
                        setCategory(item._id)
                    }}
                    fullWidth
                    id={item.id}
                    title={item.name}
                    image={item.categoryImgUrl}
                />
            ) : (
                <View style={{ flex: 1 }} />
            )}
        </View>
    );


    async function uploadFeaturedImage(uri: string): Promise<string> {
        setUploading(true);
        const fileName = new Date().getTime();

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

            const downloadURL = await getDownloadURL(uploadTask.ref)
            setImage(downloadURL)
            setUploading(false)
            return downloadURL
        } catch (error) {
            console.log('Error in uploadImageToFirebase:', error);
            setUploading(false);
            throw error; // Ensure the function always returns a string or throws an error
        }
    }

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);

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
                setUploadedImages(result.assets.map((asset) => {
                    return { imageUrl: asset.uri };
                }
                ));
            }

        }
        catch (error) {
            Alert.alert('Error', 'Failed to pick image.');
        }
    }

    useEffect(() => {
        if (selectedImages[0]?.imageUrl?.includes('http')) {
            
            setUploadedImages(selectedImages);
        } else {
            setUploadedImages(
                selectedImages.map((image) => {
                    return { imageUrl: image };
                })
            );
          
        }
    } , [selectedImages]);

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


    const formatData = (data: any[], numColumns: number) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push(null);
            numberOfElementsLastRow++;
        }

        return data;
    };

  
    const onSubmit = async () => {
        let businessLogo
        let galleryImages = [] as any
        // Handle featured image (logo)

    if (image?.includes('http')) {
        // If the image is already a URL, use it
        businessLogo = image;
    } else {
        // Otherwise, upload the new image and get the URL
        businessLogo = await uploadFeaturedImage(image as any);
    }
    // Handle gallery images
    if (selectedImages.length > 0) {
        if (selectedImages[0]?.imageUrl?.includes('http')) {
            // If gallery images are already URLs, use them directly
            galleryImages = selectedImages;
        } else {
            // Otherwise, upload the new gallery images and get their URLs
            galleryImages = await uploadGalleryImagesToFirebase(selectedImages);
        }
    }
    try {
        // Prepare payload for the request
        const payload = {
            name,
            description,
            GSTIN,
            offers,
            website,
            phoneNumber,
            email,
            socialMedia,
            category,
            userId,
            addressId: location,
            logo: businessLogo,
            businessPictureId,
            businessProfile,
            businessPictureGallery: galleryImages,
        };

        // Make the request
        const response = await postData('/business/v1/create', payload);

        if (response) {
            setIsCreated(true);
        }
    } catch (error: any) {
        // Handle errors
        console.error(error);
        setError(error?.response?.data?.msg);
        snapToIndex(1);
    }


    }

    const handleNextClick = () => {
        if (!name) {
            setError('Please enter the business name');
            snapToIndex(0);
            return;
        }
        if (!GSTIN) {
            setError('Please enter a valid GSTIN');
            snapToIndex(0);
            return;
        }
        if (!location) {
            setError('Please select an address');
            snapToIndex(0);
            return;
        }
        if (!phoneNumber || isNaN(Number(phoneNumber))) {
            setError('Please enter a valid phone number');
            snapToIndex(0);
            return; // Return early
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            snapToIndex(0);
            return; // Return early
        }
        // If all checks pass, move to the next step
        onStepChange(3);
    };


    return (
        isCreated ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, margin: 20, gap: 20 }}>
                <CheckBadgeIcon size={100} color={COLORS.primary} />
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontFamily: FONT.bold, fontSize: 24, color: COLORS.primary }}>Business Profile Created</Text>
                    <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.gray }}>Your business profile has been created successfully.</Text>
                </View>
                <Button label="Go to My Businesses" variant="default" onPress={() => router.push('/(routes)/myBusinessProfiles')} />
            </View>
            :
            <SafeAreaView style={{ flex: 1, position: 'relative', backgroundColor: COLORS.white }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, marginBottom: 20, width: "100%" }}>
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <View key={index} style={{
                            width: 100,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: index + 1 <= currentStep ? COLORS.primary : COLORS.gray,
                            marginHorizontal: 5
                        }} />
                    ))}
                </View>

                <ScrollView style={{ padding: 20, position: 'relative' }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontFamily: FONT.bold, fontSize: 20, marginBottom: 10 }}>{currentStep === 1 ? 'Create Business Profile' : 'Enter details'}</Text>
                        {currentStep === 1 && (
                            <SearchComponent
                                value={searchValue}
                                placeholder="Search..."
                                onChangeText={(value) => onSearch(value)}
                            />
                        )}
                    </View>

                    {currentStep === 1 && (
                        <FlatList
                            data={formatData(categories, 2)}
                            keyExtractor={(item, index) => (item ? item._id.toString() : index.toString())}
                            numColumns={2}
                            scrollEnabled={false}
                            renderItem={renderCategories}
                            style={{ paddingBottom: 200 }}
                        />
                    )}

                    {currentStep === 2 && (
                        <View style={{ marginBottom: 200 }}>
                            <Input label required
                                message="Business Name must match the legal name or brand name on GSTIN."
                                labelTitle="Enter Business Name" placeholder='e.g. XYZ Business' value={name} onChangeText={(value) => setName(value)} />
                            <Input type='description' label labelTitle="Enter Business Description" placeholder='e.g. Leading edge solutions.' value={description} onChangeText={(value) => setDescription(value)} />
                            <Input label required labelTitle="Enter GSTIN" placeholder='e.g. 27AAEPM0111C1Z' value={GSTIN} onChangeText={(value) => setGSTIN(value)} />
                            <DropdownComponent
                                required
                                isAddressType label="Select Address"
                                data={Addresses as any}
                                value={location}
                                onChange={(item) => {
                                   
                                    setLocation(item?.value)
                                }
                                }
                            />
                            <Input label labelTitle="Website" placeholder='e.g. https://www.abcd.com' value={website} onChangeText={(value) => setWebsite(value)} />
                            <Input label required labelTitle="Phone Number" type='phone' placeholder='e.g. +1-234-567-890' value={phoneNumber} onChangeText={(value) => setPhoneNumber(value)} />
                            <Input label required labelTitle="Email" type='email' placeholder='e.g. info@abcd.com' value={email} onChangeText={(value) => setEmail(value)} />
                            <Input label labelTitle="Facebook" placeholder='e.g. facebook.com/abcd' value={socialMedia.facebook} onChangeText={(value) => setSocialMedia({ ...socialMedia, facebook: value })} />
                            <Input label labelTitle="Twitter" placeholder='e.g. twitter.com/abcd' value={socialMedia.twitter} onChangeText={(value) => setSocialMedia({ ...socialMedia, twitter: value })} />
                            <Input label labelTitle="LinkedIn" placeholder='e.g. linkedin.com/company/abcd' value={socialMedia.linkedin} onChangeText={(value) => setSocialMedia({ ...socialMedia, linkedin: value })} />
                            <Input label labelTitle="Instagram" placeholder='e.g. instagram.com/abcd' value={socialMedia.instagram} onChangeText={(value) => setSocialMedia({ ...socialMedia, instagram: value })} />

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', gap: 6, alignItems: 'center', marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => onStepChange(1)}
                                    activeOpacity={0.8}
                                    style={{ width: '15%', height: '100%', borderRadius: 12, flexDirection: 'row', backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <ChevronLeft size={24} color={COLORS.white} />
                                </TouchableOpacity>
                                <View style={{ width: '83%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        label="Next"
                                        variant="default"// Disable button if form is invalid
                                        onPress={handleNextClick} // Validate when the user presses the button
                                    />
                                </View>
                            </View>

                        </View>

                    )}

                    {currentStep === 3 && (
                        <View style={{ flex: 1, marginBottom: 200, width: '100%' }}>
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
                                            <Text style={styles.placeholderText}>Add Business Logo</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <Text
                                    onPress={onPickImage}
                                    disabled={uploading}
                                    style={[styles.uploadText, { opacity: uploading ? 0.5 : 1 }]}>{image ? 'Change Image' : 'Upload Business Logo'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                <Text numberOfLines={2} style={{ fontFamily: FONT.bold, width: '60%', fontSize: 20, marginBottom: 10 }}>Add Gallery Images {selectedImages.length} / 3</Text>
                                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                                    {selectedImages.length > 0 ?

                                        <Button label="Remove" variant="default" onPress={() => setSelectedImages([])} disabled={uploading} />
                                        : <Button label="Add" variant="default" onPress={galleryPickImage} disabled={uploading} />
                                    }
                                </View>
                            </View>

                       {uploadedImages &&     <FlatList
                                data={uploadedImages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={( item:any ) => (
                                    <View style={{ width: 200, height: 200, opacity: uploading ? 0.5 : 1, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 10, marginRight: 10 }}>
                               
                                    <Image source={{ uri: item?.item?.imageUrl}} style={styles.image} />
                                    </View>
                                )}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginTop: 20 }}
                            /> }
                            <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', gap: 6, alignItems: 'center', marginTop: 20 }}>

                                <TouchableOpacity
                                    onPress={() => onStepChange(2)}
                                    activeOpacity={0.8}
                                    disabled={uploading}

                                    style={{ width: '15%', height: '100%', borderRadius: 12, opacity: uploading ? 0.5 : 1, flexDirection: 'row', backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <ChevronLeft size={24} color={COLORS.white} />
                                </TouchableOpacity>
                                <View style={{ width: '83%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button label={uploading ? 'Uploading...' : image ? 'Upload & Submit' : 'Submit'} variant="default" onPress={() => onSubmit()} disabled={uploading} />
                                </View>
                            </View>

                        </View>
                    )}
                </ScrollView>
                {currentStep === 1 && (category) && (
                    <LinearGradient
                        colors={['#f3f4f852', COLORS.white]}
                        style={styles.gradientContainer}
                    >
                        <Button label="Next" variant="default" onPress={() => onStepChange(2)} />
                    </LinearGradient>
                )}
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
            </SafeAreaView >
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
    uploadContainer: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.gray,
        borderRadius: 16,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 200,
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
    imageContainer: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
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
    gradientContainer: {
        //mid
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        bottom: 100,
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    backButtonText: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLORS.primary,
    },
});

export default CreateBusinessProfileForm;
