import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import {
  Briefcase,
  MapPin,
  MoreVertical,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { patchData } from '@/lib/axiosUtility';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { LinearGradient } from 'expo-linear-gradient';

interface AdCardProps {
  id: string;
  title: string;
  expiry: string;
  location: string;
  image: string;
  businessName: string;
  businessLogo: string;
  saved?: boolean;
  fullWidth?: boolean;
  afterSave?: () => void;
  status?: string;
  confirmDelete?: () => void;
  myAds?: boolean;
  submitClarification?: () => void;
  viewClarification?: () => void;
}

const AdCard = ({
  id,
  title,
  expiry,
  location,
  image,
  businessLogo,
  status,
  saved,
  afterSave,
  viewClarification,
  submitClarification,
  businessName,
  confirmDelete,
  fullWidth,
  myAds,
}: AdCardProps) => {
  const [isSaved, setIsSaved] = useState(saved);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const handleSubmitClarification = () => {
    submitClarification && submitClarification();
  };

  const handleViewClarification = () => {
    viewClarification && viewClarification();
  };

 const handleShare = async (id: string, title: string) => {
  try {
    const appLink = `offersholic://ad/${id}`;
    await Share.share({
      title: title,
      message: `Check out this offer in the OffersHolic app: ${title}\n\n${appLink}`,
      url: appLink,
    });
  } catch (error) {
    console.error("Share error:", error);
  }
};

  return (
    <LinearGradient
     colors={['#141e30', '#243b55']} 
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}
      style={[adCardStyles.card, { width: fullWidth ? '100%' : 300 }]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/ad/${id}`)}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => router.push(`/ad/${id}`)}
        >
          <View style={adCardStyles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={adCardStyles.image}
              />
            ) : (
              <View
                style={[
                  adCardStyles.image,
                  { justifyContent: 'center', alignItems: 'center' },
                ]}
              >
                <Text
                  style={{
                    fontFamily: FONT.regular,
                    fontSize: SIZES.small,
                    color: COLORS.tertiary,
                  }}
                >
                  No Image
                </Text>
              </View>
            )}

            {status && (
              <View
                style={[
                  adCardStyles.statusContainer,
                  {
                    backgroundColor:
                      status.toLowerCase() === 'pending review'
                        ? '#fdba74'
                        : status.toLowerCase() === 'clarification required'
                        ? '#fef08a'
                        : status.toLowerCase() === 'clarification submitted'
                        ? '#fef08a'
                        : status.toLowerCase() === 'approved'
                        ? '#bbf7d0'
                        : status.toLowerCase() === 'active'
                        ? '#bbf7d0'
                        : status.toLowerCase() === 'inactive'
                        ? '#fecaca'
                        : status.toLowerCase() === 'rejected'
                        ? '#fecaca'
                        : status.toLowerCase() === 'expired'
                        ? '#fecaca'
                        : '#e5e7eb',
                  },
                ]}
              >
                <Text style={adCardStyles.status}>
                  {status.toLowerCase() === 'clarification required'
                    ? 'clarification requested'
                    : status}
                </Text>
              </View>
            )}

            <Menu style={[adCardStyles.bookmarkContainer]}>
              <MenuTrigger>
                <BlurView
                  intensity={100}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 10,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MoreVertical color={COLORS.white} size={22} />
                </BlurView>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    backgroundColor: COLORS.white,
                    borderRadius: 16,
                    padding: 10,
                    marginTop: 10,
                  },
                }}
              >
                {myAds && status === 'clarification required' && (
                  <MenuOption
                    onSelect={handleSubmitClarification}
                    text="Submit Clarification"
                  />
                )}
                {myAds && status === 'clarification submitted' && (
                  <MenuOption
                    onSelect={handleViewClarification}
                    text="View Clarification"
                  />
                )}
                <MenuOption onSelect={handleShare} text="Share" />
                <MenuOption
                  onSelect={async () => {
                    try {
                      const res = await patchData(`/offer/v1/${id}/save`);
                      if (res.message === 'Offer saved successfully') {
                        setIsSaved(true);
                        afterSave && afterSave();
                      } else {
                        setIsSaved(false);
                        afterSave && afterSave();
                      }
                    } catch (error: any) {
                      console.log(
                        'error',
                        error?.response?.data?.message
                      );
                    }
                  }}
                  text={isSaved ? 'Unsave' : 'Save'}
                />
                {myAds && (
                  <MenuOption
                    onSelect={() => router.push(`/editOffer/${id}`)}
                    text="Edit"
                  />
                )}
                {myAds && (
                  <MenuOption
                    onSelect={() => confirmDelete && confirmDelete()}
                    text="Delete"
                  />
                )}
              </MenuOptions>
            </Menu>
          </View>
        </TouchableWithoutFeedback>

        <View style={adCardStyles.detailsContainer}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text
              numberOfLines={1}
              style={[
                adCardStyles.title1,
                { width: '80%', textAlign: 'center' },
              ]}
            >
              {title || 'No Title Found'}
            </Text>
            <Text style={adCardStyles.expiry}>
              Expiring on{' '}
              {new Date(expiry).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View style={adCardStyles.locationContainer}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {businessLogo?.includes('http') ? (
                <Image
                  source={{ uri: businessLogo }}
                  style={{ height: 40, width: 40 }}
                />
              ) : (
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: COLORS.primary_light,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Briefcase color={COLORS.primary} size={16} />
                </View>
              )}
            </View>
            <View style={{ marginLeft: 5 }}>
              <Text
                numberOfLines={1}
                style={[
                  adCardStyles.businessName,
                  { width: fullWidth ? '100%' : '80%' },
                ]}
              >
                {businessName}
              </Text>
              <View style={adCardStyles.locationContainer}>
                <MapPin color={COLORS.gray} size={12} />
                <Text style={adCardStyles.location}>{location}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text
          style={adCardStyles.dashedLine}
          ellipsizeMode="clip"
          numberOfLines={1}
        >
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        </Text>
        <View style={adCardStyles.cutoutLeft} />
        <View style={adCardStyles.cutoutRight} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export const adCardStyles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    padding: 12,
    height: 200,
    width: '100%',
    borderRadius: 10,
  },
  image: {
    height: 180,
    backgroundColor: COLORS.gray2,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  statusContainer: {
    position: 'absolute',
    top: 25,
    left: 25,
    padding: 5,
    borderRadius: 16,
  },
  status: {
    fontFamily: FONT.medium,
    fontSize: SIZES.xSmall,
    color: COLORS.black,
    textTransform: 'capitalize',
  },
  bookmarkContainer: {
    position: 'absolute',
    top: 25,
    right: 25,
    padding: 5,
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 15,
    gap: 10,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    width:260,
    
  },
   title1: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color:"white"
    
  },
  expiry: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: '#ef4444',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  location: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  businessName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color:'white',
  },
  cutoutLeft: {
    position: 'absolute',
    left: -20,
    top: '62%',
    marginTop: -20,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cutoutRight: {
    position: 'absolute',
    right: -20,
    top: '62%',
    marginTop: -20,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dashedLine: {
    position: 'absolute',
    top: '58%',
    marginTop: -1,
    width: '100%',
    fontWeight: 'semibold',
    left: 20,
    fontSize: 20,
    opacity: 0.5,
    color: COLORS.white,
  },
});

export default AdCard;
