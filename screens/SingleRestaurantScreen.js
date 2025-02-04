import { StyleSheet, Text, View, Image, ImageBackground, SafeAreaView, ScrollView, Dimensions, StatusBar, Modal, Pressable, Linking, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import restImg from '../assets/4.jpg'
import globalStyles from '../constants/globalStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { fetchRestaurantByCoordsID } from '../servers/fetchRestaurants'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const SingleRestaurantScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState({})
    const [hoursVisible, setHoursVisible] = useState(false);

    const id = route.params.id
    const latitude = route.params.latitude
    const longitude = route.params.longitude

    useEffect(() => {
        FetchRestaurant()
    }, [id, latitude, longitude])

    const FetchRestaurant = useCallback(async () => {
        setLoading(true);
        try {
            const Restaurantdata = await fetchRestaurantByCoordsID(latitude, longitude, id);
            //console.log(Restaurantsdata)
            setRestaurant(Restaurantdata);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    }, []);


    const [isLoaded] = useFonts({
        "popR": require("../assets/fonts/Poppins-Regular.ttf"),
        "popM": require("../assets/fonts/Poppins-Medium.ttf"),
        "popS": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "popB": require("../assets/fonts/Poppins-Bold.ttf")
    });

    const handleOnLayout = useCallback(async () => {
        if (isLoaded) {
            await SplashScreen.hideAsync(); //hide the splashscreen
        }
    }, [isLoaded]);

    if (!isLoaded) {
        return null;
    }

    const now = new Date();

    const daysOfWeek = [`Sunday, ${restaurant.tSun}`, `Monday, ${restaurant.tMon}`, `Tuesday, ${restaurant.tTue}`, `Wednesday, ${restaurant.tWed}`, `Thursday, ${restaurant.tThu}`, `Friday, ${restaurant.tFri}`, `Saturday, ${restaurant.tSat}`];

    const dayOfWeek = daysOfWeek[now.getDay()].split(',')

    const openMap = () => {
        const scheme = Platform.select({
            ios: `maps://?q=${restaurant.restaurantName}&ll=${restaurant.latitude},${restaurant.longitude}`,
            android: `geo:${restaurant.latitude},${restaurant.longitude}?q=${restaurant.latitude},${restaurant.longitude}(${restaurant.restaurantName})`,
        });

        if (scheme) {
            Linking.openURL(scheme).catch(err =>
                console.error('Error opening map: ', err),
            );
        }
    };

    return (
        <SafeAreaView style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                animated={true}
                backgroundColor="#000000"
                statusBarStyle='light-content'
            />
            <View style={globalStyles.restheader}>
                <ImageBackground style={styles.restImg} source={restImg} resizeMode='cover' />
                <View style={globalStyles.overlayView}></View>
                <Pressable onPress={()=>navigation.navigate('Restaurants')} style={{ position: 'absolute', top: 10, left: 10, padding: 6, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12 }}><MaterialCommunityIcons name="keyboard-backspace" size={24} color="#2D2729" /></Pressable>
            </View>
            <View style={[{ marginTop: 10 }, globalStyles.container, globalStyles.contentArea]}>
                <View style={{ marginBottom: 25 }}>
                    <Text style={styles.restTitle}>{restaurant.restaurantName}</Text>
                    <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>
                        <View style={styles.ratingcard}><View style={styles.rating}><Text style={{ color: '#FFFFFF' }}>5<Entypo name="star" size={15} color="#FFFFFF" /></Text></View><View><Text style={{ fontSize: 14, lineHeight: 16, textAlign: 'center', fontFamily: 'popS', textTransform: 'uppercase', color: '#2D2729', marginTop: 10 }}>Halal Rating</Text></View></View>
                        <View style={styles.ratingcard}><View style={styles.rating}><Text style={{ color: '#FFFFFF' }}>3<Entypo name="star" size={15} color="#FFFFFF" /></Text></View><View><Text style={{ fontSize: 14, lineHeight: 16, textAlign: 'center', fontFamily: 'popS', textTransform: 'uppercase', color: '#2D2729', marginTop: 10 }}>Google Rating</Text></View></View>
                        <Pressable style={styles.favour}><SimpleLineIcons name="heart" size={24} color="#B1D235" /></Pressable>
                    </View>
                </View>
                <View>
                    <View style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="location-pin" size={24} style={styles.rowicon} /><Text style={styles.rowinfo}>{restaurant.formattedAddress}</Text></View></View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={hoursVisible}
                    onRequestClose={() => setHoursVisible(!hoursVisible)}>
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        marginBottom: 0,
                        height: '100%',
                    }}>
                        <View style={{
                            height: '50%',
                            marginTop: 'auto',
                            backgroundColor: '#ffffff',
                            borderTopStartRadius: 25,
                            borderTopEndRadius: 25
                        }}>
                            <View style={globalStyles.container}>
                                <View style={[{ paddingBottom: 0 }, globalStyles.contentArea]}>
                                    <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                        <Text style={{ fontSize: 20, fontFamily: 'popS' }}>Hours</Text>
                                        <Pressable onPress={() => setHoursVisible(!hoursVisible)}>
                                            <SimpleLineIcons name="close" size={28} color="#2D2729" />
                                        </Pressable>
                                    </View>
                                    <ScrollView>
                                        {daysOfWeek.map((item, index) => {
                                            let value = item.split(',')
                                            return <View key={index} style={[styles.row, styles.rowsm]}><Text style={styles.rowinfotimetxt1}>{value[0]}</Text><Text style={styles.rowinfotimetxt2}>{value[1]}</Text></View>
                                        })}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View>
                    <Pressable onPress={() => setHoursVisible(true)} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="clock" size={24} style={styles.rowicon} /><View style={styles.rowinfotime}><Text style={styles.rowinfotimetxt1}>{dayOfWeek[0]}:</Text><Text style={styles.rowinfotimetxt2}>{dayOfWeek[1]}</Text></View></View><SimpleLineIcons name="arrow-down" size={20} style={styles.rowicon} /></Pressable>

                    <Pressable onPress={() => openMap()} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="map" size={24} style={styles.rowicon} /><Text style={styles.rowinfo}>Open in Google Maps</Text></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>

                    <Pressable onPress={() => { Linking.openURL(`tel:${restaurant.telephoneNo}`) }} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="phone" size={24} style={styles.rowicon} /><Text style={styles.rowinfo}>{restaurant.telephoneNo}</Text></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default SingleRestaurantScreen

const styles = StyleSheet.create({
    restImg: {
        width: Dimensions.get('window').width,
        height: 180,
        //marginBottom: 30
    },
    restTitle: {
        width: Dimensions.get('window').width - 30,
        textAlign: 'left',
        fontSize: 24,
        lineHeight: 28,
        fontFamily: 'popS',
        color: '#2D2729',
        marginBottom: 20
    },
    ratingcard: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e5e5e7',
        boxShadow: '0 2px 3px #e5e5e7',
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(177,210,53,0.15)'
    },
    rating: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#B1D235',
        width: 40
    },
    row: {
        width: Dimensions.get('window').width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        paddingBottom: 18,
        marginBottom: 18,
        borderBottomColor: '#ddd',
        borderStyle: 'dotted',
        borderBottomWidth: 2
    },
    rowsm: {
        justifyContent: 'space-between',
        paddingBottom: 10,
        marginBottom: 10,
    },
    rowinner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
    },
    rowicon: {
        color: '#2D2729'
    },
    rowinfo: {
        fontSize: 17,
        color: '#2D2729',
        fontFamily: 'popM',
        width: Dimensions.get('window').width - 105
    },
    rowinfotime: {
        flexDirection: 'row',
        width: Dimensions.get('window').width - 105
    },
    rowinfotimetxt1: {
        fontSize: 17,
        color: '#2D2729',
        fontFamily: 'popS',
    },
    rowinfotimetxt2: {
        fontSize: 17,
        color: '#2D2729',
        fontFamily: 'popM',
        paddingEnd: 10
    },
    fbtn: {
        width: '60%',
    },
    favour: {
        padding: 12, 
        backgroundColor: '#ffffff', 
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e5e5e7',
        boxShadow: '0 2px 3px #e5e5e7',
    }
})