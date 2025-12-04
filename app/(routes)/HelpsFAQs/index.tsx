import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ScrollView, } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';

interface FAQItemProps {
  item: {
    question: string;
    answer: string;
  };
  index: number;
}

const FAQItem = ({ item, index }: FAQItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (

    <TouchableOpacity activeOpacity={0.5} onPress={() => setExpanded(!expanded)} style={styles.faqItem}>
      <View style={[styles.questionContainer, { flexDirection: 'row' }]}>
        <Text style={styles.questionText}>{index + 1}. {item.question}</Text>
        <Icon style={{ marginLeft: 'auto' }}
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} // Change icon based on expanded state
          size={24}
          color={COLORS.white}
        />
      </View>
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const FAQScreen = () => {
  const navigation = useNavigation();
  const faqs = [
    {
      question: "What is OffersHolic?",
      answer: "OffersHolic is a platform where users can view nearby offers, and businesses can register to post offers and advertisements."
    },
    {
      question: "How do I find offers near me?",
      answer: "You can view offers by allowing location access, or by entering your location manually in the app."
    },
    {
      question: "How do I register my business on OffersHolic?",
      answer: "Go to the 'Create Business Profile' section, fill out the required details, and start posting offers and ads for your business."
    },
    {
      question: "Is there a fee to register my business?",
      answer: "Basic registration is free, but we offer premium plans for advanced advertising features."
    },
    {
      question: "Can I customize the notifications I receive?",
      answer: "Yes, you can customize your notification preferences in the settings menu, including offer categories and specific businesses."
    },
    {
      question: "How can I redeem an offer?",
      answer: "When you find an offer, tap on it to view the details. Some offers will require you to show a code or redeem directly in-store or online."
    },
    {
      question: "Are the offers shown in real-time?",
      answer: "Yes, OffersHolic provides real-time updates on new offers and discounts from nearby businesses."
    },
    {
      question: "Can I share offers with friends?",
      answer: "Yes, you can share offers via social media or messaging apps directly from the app."
    },
    {
      question: "What if I encounter an issue with an offer?",
      answer: "If you face any issues, you can report the offer through the 'Report Issue' button on the offer details page."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team through the 'Help & Support' section in the app or by emailing support@offersholic.com."
    }
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Help & FAQs",
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactInfo}>contact@zephyrapps.in</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone:</Text>
            <Text style={styles.contactInfo}>+91 7013396624</Text>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: COLORS.white, }}>
          <FlatList
            contentContainerStyle={{ padding: 20 }}
            data={faqs}
            scrollEnabled={false}
            renderItem={({ item, index }) => <FAQItem item={item} index={index} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  faqItem: {
    marginBottom: SIZES.small,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.lightWhite,
    overflow: 'hidden',
  },
  questionContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.primary,
  },
  questionText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  answerContainer: {
    padding: SIZES.medium,
  },
  answerText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  contactCard: {
    padding: SIZES.medium,
    backgroundColor: COLORS.lightWhite,
    marginBottom: SIZES.medium,
  },
  contactTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: SIZES.small,
  },
  contactLabel: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginRight: SIZES.small,
  },
  contactInfo: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});
