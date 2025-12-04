import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Animated, Image, StyleSheet, Platform } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import SearchComponent from '../SearchComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchData, postData } from '@/lib/axiosUtility';
import CategoriesCard from './CategoriesCard';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import DropdownComponent from '../ui/dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBadgeIcon } from 'react-native-heroicons/solid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { BottomSheetComponent } from '../bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';


const offerTypes = [
    { label: 'Discount', value: 'discount' },
    { label: 'free-shipping', value: 'free-shipping' },
    { label: 'Buy One Get One', value: 'buy-one-get-one' },
    { label: 'other', value: 'other' },
];

export const CreateAdvertiseForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const [searchValue, setSearchValue] = useState('');
    const [selectedBusinessProfile, setSelectedBusinessProfile] = React.useState('') as any;
    const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
    const [datePicker, setDatePicker] = useState()
    const [categories, setCategories] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [offerType, setOfferType] = useState('');
    const [offerValue, setOfferValue] = useState('');
    const [category, setCategory] = useState('');
    const [offerExpiryDate, setOfferExpiryDate] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [businessProfile, setBusinessProfile] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const animation = useRef(new Animated.Value(0)).current;
    const [isCreated, setIsCreated] = useState(false);
    const [uploading, setUploading] = useState(false);
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
    const res = await fetchData(`/categories/v1/all`);
    
    // If backend returns { ok: true, data: [...] }
    const categories = res.data || res;
    
    setCategories(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
  }
};
const getAllBusinessProfiles = async () => {
  try {
    const res = await fetchData(`/business/v1/get/current`);
    const data = res.data ?? res;

    if (data.empty) {
      console.log("No business profiles yet");
      setBusinessProfiles([]);
      return;
    }

    const profilesArray: any[] = Array.isArray(data?.businessProfiles)
      ? data.businessProfiles
      : Array.isArray(data)
      ? data
      : [];

    // Map to { label, value } for DropdownComponent
    const dropdownProfiles = profilesArray.map(profile => ({
      label: profile.name,
      value: profile._id,
    }));

    console.log('Dropdown Profiles:', dropdownProfiles);

    setBusinessProfiles(dropdownProfiles);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load business profiles";

    console.log("Error Fetching Business Profiles:", message);
    setBusinessProfiles([]); // fallback
  }
};

    useEffect(() => {
        getCategories()
        getAllBusinessProfiles()

    }, []);

    const onStepChange = (step: number) => {
        setCurrentStep(step);
    };



    const onSearch = (value: string) => {
        setSearchValue(value);
        
        const filteredCategories = categories.filter(category =>
            category?.name?.toLowerCase()?.includes(value?.toLowerCase())
        );
        setCategories(filteredCategories);
        if (filteredCategories.length === 0) {
            setCategories(categories);
        }
        if (value === '') {
            setCategories(categories);
        }
    };


    const [selectedImages, setSelectedImages] = useState<string[]>([]) as any
    const [uploadedImages, setUploadedImages] = useState<any[]>([]) as any 
const renderCategories = ({ item }: any) => (  
  <View style={{ flex: 1, margin: 5 }}>
    {item ? (
      <CategoriesCard 
        selected={category === item._id}
        onSelect={() => setCategory(item._id)}
        fullWidth
        id={item._id}
        title={item.name}
        image={item.categoryImgUrl} // ✅ always available
      />
    ) : (
      <View style={{ flex: 1 }} />
    )}
  </View>
);
    const onPickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
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

        const storageRef = ref(storage, `OffersImages/featured/${fileName}`)

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
            setUploadedImages(uploadedImages)
            setUploading(false)
            return uploadedImages; // This will be an array of { imageUrl: 'url' }

        } catch (error) {
            console.error('Error uploading images:', error);
            throw new Error('Failed to upload images to Firebase');
        }
    };

    const uploadVideoToFirebase = async (uri: string): Promise<string> => {
        try {
            setUploading(true)
            const fileName = new Date().getTime();

            const storageRef = ref(storage, `OffersImages/videos/${fileName}`)

            const response = await fetch(uri)

            if (!response.ok) {
                throw new Error('Failed to fetch video')
            }

            const blob = await response.blob()

            const uploadTask = await uploadBytesResumable(storageRef, blob)

            const downloadURL = await getDownloadURL(uploadTask.ref)

            setUploading(false)
            return downloadURL
        } catch (error) {
            
        }
    }

    const onSubmit = async () => {
        console.log('selectedImages', selectedImages)
        let featuredImage
        let galleryImages = [] as any
      
        if (image?.includes('http')) {
            featuredImage = image
        } else {
            featuredImage = await uploadFeaturedImage(image as any)
        }

        // Handle gallery images
        if (selectedImages.length > 0) {
            if (selectedImages[0]?.imageUrl?.includes('http')) {
                // For existing images, format them into objects
                galleryImages = selectedImages
            } else {
                // For newly uploaded images, format them as { imageUrl: 'url' }
                galleryImages = await uploadGalleryImagesToFirebase(selectedImages);

            }
        }
            try {
                const payload = {
                    title: title,
                    description: description,
                    offerType: offerType.toLowerCase(),
                    offerValue: offerValue,
                    category: category,
                    businessProfile: selectedBusinessProfile,
                    offerDetails: offerDetails,
                    offerExpiryDate: offerExpiryDate,
                    gallery: galleryImages,
                    featuredImage: featuredImage,
                }
                const response = await postData('/offer/v1/create', payload);
                
                if (response) {
                    setIsCreated(true);
                }
            } catch (error: any) {
                console.log(error)
                Alert.alert(error?.response?.data?.message)
            }
        
    };

    useEffect(() => {
        if (selectedImages[0]?.imageUrl?.includes('http')) {
            setUploadedImages(selectedImages);
        } else {
            setUploadedImages(
                selectedImages.map((image:any) => {
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

    const [show, setShow] = useState(false);


const formatData = (data: any[], numColumns: number) => {
  const newData = [...data]; // copy so original categories is safe
  const numberOfFullRows = Math.floor(newData.length / numColumns);
  let numberOfElementsLastRow = newData.length - numberOfFullRows * numColumns;

  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    newData.push(null);
    numberOfElementsLastRow++;
  }
  return newData;
};
    // Validation function to check if all fields are filled

    const handleNextClick = () => {
        if (!title) {
            setError('Please enter an offer title');
            snapToIndex(0);
            return; // Return early
        }
        if (!selectedBusinessProfile) {
            setError('Please select a business profile');
            snapToIndex(0);
            return; // Return early
        }
        if (!offerType) {
            setError('Please select an offer type');
            snapToIndex(0);
            return; // Return early
        }
        if (!description) {
            setError('Please enter description');
            snapToIndex(0);
            return;
        }
        if (!offerExpiryDate) {
            setError('Please select an offer expiry date');
            snapToIndex(0);
            return; // Return early
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
        // If all checks pass, move to the next step
        onStepChange(3);
    };


    return (
        isCreated ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, margin: 20, gap: 20 }}>
                <CheckBadgeIcon size={100} color={COLORS.primary} />
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontFamily: FONT.bold, fontSize: 24, color: COLORS.primary }}>Offer Ad Created</Text>
                    <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.gray }}>Your offer ad has been created successfully.</Text>
                </View>
                <Button label="Go to My Ads" variant="default" onPress={() => router.push('/(routes)/MyAds')} />
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

                <ScrollView style={{ flex: 1, padding: 20, position: 'relative' }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontFamily: FONT.bold, fontSize: 20, marginBottom: 10 }}>{currentStep === 1 ? 'Select a category' : 'Enter details'}</Text>
                        {currentStep === 1 && (
                            <SearchComponent

                                value={searchValue}
                                placeholder="search.."
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

                        <View style={{ marginBottom: 200, gap: 10 }}>
                            <View style={{ width: '100%' }}>
                                {/* <Text style={[tw`text-sm `, { fontFamily: FONT.medium, color: COLORS.gray }]}>Select Business Profile</Text> */}
                                <Input required type='text' label labelTitle="Enter Offer Title" placeholder='e.g. Special Discount' value={title} onTextChange={(value) => setTitle(value)} />

                                <DropdownComponent

                                    onChange={(item: any) => {
                                        setSelectedBusinessProfile(item.value);
                                   

                                    }
                                    }
                                    required
                                    label="Select Business Profile"
                                    data={businessProfiles as any}
                                    value={selectedBusinessProfile}
                                />
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <DropdownComponent
                                    onChange={(item: any) => {
                                        setOfferType(item.value);
                                    }
                                    }
                                    required
                                    isOfferType={true}
                                    label="Select Offer Type"
                                    data={offerTypes as any}
                                    value={offerType}
                                />
                            </View>

                            <Input type='description' label labelTitle="Enter Description" placeholder='e.g. Get 50% off on all items' value={description} onTextChange={(value) => setDescription(value)} />
                           { offerType === 'discount' &&  
                             <Input required type='numeric' label labelTitle="Offer Value" placeholder='e.g. 50%' value={offerValue} onTextChange={(value) => setOfferValue(value)} />}
                            {Platform.OS === "android" && <TouchableOpacity onPress={() => setShow(true)}>
                                <Input
                                    type="text"
                                    label
                                    onTextChange={(value) => setOfferExpiryDate(value)}
                                    required
                                    labelTitle="Offer Expiry Date"
                                    placeholder='e.g. 2024-12-31'
                                    value={offerExpiryDate ? new Date(offerExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    // onTextChange={(value) => setOfferExpiryDate(value)}
                                    style={{ opacity: 1 }}
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
                                                setOfferExpiryDate(currentDate.toISOString())
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
                                            setOfferExpiryDate(currentDate.toISOString())
                                        }}
                                    />
                                )}

                            <Input
                                label
                                type='text'
                                required
                                labelTitle="Offer Details"
                                placeholder='e.g. Available only for first-time customers'
                                value={offerDetails}
                                onTextChange={(value) => setOfferDetails(value)} />

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
                            <View style={{ flexDirection: 'column', height: 200, gap: 10, width: '100%', alignItems: 'center', marginBottom: 20 }}>
                                <TouchableOpacity onPress={onPickImage} style={[styles.uploadContainer, { opacity: uploading ? 0.5 : 1 }]}>
                                    {image && typeof image === 'string' ? (
                                        <Animated.View style={[styles.uploadContainer, animatedStyle]}>
                                            <Image source={{ uri: image }} style={styles.logo} />
                                        </Animated.View>
                                    ) : (
                                        <View style={styles.placeholderContainer}>
                                            <Text style={styles.placeholderText}>Add Offer Feature Image</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <Text
                                    onPress={() => onPickImage()}
                                    disabled={uploading}
                                    style={styles.uploadText}>{image ? 'Change Image' : uploading && 'Uploading...'}</Text>

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

            </SafeAreaView>

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
        width: '100%',
        height: 200,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    imageContainer: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    logoContainer: {
        width: 100,
        height: 100,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        paddingTop: 0,
        width: '100%',
        height: 80,
        position: 'absolute',
        left: 0,
        bottom: 80,
        right: 0,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        bottom: 20,
        zIndex: 1,
    },
    backButtonText: {
        fontFamily: FONT.bold,
        fontSize: 16,
        color: COLORS.primary,
    },
});

export default CreateAdvertiseForm;
