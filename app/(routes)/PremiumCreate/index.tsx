import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Animated, Image, StyleSheet, Platform, Alert } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import SearchComponent from '@/components/SearchComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchData, postData } from '@/lib/axiosUtility';
import CategoriesCard from '@/components/Create/CategoriesCard';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DropdownComponent from '@/components/ui/dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBadgeIcon } from 'react-native-heroicons/solid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const offerTypes = [
    { label: 'Discount', value: 'discount' },
    { label: 'Free Shipping', value: 'free-shipping' },
    { label: 'Buy One Get One', value: 'buy-one-get-one' },
    { label: 'Other', value: 'other' },
];

export const CreateAdvertiseForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // User subscription
    const [user, setUser] = useState<any>(null);

    // Offer details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [offerType, setOfferType] = useState('');
    const [offerValue, setOfferValue] = useState('');
    const [category, setCategory] = useState('');
    const [offerExpiryDate, setOfferExpiryDate] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [selectedBusinessProfile, setSelectedBusinessProfile] = useState('') as any;

    const [categories, setCategories] = useState<any[]>([]);
    const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);

    // Images
    const [image, setImage] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    
    // Videos
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isCreated, setIsCreated] = useState(false);

    const animation = useRef(new Animated.Value(0)).current;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const handleClosePress = () => bottomSheetRef.current?.close();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);

    // Fetch categories
    const getCategories = async () => {
        try {
            const res = await fetchData(`/categories/v1/all`);
            const categoriesData = res.data || res;
            setCategories(categoriesData);
        } catch (err: any) {
            console.error("Error fetching categories:", err.message);
        }
    };

    // Fetch business profiles
    const getAllBusinessProfiles = async () => {
        try {
            const res = await fetchData(`/business/v1/get/current`);
            const data = res.data ?? res;
            const profilesArray: any[] = Array.isArray(data?.businessProfiles) ? data.businessProfiles : [];
            const dropdownProfiles = profilesArray.map(profile => ({ label: profile.name, value: profile._id }));
            setBusinessProfiles(dropdownProfiles);
        } catch (err: any) {
            console.error("Error fetching business profiles:", err.message);
            setBusinessProfiles([]);
        }
    };

    // Fetch user details
    const fetchUserDetails = async () => {
        try {
            const data = await fetchData("/user/v1/current");
            setUser(data);
        } catch (err: any) {
            console.error("Error fetching user details:", err.message);
        }
    };

    useEffect(() => {
        fetchUserDetails();
        getCategories();
        getAllBusinessProfiles();
    }, []);

    const onStepChange = (step: number) => setCurrentStep(step);

    const onSearch = (value: string) => {
        const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
        setCategories(filteredCategories.length > 0 ? filteredCategories : categories);
    };

    const renderCategories = ({ item }: any) => (
        <View style={{ flex: 1, margin: 5 }}>
            {item && (
                <CategoriesCard
                    selected={category === item._id}
                    onSelect={() => setCategory(item._id)}
                    fullWidth
                    id={item._id}
                    title={item.name}
                    image={item.categoryImgUrl}
                />
            )}
        </View>
    );

    const startAnimation = () => {
        Animated.timing(animation, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
            Animated.timing(animation, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        });
    };

    // Image picker
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
        } catch {
            Alert.alert('Error', 'Failed to pick image.');
        }
    };

    const galleryPickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
            });
            if (!result.canceled) {
                setSelectedImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
            }
        } catch {
            Alert.alert('Error', 'Failed to pick gallery images.');
        }
    };

    const pickVideos = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsMultipleSelection: true,
            });
            if (!result.canceled) {
                const uris = result.assets.map(asset => asset.uri);
                setSelectedVideos(prev => [...prev, ...uris]);
            }
        } catch {
            Alert.alert("Error", "Failed to pick videos.");
        }
    };

    const uploadToFirebase = async (uri: string, folder: string): Promise<string> => {
        const fileName = new Date().getTime();
        const storageRef = ref(storage, `${folder}/${fileName}`);
        const blob = await (await fetch(uri)).blob();
        const uploadTask = await uploadBytesResumable(storageRef, blob);
        return getDownloadURL(uploadTask.ref);
    };

    const uploadGalleryImagesToFirebase = async (images: string[]) => {
        const uploaded = await Promise.all(images.map(uri => uploadToFirebase(uri, "OffersImages/gallery")));
        setUploadedImages(uploaded.map(url => ({ imageUrl: url })));
        return uploaded;
    };

    const uploadVideosToFirebase = async (videos: string[]) => {
        const uploaded = await Promise.all(videos.map(uri => uploadToFirebase(uri, "OffersImages/videos")));
        setUploadedVideos(prev => [...prev, ...uploaded]);
        return uploaded;
    };

    const onSubmit = async () => {
        setUploading(true);
        try {
            let featuredImage = image?.includes('http') ? image : await uploadToFirebase(image as string, "OffersImages/featured");
            let galleryImages = selectedImages.length > 0 ? await uploadGalleryImagesToFirebase(selectedImages) : [];
            if (selectedVideos.length > 0) await uploadVideosToFirebase(selectedVideos);

            const payload = {
                title,
                description,
                offerType: offerType.toLowerCase(),
                offerValue,
                category,
                businessProfile: selectedBusinessProfile,
                offerDetails,
                offerExpiryDate,
                gallery: galleryImages,
                featuredImage,
                videos: uploadedVideos,
            };

            const response = await postData('/offer/v1/create', payload);
            if (response) setIsCreated(true);
        } catch (err: any) {
            console.error(err);
            Alert.alert(err?.response?.data?.message || 'Failed to submit');
        }
        setUploading(false);
    };

    const handleNextClick = () => {
        if (!title) { setError('Enter offer title'); snapToIndex(0); return; }
        if (!selectedBusinessProfile) { setError('Select business profile'); snapToIndex(0); return; }
        if (!offerType) { setError('Select offer type'); snapToIndex(0); return; }
        if (!description) { setError('Enter description'); snapToIndex(0); return; }
        if (!offerExpiryDate) { setError('Select expiry date'); snapToIndex(0); return; }
        if (offerType === 'discount' && (!offerValue || isNaN(Number(offerValue)))) { setError('Enter valid offer value'); snapToIndex(0); return; }
        if (!offerDetails) { setError('Enter offer details'); snapToIndex(0); return; }
        onStepChange(3);
    };

    return (
        isCreated ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, margin: 20, gap: 20 }}>
                <CheckBadgeIcon size={100} color={COLORS.primary} />
                <Text style={{ fontFamily: FONT.bold, fontSize: 24, color: COLORS.primary }}>Offer Ad Created</Text>
                <Button label="Go to My Ads" variant="default" onPress={() => router.push('/(routes)/MyAds')} />
            </View>
        ) : (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView style={{ flex: 1, padding: 20 }}>
                    {currentStep === 1 && (
                        <>
                            <SearchComponent value={category} placeholder="Search.." onChangeText={onSearch} />
                            <FlatList data={categories} keyExtractor={(item, idx) => idx.toString()} numColumns={2} renderItem={renderCategories} />
                        </>
                    )}

                    {currentStep === 2 && (
                        <View>
                            <Input label labelTitle="Enter Offer Title" value={title} onTextChange={setTitle} />
                            <DropdownComponent onChange={item => setSelectedBusinessProfile(item.value)} label="Select Business Profile" data={businessProfiles} value={selectedBusinessProfile} />
                            <DropdownComponent onChange={item => setOfferType(item.value)} label="Select Offer Type" data={offerTypes} value={offerType} />
                            <Input label labelTitle="Enter Description" value={description} onTextChange={setDescription} />
                            {offerType === 'discount' && <Input label labelTitle="Offer Value" value={offerValue} onTextChange={setOfferValue} />}
                            <Input label labelTitle="Offer Details" value={offerDetails} onTextChange={setOfferDetails} />
                            <Button label="Next" onPress={handleNextClick} />
                        </View>
                    )}

                    {currentStep === 3 && (
                        <View>
                            <TouchableOpacity onPress={onPickImage}>
                                {image ? <Image source={{ uri: image }} style={{ width: '100%', height: 200 }} /> : <Text>Add Featured Image</Text>}
                            </TouchableOpacity>

                            <Button label="Add Gallery Images" onPress={galleryPickImage} />
                            {uploadedImages.length > 0 && <FlatList horizontal data={uploadedImages} keyExtractor={(item, idx) => idx.toString()} renderItem={({ item }) => <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200, margin: 5 }} />} />}

                            {(user?.freeTrial?.status === 'active' || user?.membership?.status === 'active') && (
                                <>
                                    <Button label="Add Videos" onPress={pickVideos} />
                                    {selectedVideos.length > 0 && (
                                        <FlatList horizontal data={selectedVideos} keyExtractor={(item, idx) => idx.toString()} renderItem={({ item }) => (
                                            <View style={{ width: 200, height: 200, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: COLORS.gray }}>Video Selected</Text>
                                            </View>
                                        )} />
                                    )}
                                </>
                            )}

                            <Button label={uploading ? "Uploading..." : "Submit"} onPress={onSubmit} disabled={uploading} />
                        </View>
                    )}
                </ScrollView>

                <BottomSheetComponent title={error} bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} handleClosePress={handleClosePress}>
                    <View style={{ padding: 20 }}>
                        <Button label="Okay" onPress={handleClosePress} />
                    </View>
                </BottomSheetComponent>
            </SafeAreaView>
        )
    );
};


