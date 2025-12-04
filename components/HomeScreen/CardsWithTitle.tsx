import { View, Text, StyleSheet, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native'
import React from 'react'
import AdCard, { adCardStyles } from './AdCard'
import { router, useNavigation, useRouter } from 'expo-router'


interface CardsWithTitleProps {
    title: string
    href: string
    adsData: any[]
}

const CardsWithTitle = ({ title, href, adsData }: CardsWithTitleProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text numberOfLines={2} style={adCardStyles.title}>{title}</Text>
                <TouchableWithoutFeedback
                    onPress={() => {
                        // Navigate to the href
                      router.push(href as any);
                        
                    }
                    }
                >
                    <Text style={adCardStyles.location}>
                        View All
                    </Text>
                </TouchableWithoutFeedback>
            </View>
            <View style={{ width: "100%" }} >

                <FlatList
                    data={adsData}
                    renderItem={({ item }) => {
                   
                        return (
                            <View style={{ marginRight: adsData[adsData.length - 1].id === item.id ? 20 : 20, marginLeft: adsData[0].id === item.id ? 20 : 0 }}>
                                <AdCard
                                    id={item._id}
                                    title={item.title}
                                    expiry={item?.expiry}
                                    image={item?.image}
                                    location={item?.location}
                                    saved={item.saved}
                                    businessLogo={item.businessProfile?.logo}
                                    businessName={item.businessProfile?.name}

                                />
                            </View>
                        );
                    }}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            {/* <AdCard /> */}

        </View>
    )
}

export default CardsWithTitle

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',

    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
})