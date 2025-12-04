import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Text,
  Animated,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { COLORS, FONT } from "@/constants/theme";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { patchData, fetchData } from "@/lib/axiosUtility";
import DropdownComponent from "@/components/ui/dropdown";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BottomSheetComponent } from "@/components/bottomSheetComponent";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

// Offer type options
const offerTypeOptions = [
  { label: "Discount", value: "discount" },
  { label: "Buy-One-Get-One", value: "buy-one-get-one" },
  { label: "Free-Shipping", value: "free-shipping" },
  { label: "other", value: "other" },
];

type MediaItem = { uri: string; type: "image" | "video" };

const EditOffer = () => {
  const { id } = useLocalSearchParams();
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const [offerTitle, setOfferTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offerExpiryDate, setOfferExpiryDate] = useState("");
  const [offerType, setOfferType] = useState("");
  const [offerValue, setOfferValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [offerDetails, setOfferDetails] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [image, setImage] = useState<string | null>(null); // Featured image
  const [selectedImages, setSelectedImages] = useState<MediaItem[]>([]); // gallery
  const [selectedVideos, setSelectedVideos] = useState<MediaItem[]>([]); // videos
  const uploadProgressRef = useRef<{ [key: string]: number }>({});
  const [uploadProgressState, setUploadProgressState] = useState<{ [key: string]: number }>({});

  const snapPoints = useMemo(() => ["35%", "50%", "80%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [show, setShow] = useState(false);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  // Fetch Offer and Categories
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
        if (response.featuredImage) setImage(response.featuredImage);

        // Clear selected media: do not use fetched images/videos
        setSelectedImages([]);
        setSelectedVideos([]);
      }
    } catch (error) {
      console.error("Error fetching Offer details:", error);
      Alert.alert("Error", "Failed to load Offer details");
    }

    try {
      const responseCategory = await fetchData(`/categories/v1/all`);
      const data = responseCategory?.map((item: any) => ({
        label: item?.name,
        value: item?._id,
      }));
      setCategoryOptions(data);
    } catch (error) {
      console.error("Error fetching Category:", error);
      Alert.alert("Error", "Failed to load Category");
    }
  };

  useEffect(() => {
    fetchOfferDetails();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Edit Ad",
      headerBackTitleVisible: true,
      headerLargeTitle: true,
      headerBackTitle: "Back",
      headerStyle: { backgroundColor: COLORS.white },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
      headerShadowVisible: false,
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
  }, [navigation]);

  // Upload Featured Image
  async function uploadFeaturedImage(uri: string): Promise<string> {
    setUploading(true);
    const fileName = new Date().getTime();
    const storageRef = ref(storage, `OffersImages/featured/${fileName}`);
    try {
      const blob = await fetch(uri).then((res) => res.blob());
      const uploadTask = await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.log("Error in uploadFeaturedImage:", error);
      setUploading(false);
      return "";
    }
  }

  const onPickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) setImage(result.assets[0].uri);
      startAnimation();
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10 - selectedImages.length,
        quality: 1,
      });
      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "image",
        }));
        setSelectedImages([...selectedImages, ...newImages].slice(0, 10));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images.");
    }
  };

  const pickVideos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        selectionLimit: 3 - selectedVideos.length,
        quality: 1,
      });
      if (!result.canceled) {
        const newVideos = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "video",
        }));
        setSelectedVideos([...selectedVideos, ...newVideos].slice(0, 3));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick videos.");
    }
  };

  // Upload Media (Images/Videos) with progress
  const uploadMediaWithProgress = async (
    mediaList: MediaItem[],
    type: "image" | "video"
  ) => {
    const folder = type === "video" ? "OffersVideos" : "OffersImages/gallery";
    const uploadPromises = mediaList.map(
      (media) =>
        new Promise<MediaItem>(async (resolve, reject) => {
          try {
            if (media.uri.includes("http")) return resolve(media);
            const fileName =
              new Date().getTime() + (type === "video" ? "_video" : "_image");
            const storageRef = ref(storage, `${folder}/${fileName}`);
            const blob = await fetch(media.uri).then((res) => res.blob());
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadProgressRef.current[media.uri] = progress;
                setUploadProgressState({ ...uploadProgressRef.current });
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({ uri: downloadURL, type });
              }
            );
          } catch (error) {
            reject(error);
          }
        })
    );
    return await Promise.all(uploadPromises);
  };

  const updateOffer = async () => {
    if (!offerTitle) {
      setError("Please enter an offer title");
      snapToIndex(0);
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      snapToIndex(0);
      return;
    }
    if (!offerType) {
      setError("Please select an offer type");
      snapToIndex(0);
      return;
    }
    if (!offerExpiryDate) {
      setError("Please select an offer expiry date");
      snapToIndex(0);
      return;
    }
    if (offerType === "discount" && (!offerValue || isNaN(Number(offerValue)))) {
      setError("Offer Value is required and must be a number for discount type");
      snapToIndex(0);
      return;
    }
    if (!offerDetails) {
      setError("Please enter offer details");
      snapToIndex(0);
      return;
    }

    setUploading(true);
    let uploadedImages: MediaItem[] = [];
    let uploadedVideos: MediaItem[] = [];

    if (selectedImages.length > 0)
      uploadedImages = await uploadMediaWithProgress(selectedImages, "image");
    if (selectedVideos.length > 0)
      uploadedVideos = await uploadMediaWithProgress(selectedVideos, "video");

    try {
      let featuredImageUrl = "";
      if (image && !image.includes("http")) {
        featuredImageUrl = await uploadFeaturedImage(image);
      } else featuredImageUrl = image || "";

      const updates: any = {
        title: offerTitle,
        category: categoryId,
        categoryName,
        description,
        offerExpiryDate,
        offerType,
        offerValue,
        offerDetails,
        featuredImage: featuredImageUrl,
      };

      if (uploadedImages.length > 0) {
        updates.gallery = uploadedImages.map((img) => ({ imageUrl: img.uri }));
      }
      if (uploadedVideos.length > 0) {
        updates.videos = uploadedVideos.map((vid) => ({ videoUrl: vid.uri }));
      }

      const response = await patchData(`/offer/v1/${id}`, updates);
      if (response) Alert.alert("Success", "Offer Updated successfully.");
    } catch (error) {
      console.error("Error updating Offer:", error);
    }

    setUploading(false);
    router.back();
  };

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

  const MediaItemComponent = React.memo(
    ({ item, index, onRemove }: { item: MediaItem; index: number; onRemove: (i: number) => void }) => (
      <View style={styles.mediaContainer}>
        {item.type === "image" ? (
          <Image source={{ uri: item.uri }} style={styles.image} />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff" }}>Video {index + 1}</Text>
          </View>
        )}

        {uploadProgressState[item.uri] !== undefined && (
          <Text>{Math.round(uploadProgressState[item.uri])}%</Text>
        )}

        <Button label="Remove" onPress={() => onRemove(index)} variant="default" />
      </View>
    )
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Input label required labelTitle="Offer Title" placeholder="e.g. Main Branch" type="text" value={offerTitle} onTextChange={setOfferTitle} />
          <DropdownComponent
            required
            labelTitle="Offer Type"
            isOfferType={true}
            label={offerType || "Select Offer Type"}
            data={offerTypeOptions as any}
            value={offerType}
            onChange={(item: any) => setOfferType(item.value)}
          />
          <DropdownComponent
            required
            labelTitle="Offer Category"
            label={categoryName || "Select Offer Category"}
            data={categoryOptions}
            value={categoryId}
            onChange={(item: any) => setCategoryId(item.value)}
          />
          <Input label labelTitle="Offer Description" placeholder="Type here..." type="text" value={description} onTextChange={setDescription} />

          {Platform.OS === "android" && (
            <TouchableOpacity onPress={() => setShow(true)}>
              <Input
                required
                type="text"
                label
                labelTitle="Offer Expiry Date"
                placeholder="e.g. 2024-12-31"
                value={offerExpiryDate ? new Date(offerExpiryDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString()}
                onTextChange={() => {}}
                style={{ opacity: 0.8 }}
                editable={false}
              />
            </TouchableOpacity>
          )}
          {(Platform.OS === "ios" || show) && (
            <DateTimePicker
              value={offerExpiryDate ? new Date(offerExpiryDate) : new Date()}
              mode="date"
              minimumDate={new Date()}
              textColor={COLORS.primary}
              accentColor={COLORS.primary}
              display="default"
              onChange={(e, date) => {
                setShow(false);
                setOfferExpiryDate((date || new Date()).toISOString().split("T")[0]);
              }}
            />
          )}

          <Input required label labelTitle="Offer Details" placeholder="Type here..." type="text" value={offerDetails} onTextChange={setOfferDetails} />
          <Input label labelTitle="Offer Value" placeholder="e.g. 10%" type="text" value={offerValue} onTextChange={setOfferValue} />

          {/* Featured Image */}
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginVertical: 20 }}>
            <TouchableOpacity disabled={uploading} onPress={onPickImage} style={[styles.logouploadContainer, { opacity: uploading ? 0.5 : 1 }]}>
              {image ? (
                <Animated.View style={[styles.logoContainer, animatedStyle]}>
                  <Image source={{ uri: image }} style={styles.logo} />
                </Animated.View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>Edit Offer Feature Image</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text onPress={onPickImage} style={[styles.uploadText, { opacity: uploading ? 0.5 : 1 }]}>
              {image ? "Change featured  Image" : "Upload Featured Image"}
            </Text>
          </View>

          {/* Gallery Images */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: 16 }}>Gallery Images ({selectedImages.length}/10)</Text>
            <Button label="Add Images" onPress={pickImages} disabled={uploading || selectedImages.length >= 10} variant="default" />
            <FlatList
              data={selectedImages}
              horizontal
              keyExtractor={(item, index) => item.uri || index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <MediaItemComponent item={item} index={index} onRemove={(i) => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} />
              )}
            />
          </View>

          {/* Videos */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: 16 }}>Videos ({selectedVideos.length}/3)</Text>
            <Button label="Add Videos" onPress={pickVideos} disabled={uploading || selectedVideos.length >= 3} variant="default" />
            <FlatList
              data={selectedVideos}
              horizontal
              keyExtractor={(item, index) => item.uri || index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <MediaItemComponent item={item} index={index} onRemove={(i) => setSelectedVideos(prev => prev.filter((_, idx) => idx !== i))} />
              )}
            />
          </View>

          <Button label={uploading ? "Updating..." : "Update Offer"} onPress={updateOffer} disabled={uploading} />
        </ScrollView>
      </SafeAreaView>

      <BottomSheetComponent
        error={error}
        snapPoints={snapPoints}
        bottomSheetRef={bottomSheetRef}
        renderBackdrop={renderBackdrop}
        handleClosePress={handleClosePress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  logouploadContainer: { alignItems: "center", justifyContent: "center" },
  logoContainer: { borderRadius: 12, overflow: "hidden" },
  logo: { width: 100, height: 100, resizeMode: "cover" },
  placeholderContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
  },
  placeholderText: { color: COLORS.primary, fontFamily: FONT.medium, textAlign: "center" },
  uploadText: { marginLeft: 10, color: COLORS.primary, fontFamily: FONT.medium },
  mediaContainer: { margin: 5, alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 8 },
});

export default EditOffer;
