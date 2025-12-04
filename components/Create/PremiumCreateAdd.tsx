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
import { ChevronLeft, X, Play } from 'lucide-react-native';
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

    // Enhanced media state
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
    const [mediaUploadProgress, setMediaUploadProgress] = useState<{[key: string]: number}>({});

    const getCategories = async () => {
        try {
            const res = await fetchData(`/categories/v1/all`);
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

            const dropdownProfiles = profilesArray.map(profile => ({
                label: profile.name,
                value: profile._id,
            }));

            setBusinessProfiles(dropdownProfiles);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load business profiles";
            console.log("Error Fetching Business Profiles:", message);
            setBusinessProfiles([]);
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

    const renderCategories = ({ item }: any) => (  
        <View style={{ flex: 1, margin: 5 }}>
            {item ? (
                <CategoriesCard 
                    selected={category === item._id}
                    onSelect={() => setCategory(item._id)}
                    fullWidth
                    id={item._id}
                    title={item.name}
                    image={item.categoryImgUrl}
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

    // Enhanced gallery image picker - supports up to 10 images
    const galleryPickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                aspect: [1, 1],
                selectionLimit: Math.max(1, 10 - selectedImages.length), // Allow up to 10 total images
                quality: 0.8,
            });

            if (!result.canceled) {
                const newImages = result.assets.map((asset) => asset.uri);
                setSelectedImages(prev => [...prev, ...newImages].slice(0, 10)); // Ensure max 10 images
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick images.');
        }
    };

    // New video picker function
    const pickVideos = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsMultipleSelection: true,
                selectionLimit: Math.max(1, 5 - selectedVideos.length), // Allow up to 5 videos
                quality: 0.8,
                videoMaxDuration: 60, // 60 seconds max
            });

            if (!result.canceled) {
                const newVideos = result.assets.map((asset) => asset.uri);
                setSelectedVideos(prev => [...prev, ...newVideos].slice(0, 5)); // Ensure max 5 videos
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick videos.');
        }
    };

    // Remove individual image
    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    // Remove individual video
    const removeVideo = (index: number) => {
        setSelectedVideos(prev => prev.filter((_, i) => i !== index));
        setUploadedVideos(prev => prev.filter((_, i) => i !== index));
    };

    async function uploadFeaturedImage(uri: string): Promise<string> {
        setUploading(true);
        const fileName = new Date().getTime();
        const storageRef = ref(storage, `OffersImages/featured/${fileName}`);

        try {
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const blob = await response.blob();
            const uploadTask = await uploadBytesResumable(storageRef, blob);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            setImage(downloadURL);
            setUploading(false);
            return downloadURL;
        } catch (error) {
            console.log('Error in uploadFeaturedImage:', error);
            setUploading(false);
            throw error;
        }
    }

    // Enhanced gallery images upload with progress tracking

    const uploadGalleryImagesToFirebase = async (images: string[]): Promise<{ imageUrl: string }[]> => {
        try {
            setUploading(true);
            console.log("Starting upload for", images.length, "images");
            
            // Check if storage is properly initialized
            if (!storage) {
                throw new Error('Firebase storage is not initialized');
            }

            const uploadPromises = images.map(async (image, index) => {
                try {
                    const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`;
                    console.log(`Uploading image ${index + 1}/${images.length}: ${fileName}`);
                    
                    // Create storage reference with proper error handling
                    const storageRef = ref(storage, `OffersImages/gallery/${fileName}`);
                    
                    const progressKey = `image_${index}`;
                    setMediaUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

                    // Fetch and convert to blob with better error handling
                    console.log(`Fetching image ${index}: ${image.substring(0, 50)}...`);
                    const response = await fetch(image);
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                    }
                    
                    const blob = await response.blob();
                    console.log(`Blob created for image ${index}, size: ${blob.size} bytes`);

                    // Create upload task
                    const uploadTask = uploadBytesResumable(storageRef, blob);
                    
                    // Return a promise that resolves when upload completes
                    return new Promise<{ imageUrl: string }>((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            // Progress callback
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log(`Image ${index} upload progress: ${progress.toFixed(1)}%`);
                                setMediaUploadProgress(prev => ({ ...prev, [progressKey]: progress }));
                            },
                            // Error callback
                            (error) => {
                                console.error(`Upload failed for image ${index}:`, error);
                                setMediaUploadProgress(prev => {
                                    const newProgress = { ...prev };
                                    delete newProgress[progressKey];
                                    return newProgress;
                                });
                                reject(error);
                            },
                            // Complete callback
                            async () => {
                                try {
                                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                    console.log(`Image ${index} uploaded successfully:`, downloadURL);
                                    
                                    // Clear progress when done
                                    setMediaUploadProgress(prev => {
                                        const newProgress = { ...prev };
                                        delete newProgress[progressKey];
                                        return newProgress;
                                    });
                                    
                                    resolve({ imageUrl: downloadURL });
                                } catch (urlError) {
                                    console.error(`Failed to get download URL for image ${index}:`, urlError);
                                    reject(urlError);
                                }
                            }
                        );
                    });
                } catch (imageError) {
                    console.error(`Error processing image ${index}:`, imageError);
                    throw imageError;
                }
            });

            console.log("Waiting for all uploads to complete...");
            const uploadedImages = await Promise.all(uploadPromises);
            
            console.log("All images uploaded successfully:", uploadedImages);
            setUploadedImages(uploadedImages);
            setUploading(false);
            return uploadedImages;
        } catch (error) {
            console.error('Error uploading images:', error);
            setUploading(false);
            
            // Clear any remaining progress indicators
            setMediaUploadProgress({});
            
            // Provide more specific error message
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Failed to upload images to Firebase: ${errorMessage}`);
        }
    };

    // Enhanced video upload function
    const uploadVideosToFirebase = async (videos: string[]): Promise<{ videoUrl: string }[]> => {
    try {
        setUploading(true);
        console.log("Starting upload for", videos.length, "videos");

        // Check if storage is properly initialized
        if (!storage) {
            throw new Error('Firebase storage is not initialized');
        }

        const uploadPromises = videos.map(async (video, index) => {
            try {
                const fileName = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`;
                console.log(`Uploading video ${index + 1}/${videos.length}: ${fileName}`);
                if (!storage) {
  throw new Error("Firebase storage is not initialized");
}


                // Create storage reference
                const storageRef = ref(storage, `OffersVideos/${fileName}`);

                const progressKey = `video_${index}`;
                setMediaUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

                // Fetch and convert to blob
                console.log(`Fetching video ${index}: ${video.substring(0, 50)}...`);
                const response = await fetch(video);

                if (!response.ok) {
                    throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
                }

                const blob = await response.blob();
                console.log(`Blob created for video ${index}, size: ${blob.size} bytes`);

                // Create upload task
                const uploadTask = uploadBytesResumable(storageRef, blob);

                // Return a promise that resolves when upload completes
                return new Promise<{ videoUrl: string }>((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        // Progress callback
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Video ${index} upload progress: ${progress.toFixed(1)}%`);
                            setMediaUploadProgress(prev => ({ ...prev, [progressKey]: progress }));
                        },
                        // Error callback
                        (error) => {
                            console.error(`Upload failed for video ${index}:`, error);
                            setMediaUploadProgress(prev => {
                                const newProgress = { ...prev };
                                delete newProgress[progressKey];
                                return newProgress;
                            });
                            reject(error);
                        },
                        // Complete callback
                        async () => {
                            try {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                console.log(`Video ${index} uploaded successfully:`, downloadURL);

                                // Clear progress when done
                                setMediaUploadProgress(prev => {
                                    const newProgress = { ...prev };
                                    delete newProgress[progressKey];
                                    return newProgress;
                                });

                                resolve({ videoUrl: downloadURL });
                            } catch (urlError) {
                                console.error(`Failed to get download URL for video ${index}:`, urlError);
                                reject(urlError);
                            }
                        }
                    );
                });
            } catch (videoError) {
                console.error(`Error processing video ${index}:`, videoError);
                throw videoError;
            }
        });

        console.log("Waiting for all uploads to complete...");
        const uploadedVideos = await Promise.all(uploadPromises);

        console.log("All videos uploaded successfully:", uploadedVideos);
        setUploadedVideos(uploadedVideos);
        setUploading(false);
        return uploadedVideos;
    } catch (error) {
        console.error('Error uploading videos:', error);
        setUploading(false);

        // Clear any remaining progress indicators
        setMediaUploadProgress({});

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to upload videos to Firebase: ${errorMessage}`);
    }
};


    const onSubmit = async () => {
        let featuredImage;
        let galleryImages = [];
        let galleryVideos = [];

        // Upload featured image
        if (image?.includes('http')) {
            featuredImage = image;
        } else {
            featuredImage = await uploadFeaturedImage(image as any);
        }

        // Handle gallery images
        if (selectedImages.length > 0) {
            if (selectedImages[0]?.includes?.('http')) {
                galleryImages = selectedImages.map(url => ({ imageUrl: url }));
            } else {
                galleryImages = await uploadGalleryImagesToFirebase(selectedImages);
            }
        }

        // Handle gallery videos
        if (selectedVideos.length > 0) {
            if (selectedVideos[0]?.includes?.('http')) {
                galleryVideos = selectedVideos.map(url => ({ videoUrl: url }));
            } else {
                galleryVideos = await uploadVideosToFirebase(selectedVideos);
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
                videos: galleryVideos, // New field for videos
                featuredImage: featuredImage,
            };
            
            const response = await postData('/offer/v1/create', payload);
            
            if (response) {
                setIsCreated(true);
            }
        } catch (error: any) {
            console.log(error);
            Alert.alert(error?.response?.data?.message);
        }
    };

    // Update uploaded images when selectedImages changes
    useEffect(() => {
        if (selectedImages.length > 0 && selectedImages[0]?.includes?.('http')) {
            setUploadedImages(selectedImages.map(url => ({ imageUrl: url })));
        } else {
            setUploadedImages(
                selectedImages.map((image: any) => {
                    return { imageUrl: image };
                })
            );
        }
    }, [selectedImages]);

    // Update uploaded videos when selectedVideos changes
    useEffect(() => {
        if (selectedVideos.length > 0 && selectedVideos[0]?.includes?.('http')) {
            setUploadedVideos(selectedVideos.map(url => ({ videoUrl: url })));
        } else {
            setUploadedVideos(
                selectedVideos.map((video: any) => {
                    return { videoUrl: video };
                })
            );
        }
    }, [selectedVideos]);

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
        const newData = [...data];
        const numberOfFullRows = Math.floor(newData.length / numColumns);
        let numberOfElementsLastRow = newData.length - numberOfFullRows * numColumns;

        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            newData.push(null);
            numberOfElementsLastRow++;
        }
        return newData;
    };

    const handleNextClick = () => {
        if (!title) {
            setError('Please enter an offer title');
            snapToIndex(0);
            return;
        }
        if (!selectedBusinessProfile) {
            setError('Please select a business profile');
            snapToIndex(0);
            return;
        }
        if (!offerType) {
            setError('Please select an offer type');
            snapToIndex(0);
            return;
        }
        if (!description) {
            setError('Please enter description');
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
            return;
        }
        onStepChange(3);
    };

    // Render media item (image or video)
    const renderMediaItem = ({ item, index, type }: { item: any, index: number, type: 'image' | 'video' }) => (
        <View style={styles.mediaItemContainer}>
            {type === 'image' ? (
                <Image source={{ uri: item?.imageUrl || item }} style={styles.mediaItem} />
            ) : (
                <View style={styles.videoContainer}>
                    <Image source={{ uri: item?.videoUrl || item }} style={styles.mediaItem} />
                    <View style={styles.playButton}>
                        <Play size={24} color={COLORS.white} />
                    </View>
                </View>
            )}
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => type === 'image' ? removeImage(index) : removeVideo(index)}
            >
                <X size={16} color={COLORS.white} />
            </TouchableOpacity>
            
            {/* Show progress if uploading */}
            {mediaUploadProgress[`${type}_${index}`] !== undefined && (
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${mediaUploadProgress[`${type}_${index}`]}%` }]} />
                </View>
            )}
        </View>
    );

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
                        <Text style={{ fontFamily: FONT.bold, fontSize: 20, marginBottom: 10 }}>
                            {currentStep === 1 ? 'Select a category' : currentStep === 2 ? 'Enter details' : 'Add media'}
                        </Text>
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
                                <Input required type='text' label labelTitle="Enter Offer Title" placeholder='e.g. Special Discount' value={title} onTextChange={(value) => setTitle(value)} />

                                <DropdownComponent
                                    onChange={(item: any) => {
                                        setSelectedBusinessProfile(item.value);
                                    }}
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
                                    }}
                                    required
                                    isOfferType={true}
                                    label="Select Offer Type"
                                    data={offerTypes as any}
                                    value={offerType}
                                />
                            </View>

                            <Input type='description' label labelTitle="Enter Description" placeholder='e.g. Get 50% off on all items' value={description} onTextChange={(value) => setDescription(value)} />
                            
                            {offerType === 'discount' &&  
                                <Input required type='numeric' label labelTitle="Offer Value" placeholder='e.g. 50%' value={offerValue} onTextChange={(value) => setOfferValue(value)} />
                            }
                            
                            {Platform.OS === "android" && <TouchableOpacity onPress={() => setShow(true)}>
                                <Input
                                    type="text"
                                    label
                                    onTextChange={(value) => setOfferExpiryDate(value)}
                                    required
                                    labelTitle="Offer Expiry Date"
                                    placeholder='e.g. 2024-12-31'
                                    value={offerExpiryDate ? new Date(offerExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    style={{ opacity: 1 }}
                                    editable={false}
                                />
                            </TouchableOpacity>}
                            
                            {Platform.OS === "ios" ? (
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
                                onTextChange={(value) => setOfferDetails(value)} 
                            />

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
                                        variant="default"
                                        onPress={handleNextClick}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {currentStep === 3 && (
                        <View style={{ flex: 1, marginBottom: 200, width: '100%' }}>
                            {/* Featured Image Section */}
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
                                    style={styles.uploadText}>
                                    {image ? 'Change Image' : uploading ? 'Uploading...' : 'Add Image'}
                                </Text>
                            </View>

                            {/* Gallery Images Section */}
                            <View style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ fontFamily: FONT.bold, fontSize: 18 }}>
                                        Gallery Images ({selectedImages.length}/10)
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        {selectedImages.length > 0 && (
                                            <Button 
                                                label="Clear" 
                                                variant="default" 
                                                onPress={() => {
                                                    setSelectedImages([]);
                                                    setUploadedImages([]);
                                                }} 
                                                disabled={uploading} 
                                            />
                                        )}
                                        {selectedImages.length < 10 && (
                                            <Button 
                                                label="Add Images" 
                                                variant="default" 
                                                onPress={galleryPickImage} 
                                                disabled={uploading} 
                                            />
                                        )}
                                    </View>
                                </View>

                                {uploadedImages.length > 0 && (
                                    <FlatList
                                        data={uploadedImages}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => renderMediaItem({ item, index, type: 'image' })}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                            </View>

                            {/* Gallery Videos Section */}
                            <View style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ fontFamily: FONT.bold, fontSize: 18 }}>
                                        Gallery Videos ({selectedVideos.length}/5)
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        {selectedVideos.length > 0 && (
                                            <Button 
                                                label="Clear" 
                                                variant="default" 
                                                onPress={() => {
                                                    setSelectedVideos([]);
                                                    setUploadedVideos([]);
                                                }} 
                                                disabled={uploading} 
                                            />
                                        )}
                                        {selectedVideos.length < 5 && (
                                            <Button 
                                                label="Add Videos" 
                                                variant="default" 
                                                onPress={pickVideos} 
                                                disabled={uploading} 
                                            />
                                        )}
                                    </View>
                                </View>

                                {uploadedVideos.length > 0 && (
                                    <FlatList
                                        data={uploadedVideos}
                                        keyExtractor={(item, index) => `video_${index}`}
                                        renderItem={({ item, index }) => renderMediaItem({ item, index, type: 'video' })}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={{ marginTop: 10 }}
                                    />
                                )}
                            </View>

                            {/* Upload Progress Indicator */}
                            {Object.keys(mediaUploadProgress).length > 0 && (
                                <View style={styles.uploadProgressContainer}>
                                    <Text style={styles.uploadProgressText}>
                                        Uploading media... {Object.keys(mediaUploadProgress).length} items remaining
                                    </Text>
                                </View>
                            )}

                            {/* Navigation Buttons */}
                            <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', gap: 6, alignItems: 'center', marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => onStepChange(2)}
                                    activeOpacity={0.8}
                                    disabled={uploading}
                                    style={{ 
                                        width: '15%', 
                                        height: 50, 
                                        borderRadius: 12, 
                                        opacity: uploading ? 0.5 : 1, 
                                        flexDirection: 'row', 
                                        backgroundColor: COLORS.primary, 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}
                                >
                                    <ChevronLeft size={24} color={COLORS.white} />
                                </TouchableOpacity>
                                <View style={{ width: '83%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button 
                                        label={uploading ? 'Uploading...' : image ? 'Upload & Submit' : 'Submit'} 
                                        variant="default" 
                                        onPress={() => onSubmit()} 
                                        disabled={uploading} 
                                    />
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
    // New styles for enhanced media functionality
    mediaItemContainer: {
        width: 120,
        height: 120,
        marginRight: 10,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    mediaItem: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    videoContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,0,0,0.8)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    uploadProgressContainer: {
        backgroundColor: COLORS.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    uploadProgressText: {
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        color: COLORS.primary,
    },
});

export default CreateAdvertiseForm;