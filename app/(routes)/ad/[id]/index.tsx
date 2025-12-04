import TopNavigation from '@/components/TopNavigation';
import { BANNER_H } from '@/constants';
import { COLORS, FONT } from '@/constants/theme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Linking,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  View,
  Image,
  Text,
  ActivityIndicator, // ✅ added
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Briefcase, CalendarDays, MapPin, X, Play } from 'lucide-react-native';
import { Alert } from 'react-native';
import SkeletonCard from '@/components/ui/skeletonCard';
import { fetchData, patchData, putData } from '@/lib/axiosUtility';

const { width } = Dimensions.get('window');

const OfferDetailsScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const _id = params.id;

  const [loading, setLoading] = useState(true);
  const [offerData, setOfferData] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState<any>(null);

  // images & video handling
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const videoRefs = useRef<any[]>([]);
  const [fullScreenVideoUri, setFullScreenVideoUri] = useState<string | null>(null);
  const [fullScreenVideoRef, setFullScreenVideoRef] = useState<Video | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // fetch user (current)
  const getUser = async () => {
    try {
      const u = await fetchData('/user/v1/current');
      return u;
    } catch (err) {
      console.warn('getUser error', err);
      return null;
    }
  };

  const getOfferDetails = async () => {
    setLoading(true);
    try {
      if (!_id) {
        setLoading(false);
        return;
      }
      const res = await fetchData(`/offer/v1/${_id}`);
      if (!res) {
        setLoading(false);
        return;
      }

      // set main data
      setOfferData(res);
      setIsOwner(res?.businessProfile?.User ?? null);
      setFollowers(res?.businessProfile?.followers?.count ?? 0);

      // current user
      const u = await getUser();
      if (u && u._id) {
        setUserId(u._id);
        const following =
          res?.businessProfile?.followers?.followers &&
          res.businessProfile.followers.followers.includes(u._id);
        setIsFollowing(following);
      }

      // banner image
      const firstGalleryImage =
        Array.isArray(res?.gallery) && res.gallery.length > 0
          ? res.gallery[0]?.imageUrl
          : null;
      const banner = firstGalleryImage || res?.featuredImage || null;
      setCurrentImage(banner);

      // increment view
      try {
        await patchData(`/offer/v1/${_id}/increment-views`);
      } catch (err) {
        // ignore
      }

      setLoading(false);
    } catch (err) {
      console.error('getOfferDetails', err);
      Alert.alert('Error', 'Something went wrong while loading offer.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getOfferDetails();
  }, [_id, followers]);

  const handleDirection = async () => {
    const lat = offerData?.businessProfile?.location?.coordinates?.coordinates?.[0];
    const long = offerData?.businessProfile?.location?.coordinates?.coordinates?.[1];
    if (!lat || !long) {
      Alert.alert('Location not available');
      return;
    }

    try {
      await patchData(`/offer/v1/${_id}/increment-clicks`);
    } catch (err) {
      // ignore
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${long},${lat}`;
    Linking.openURL(url).catch((err) => console.error('Maps open error', err));
  };

  const handleAddFollower = async () => {
    if (!offerData?.businessProfile?._id) return;
    try {
      await putData(
        `/business/v1/increment/followers/${offerData.businessProfile._id}`
      );
      await getOfferDetails();
      setIsFollowing((s) => !s);
    } catch (err) {
      console.error('follow error', err);
    }
  };

  const openFullScreenVideo = async (uri: string) => {
    if (videoRefs.current?.length) {
      for (const v of videoRefs.current) {
        try {
          v?.pauseAsync?.();
        } catch (e) {}
      }
    }
    setFullScreenVideoUri(uri);
  };

  const closeFullScreenVideo = async () => {
    try {
      await fullScreenVideoRef?.pauseAsync?.();
    } catch (e) {}
    setFullScreenVideoUri(null);
  };

  const renderImageGallery = () => {
    if (!Array.isArray(offerData?.gallery)) return null;
    return (
      <FlatList
        data={offerData.gallery}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => it?._id?.toString() ?? Math.random().toString()}
        contentContainerStyle={styles.galleryListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setFullScreenImage(item?.imageUrl ?? null)}
          >
            <View style={styles.galleryCard}>
              <Image source={{ uri: item?.imageUrl }} style={styles.galleryImage} />
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  const renderVideoGallery = () => {
    if (!Array.isArray(offerData?.videos)) return null;
    return (
      <FlatList
        data={offerData.videos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => it?._id?.toString() ?? Math.random().toString()}
        contentContainerStyle={styles.galleryListContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.videoCard}
            onPress={() => openFullScreenVideo(item?.videoUrl)}
          >
            <Video
              ref={(r) => (videoRefs.current[index] = r)}
              source={{ uri: item?.videoUrl }}
              style={styles.videoBackground}
              resizeMode="cover"
              shouldPlay={false}
              isLooping={false}
            />
            <View style={styles.playOverlay}>
              <Play size={40} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <TopNavigation title={offerData?.title ?? ''} scrollA={undefined} />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner */}
          <View style={styles.bannerContainer}>
            {currentImage ? (
              <Image source={{ uri: currentImage }} style={styles.bannerImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text>No Image</Text>
              </View>
            )}
          </View>

          {/* Stats row + follow button */}
          <View style={styles.statsWrapper}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>Followers</Text>
                <Text style={styles.statNumber}>{followers ?? 0}</Text>
              </View>

              {isOwner === userId && (
                <View style={styles.statBlock}>
                  <Text style={styles.statLabel}>Views</Text>
                  <Text style={styles.statNumber}>{offerData?.views ?? 0}</Text>
                </View>
              )}
            </View>

            <View style={styles.statsFollow}>
              <Button
                onPress={handleAddFollower}
                variant={isFollowing ? 'white' : 'default'}
                label={isFollowing ? 'Following' : 'Follow'}
              />
            </View>
          </View>

          {/* Galleries */}
          {offerData?.gallery?.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={styles.galleryTitle}>Image Gallery</Text>
              {renderImageGallery()}
            </View>
          )}

          {offerData?.videos?.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={styles.galleryTitle}>Videos</Text>
              {renderVideoGallery()}
            </View>
          )}

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.title}>{offerData?.title}</Text>

            <View style={styles.rowItem}>
              <View style={styles.iconBox}>
                <CalendarDays color={COLORS.primary} size={20} />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoHeading}>Expiry</Text>
                <Text style={styles.infoSmall}>
                  {offerData?.offerExpiryDate
                    ? new Date(offerData.offerExpiryDate).toDateString()
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.rowItem}>
              <View style={styles.iconBox}>
                <MapPin color={COLORS.primary} size={20} />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoHeading}>Location</Text>
                <Text style={styles.infoSmall}>
                  {offerData?.businessProfile?.location?.addressLine1 ?? '-'}
                  {'\n'}
                  {offerData?.businessProfile?.location?.city ?? ''} -{' '}
                  {offerData?.businessProfile?.location?.pincode ?? ''}
                </Text>
              </View>
            </View>

            {/* Business */}
            <View style={styles.businessRow}>
              <View style={styles.businessLeft}>
                {offerData?.businessProfile?.logo ? (
                  <Image
                    source={{ uri: offerData.businessProfile.logo }}
                    style={styles.avatarLarge}
                  />
                ) : (
                  <View style={[styles.avatarLarge, styles.avatarFallback]}>
                    <Briefcase color={COLORS.primary} size={24} />
                  </View>
                )}
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text numberOfLines={2} style={styles.businessName}>
                    {offerData?.businessProfile?.name ?? 'Business Name'}
                  </Text>
                  <Text style={styles.businessSub}>
                    {offerData?.businessProfile?.category.name ?? ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Offer type */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {offerData?.offerType === 'buy-one-get-one'
                    ? 'Buy 1 Get 1 Free'
                    : offerData?.offerType === 'discount'
                    ? `${offerData?.offerValue}% off`
                    : offerData?.offerType === 'free-shipping'
                    ? 'Free Shipping'
                    : 'Offer'}
                </Text>
              </View>
            </View>

            {/* About */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>About Offer</Text>
              <Text style={styles.sectionText}>
                {offerData?.description ?? 'No description provided.'}
              </Text>

              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                Offer Details
              </Text>
              <Text style={styles.sectionText}>
                {offerData?.offerDetails ?? 'No additional details.'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <LinearGradient
          colors={['#f3f4f852', COLORS.white]}
          style={styles.bottomCta}
        >
          <Button onPress={handleDirection} variant="default" label="Get Directions" />
        </LinearGradient>

        {/* Full-screen video modal */}
        <Modal
          visible={!!fullScreenVideoUri}
          animationType="slide"
          onRequestClose={closeFullScreenVideo}
        >
          <SafeAreaView style={styles.fullScreenVideoContainer}>
            <Pressable onPress={closeFullScreenVideo} style={styles.closeButton}>
              <X size={30} color={COLORS.white} />
            </Pressable>

            {fullScreenVideoUri && (
              <Video
                ref={setFullScreenVideoRef}
                source={{ uri: fullScreenVideoUri }}
                style={{ flex: 1, width: '100%' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping={false}
              />
            )}
          </SafeAreaView>
        </Modal>

        {/* Full-screen image modal */}
        <Modal
          visible={!!fullScreenImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFullScreenImage(null)}
        >
          <View style={styles.fullScreenImageContainer}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setFullScreenImage(null)}
            >
              <X size={30} color={COLORS.white} />
            </Pressable>
            {fullScreenImage && (
              <Image
                source={{ uri: fullScreenImage }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </View>

      {/* ✅ ActivityIndicator Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default OfferDetailsScreen;

const styles = StyleSheet.create({
  fullScreenImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 18,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 8,
    borderRadius: 20,
  },

  bannerContainer: {
    width: '100%',
    height: BANNER_H,
    overflow: 'hidden',
    backgroundColor: COLORS.gray2,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: BANNER_H,
    backgroundColor: COLORS.gray2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // stats
  statsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: -28,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#F6F4F2',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 2,
  },
  statBlock: { marginRight: 22 },
  statLabel: { fontSize: 12, fontFamily: FONT.medium, color: COLORS.primary },
  statNumber: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLORS.black,
    marginTop: 4,
  },
  statsFollow: { marginLeft: 12 },

  // galleries
  gallerySection: {
    marginTop: 18,
    paddingVertical: 6,
    paddingLeft: 18,
  },
  galleryTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    marginBottom: 10,
    paddingRight: 18,
  },
  galleryListContent: { paddingRight: 18 },
  galleryCard: {
    width: width * 0.7,
    height: width * 0.45,
    marginRight: 14,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.gray2,
    elevation: 3,
  },
  galleryImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  videoCard: {
    width: width * 0.85,
    height: width * 0.55,
    marginRight: 14,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
  },
  videoBackground: { width: '100%', height: '100%' },
  playOverlay: {
    position: 'absolute',
    top: '42%',
    left: '42%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 40,
    padding: 10,
  },

  // info
  infoCard: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: COLORS.white,
  },
  title: { fontSize: 26, fontFamily: FONT.bold, color: COLORS.black, marginBottom: 12 },
  rowItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextWrap: { flex: 1 },
  infoHeading: { fontSize: 14, fontFamily: FONT.semiBold, color: COLORS.black },
  infoSmall: {
    fontSize: 13,
    fontFamily: FONT.regular,
    color: COLORS.gray,
    marginTop: 2,
  },
  businessRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  businessLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarLarge: { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: {
    backgroundColor: '#E8EEF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessName: { fontSize: 16, fontFamily: FONT.bold, color: COLORS.black },
  businessSub: { fontSize: 13, fontFamily: FONT.medium, color: COLORS.gray },

  badgeRow: { flexDirection: 'row', marginTop: 12 },
  badge: {
    backgroundColor: '#FCE8E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 13, fontFamily: FONT.semiBold, color: COLORS.red },

  sectionTitle: { fontSize: 16, fontFamily: FONT.bold, marginBottom: 4 },
  sectionText: { fontSize: 14, fontFamily: FONT.regular, color: COLORS.black },

  bottomCta: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#E8E8E8',
  },

  fullScreenVideoContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ loader overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
