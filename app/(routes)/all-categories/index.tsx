import { FlatList, Platform, SafeAreaView, ScrollView, StatusBar, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { fetchData } from '@/lib/axiosUtility';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT } from '@/constants/theme';
import CategoriesCard from '@/components/Create/CategoriesCard';
import { router, useNavigation } from 'expo-router';

const index = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]) as any;
  const navigation = useNavigation();
  const getCategories = async () => {
    try {
      const res = await fetchData('/categories/v1/all') as any;
      setCategories(res);
      console.log(res);
    }
    catch (error: any) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    setLoading(true);
    getCategories().then(() => setLoading(false));
  }
    , [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'All Categories',
      headerBackTitleVisible: true,
      headerLargeTitle: true,
      headerBackTitle: 'Back',
      headerStyle: {
        backgroundColor: COLORS.white,
      },
      headerTintColor: COLORS.primary,
      headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerLargeTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
      headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
      headerShadowVisible: false,
      customAnimationOnGesture: true,
      fullScreenGestureEnabled: true,
      animationDuration: Platform.OS === "android" ? undefined : 200,
    });
  }
    , [navigation]);

  const renderCategories = ({ item }: any) => (
    <View style={{ flex: 1, margin: 5 }}>

      {item ? (
        <CategoriesCard
          selected={false}
          onSelect={() => {
            router.push(`/categories/${item._id + " " + item.name}`);
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

  const formatData = (data: any[], numColumns: number) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push(null);
      numberOfElementsLastRow++;
    }

    return data;
  };

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true);
      Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white, true);

      return () => { };
    }, [])
  );

  return (

    <SafeAreaView style={{ flex: 1, }}>
      <ScrollView style={{ flex: 1, }}>
        <View style={{ margin: 20 }}>
          <FlatList
            data={formatData(categories, 2)} // Adjust data to ensure 2 columns
            keyExtractor={(item, index) => (item ? item._id : index.toString())}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderCategories}
          />
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}

export default index
