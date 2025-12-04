import { View, Text, SafeAreaView, ScrollView, StatusBar, Platform, TouchableOpacity, Switch } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import SearchComponent from '@/components/SearchComponent';
import { router, Stack, useFocusEffect, useNavigation } from 'expo-router';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { adsData, sortOptions, sortsAndFilters } from '@/constants';
import AdCard from '@/components/HomeScreen/AdCard';
import EmptyStateComponent from '@/components/emptyStateComponent';
import { fetchData } from '@/lib/axiosUtility';
import { Button } from '@/components/ui/Button';
import { ListFilter } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { BottomSheetComponent } from '@/components/bottomSheetComponent';
import RadioGroup from 'react-native-radio-buttons-group';

const index = () => {
    const [search, setSearch] = React.useState('');
    const navigation = useNavigation();
    const [searchResults, setSearchResults] = React.useState([]) as any;
    const [filters, setFilters] = React.useState([]) as any;
    const [sortBy, setSortBy] = React.useState('expiry') as any;


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Search',
            headerBackTitleVisible: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: COLORS.white,
                // shadowColor: 'transparent',
                // elevation: 0,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
            headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
            headerShadowVisible: false,
            customAnimationOnGesture: true,
            fullScreenGestureEnabled: true,

            animation: Platform.OS === 'ios' ? 'fade_from_bottom' : 'default',
          animationDuration: Platform.OS === "android" ? undefined : 200,

        });
    }, [navigation]);

const getSearchResults = async () => {
  try {
    if (search.trim().length > 0) {
      const res = await fetchData(
        `/offer/v1/get/all/filtered/?search=${encodeURIComponent(search)}&sortBy=${sortBy}`
      );

      const results = res?.data?.data || res?.data || [];
      setSearchResults(results);

      console.log("Fetched results:", results.length);
    } else {
      setSearchResults([]);
    }
  } catch (error) {
    console.error("Search API error:", error);
    setSearchResults([]);
  }
};


    useEffect(() => {
        if (search.length > 0) {
            // Perform search
            getSearchResults();
            // setSearchResults(adsData.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())));
        } else {
            setSearchResults([]);
        }
    }, [search, sortBy]);

    useFocusEffect(
        React.useCallback(() => {
            // Set the status bar style for this screen
            StatusBar.setBarStyle('dark-content', true); // Adjust the style if needed
            Platform.OS === 'android' && StatusBar.setBackgroundColor(COLORS.white, true); // Adjust the background color if needed

            return () => {
                // Optional cleanup for status bar (if needed)
            };
        }, [])
    );

    const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);
    const [selectedId, setSelectedId] = React.useState();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleClosePress = () => bottomSheetRef.current?.close();
    const handleOpenPress = () => bottomSheetRef.current?.expand();
    const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.tabWhite }}>

                <Stack
                    screenOptions={{
                        headerShown: true,
                        gestureEnabled: false,
                        headerTitle: 'Search',

                        // headerBackTitleVisible: true,
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: COLORS.tabWhite,

                        },
                        headerTintColor: COLORS.primary,
                        headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
                        // headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
                        headerShadowVisible: false,
                        customAnimationOnGesture: true,
                        presentation: 'modal',
                        animation: Platform.OS === 'ios' ? 'fade_from_bottom' : 'default',
                        animationDuration: Platform.OS === "android" ? undefined : 200,


                    }}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: 20 }}>
                        <View style={{ flexDirection: 'row', width: '100%', gap: 10, justifyContent: 'space-between' }}>
                            <View style={{ width: '82%' }}>
                                <SearchComponent focus value={search} placeholder="Search..." onChangeText={setSearch} />
                            </View>

                            <TouchableOpacity
                                onPress={() => snapToIndex(0)}
                                activeOpacity={0.9} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '15%', height: '90%', backgroundColor: COLORS.primary, borderRadius: 12 }} >

                                <ListFilter size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {!search ? <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: FONT.regular }}>Search for something...</Text>
                    </View>
                        : searchResults && searchResults.length > 0 ?
                            <View style={{ flex: 1, padding: 20 }}>
                                <Text>Search Results</Text>
                                {searchResults.map((item: any, index: number) => (
                                    <View key={index} style={{ marginVertical: 10, width: '100%' }} >
                                        <AdCard
                                            id={item._id}
                                            title={item.title}
                                            expiry={item.offerExpiryDate}
                                            location={item.location}
                                            image={item.featuredImage}
                                            fullWidth={true}
                                        />
                                    </View>
                                ))}
                            </View>
                            :
                            <View style={{ flex: 1, padding: 20 }}>
                                <EmptyStateComponent img={require('@/assets/images/notFound.png')} title="No Results!" subTitle="No results found for your search" />
                            </View>
                    }
                </ScrollView>
                <BottomSheetComponent title='Sort & Filter' bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} handleClosePress={handleClosePress} >
                    <View style={{ flexDirection: 'row', alignItems: 'start', width: '100%', height: '100%' }}>
                        <View style={{ flexDirection: 'column', width: '40%', height: '100%', borderRightWidth: 1, gap: 10, borderRightColor: COLORS.gray2 }}>
                            {
                                sortsAndFilters.map((item, index) => (
                                    <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'space-between', borderRightWidth: 3, borderColor: COLORS.primary }} key={index}>
                                        <Text style={{ fontFamily: FONT.regular, fontSize: 15, padding: 12 }}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))
                            }


                        </View>
                        <View style={{ flexDirection: 'row', width: '60%', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column', width: '100%', justifyContent: 'flex-start', padding: 10 }}>
                                {/* {
                                sortOptions.map((item, index) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }} key={index}>
                                        <Button label={item.name} onPress={() => { }} />
                                            </View>
                                ))  

                              } */}
                                <RadioGroup
                                    radioButtons={sortOptions as any}
                                    onPress={(value) => {
                                        
                                        setSelectedId(value);
                                        setSortBy(value);
                                        handleClosePress();
                                    }}

                                    labelStyle={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.primary }}
                                    containerStyle={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}
                                    selectedId={selectedId}
                                />

                            </View>

                        </View>
                    </View>

                </BottomSheetComponent>
            </SafeAreaView>
        </>
    )
}

export default index

// import { View, Text, SafeAreaView, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native'
// import React, {useCallback, useEffect, useLayoutEffect, useRef, useMemo } from 'react'

// import SearchComponent from '@/components/SearchComponent';
// import { Stack, useFocusEffect, useNavigation } from 'expo-router';
// import { COLORS, FONT, SIZES } from '@/constants/theme';
// import { sortOptions, sortsAndFilters } from '@/constants';
// import AdCard from '@/components/HomeScreen/AdCard';
// import EmptyStateComponent from '@/components/emptyStateComponent';
// import { fetchData } from '@/lib/axiosUtility';
// import { ListFilter } from 'lucide-react-native';
// import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
// import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
// import { BottomSheetComponent } from '@/components/bottomSheetComponent';
// import RadioGroup from 'react-native-radio-buttons-group';

// const Index = () => {
//   const [search, setSearch] = React.useState('');
//   const navigation = useNavigation();

//   const [allOffers, setAllOffers] = React.useState([]) as any;
//   const [searchResults, setSearchResults] = React.useState([]) as any;

//   const [sortBy, setSortBy] = React.useState('expiry') as any;
//   const [selectedId, setSelectedId] = React.useState();

//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ['40%', '50%', '80%'], []);

//   // 🟢 Fetch all offers once
//   const getAllOffers = async () => {
//     try {
//       const res = await fetchData(`/offer/v1/get/all?status=active`);
//       const results = res?.data?.data || res?.data || [];
//       setAllOffers(results);
//       setSearchResults(results); // initially show all
//     } catch (error) {
//       console.error("Offers API error:", error);
//       setAllOffers([]);
//       setSearchResults([]);
//     }
//   };

//   useEffect(() => {
//     getAllOffers();
//   }, []);

//   // 🟢 Filter in frontend when search or sort changes
//   useEffect(() => {
//     let filtered = allOffers;

//     // filter by search
//     if (search.trim().length > 0) {
//       filtered = filtered.filter((item: any) =>
//         item.title.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     // sort
//     if (sortBy === 'expiry') {
//       filtered = [...filtered].sort(
//         (a: any, b: any) => new Date(a.offerExpiryDate).getTime() - new Date(b.offerExpiryDate).getTime()
//       );
//     } else if (sortBy === 'title') {
//       filtered = [...filtered].sort((a: any, b: any) =>
//         a.title.localeCompare(b.title)
//       );
//     }
//     // add more sort options if needed

//     setSearchResults(filtered);
//   }, [search, sortBy, allOffers]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: true,
//       headerTitle: 'Search',
//       headerBackTitleVisible: true,
//       headerBackTitle: 'Back',
//       headerStyle: { backgroundColor: COLORS.white },
//       headerTintColor: COLORS.primary,
//       headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
//       headerBackTitleStyle: { color: COLORS.primary, fontFamily: FONT.regular },
//       headerShadowVisible: false,
//       animation: Platform.OS === 'ios' ? 'fade_from_bottom' : 'default',
//       animationDuration: Platform.OS === "android" ? undefined : 200,
//     });
//   }, [navigation]);

//   useFocusEffect(
//     React.useCallback(() => {
//       StatusBar.setBarStyle('dark-content', true);
//       if (Platform.OS === 'android') StatusBar.setBackgroundColor(COLORS.white, true);
//     }, [])
//   );

//   const handleClosePress = () => bottomSheetRef.current?.close();
//   const snapToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
//   const renderBackdrop = useCallback(
//     (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
//     []
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.tabWhite }}>
//       <Stack screenOptions={{
//         headerShown: true,
//         gestureEnabled: false,
//         headerTitle: 'Search',
//         headerBackTitle: 'Back',
//         headerStyle: { backgroundColor: COLORS.tabWhite },
//         headerTintColor: COLORS.primary,
//         headerTitleStyle: { color: COLORS.primary, fontFamily: FONT.bold },
//         headerShadowVisible: false,
//         animation: Platform.OS === 'ios' ? 'fade_from_bottom' : 'default',
//       }} />

//       <ScrollView style={{ flex: 1 }}>
//         <View style={{ flex: 1, padding: 20 }}>
//           <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
//             <View style={{ width: '82%' }}>
//               <SearchComponent focus value={search} placeholder="Search..." onChangeText={setSearch} />
//             </View>

//             <TouchableOpacity
//               onPress={() => snapToIndex(0)}
//               activeOpacity={0.9}
//               style={{ justifyContent: 'center', alignItems: 'center', width: '15%', height: '90%', backgroundColor: COLORS.primary, borderRadius: 12 }}>
//               <ListFilter size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {searchResults.length > 0 ? (
//           <View style={{ flex: 1, padding: 20 }}>
//             <Text>Search Results</Text>
//             {searchResults.map((item: any, index: number) => (
//               <View key={index} style={{ marginVertical: 10, width: '100%' }} >
//                 <AdCard
//                   id={item._id}
//                   title={item.title}
//                   expiry={item.offerExpiryDate}
//                   location={item.location}
//                   image={item.featuredImage}
//                   fullWidth={true}
//                 />
//               </View>
//             ))}
//           </View>
//         ) : (
//           <View style={{ flex: 1, padding: 20 }}>
//             <EmptyStateComponent
//               img={require('@/assets/images/notFound.png')}
//               title="No Results!"
//               subTitle="No results found for your search"
//             />
//           </View>
//         )}
//       </ScrollView>

//       <BottomSheetComponent
//         title='Sort & Filter'
//         bottomSheetRef={bottomSheetRef}
//         snapPoints={snapPoints}
//         handleClosePress={handleClosePress}
//       >
//         <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
//           {/* Sidebar */}
//           <View style={{ flexDirection: 'column', width: '40%', borderRightWidth: 1, gap: 10, borderRightColor: COLORS.gray2 }}>
//             {sortsAndFilters.map((item, index) => (
//               <TouchableOpacity key={index}>
//                 <Text style={{ fontFamily: FONT.regular, fontSize: 15, padding: 12 }}>{item.name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Right Side */}
//           <View style={{ flexDirection: 'column', width: '60%', padding: 10 }}>
//             <RadioGroup
//               radioButtons={sortOptions as any}
//               onPress={(value) => {
//                 setSelectedId(value);
//                 setSortBy(value);
//                 handleClosePress();
//               }}
//               labelStyle={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.primary }}
//               containerStyle={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}
//               selectedId={selectedId}
//             />
//           </View>
//         </View>
//       </BottomSheetComponent>
//     </SafeAreaView>
//   )
// }

// export default Index;
