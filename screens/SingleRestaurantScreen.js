import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, ImageBackground, Linking, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LikeBtnComponent from '../components/LikeBtnComponent';
import ModelComponent from '../components/ModelComponent';
import globalStyles from '../constants/globalStyles';
import { fetchRestaurantByCoordsID, fetchRestaurantByID } from '../servers/restaurants';

const HEADER_MAX_HEIGHT = 250; // initial height
const HEADER_MIN_HEIGHT = 70;  // shrunk height
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const SingleRestaurantScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState({})
    const [hoursVisible, setHoursVisible] = useState(false);
    //const [restImg, SetRestImg] = useState({uri: null});

    const id = route.params.id
    const currentLocation = route.params.currentLocation
    const latitude = route.params.latitude
    const longitude = route.params.longitude

    const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

    const restImg = { uri: 'https://backend.halalfoodnearme.com.au/artifacts/240x120/android/4.jpg' };

    useEffect(() => {
        FetchRestaurant()
    }, [id])

    const handleBack = () => {
        const from = route.params?.from;
        if (from === "Home" || from === "Result" || from === "Favorite" || from === "MapView") {
            navigation.goBack();   // OK for A screens
        } else {
            navigation.navigate('Main')
        }
    }

    const FetchRestaurant = useCallback(async () => {
        setLoading(true);
        try {
            const Restaurantdata = (latitude !== "" && longitude !== "") ? await fetchRestaurantByCoordsID(latitude, longitude, id) : await fetchRestaurantByID(id);
            setRestaurant(Restaurantdata);
            //console.log("Restaurantdata", Restaurantdata)
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const now = DateTime.now().setZone("Australia/Sydney");
    const day = now.weekdayLong;

    const { formattedAddress, restaurantName, telephoneNo, rating, distancekm, remark_1, remark_2, verifiedDate, daysOfWeek, GoogleRating, photo_reference } = restaurant

    const index = daysOfWeek && daysOfWeek.findIndex(val => val.includes(day))

    const dayOfWeek = daysOfWeek && daysOfWeek[index].split(',')

    /* useEffect(() => {
        SetRestImg({uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo_reference}&key=${GOOGLE_MAPS_API_KEY}`})
    }, [photo_reference, GOOGLE_MAPS_API_KEY]) */

    const openMap = () => {
        const encodedAddress = encodeURIComponent(formattedAddress); // Encode for URL
        const encodedName = encodeURIComponent(restaurantName);
        /* const url = Platform.select({
            ios: `maps://?q=${encodedAddress}(${encodeURIComponent(restaurantName)})`,
            android: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}(${encodeURIComponent(restaurantName)})`,
        }) */;

        const url = Platform.select({
            ios: `maps://?q=${encodedAddress}(${encodedName})&ll=${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=${encodedAddress}(${encodedName})`,
        });

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'Maps app is not available.');
                }
            })
            .catch((err) => {
                Alert.alert('Error', 'Could not open maps. Please try again.');
                console.error('An error occurred opening maps', err);
            });
    };

    const handleReview = () => {
        navigation.navigate('SingleRestaurantHalalReview', {
            rid: id,
            resname: restaurantName
        })
    }

    SplashScreen.preventAutoHideAsync();

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

    const scrollY = useRef(new Animated.Value(0)).current;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: "clamp",
    });

    const FormattedVerifiedDate = new Date(verifiedDate).toLocaleDateString("en-AU", {
        timeZone: "Australia/Sydney",
    });

    return (
        <View style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                statusBarStyle='light-content'
            />
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <ImageBackground
                    source={restImg} // Replace with your image path
                    style={styles.restImg}
                    resizeMode="cover" // Or contain, depending on your needs
                >
                    <View style={globalStyles.overlayView}>
                        <Pressable onPress={() => handleBack()} style={{ position: 'absolute', top: 32, left: 6, padding: 10, zIndex: 99 }}><MaterialCommunityIcons name="keyboard-backspace" size={28} color="#ffffff" /></Pressable>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10, position: 'absolute', top: 30, right: 6, zIndex: 99 }}>
                            <LikeBtnComponent rid={id} style={{ padding: 10 }} />
                            <MaterialCommunityIcons name="share-variant" size={28} color="#ffffff" style={{ padding: 10 }} />
                        </View>
                    </View>
                </ImageBackground>
            </Animated.View>
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {isLoading ?
                    <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, }]}>
                        <ActivityIndicator size='50' color='#B1D235' />
                    </View> :
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <View>
                            <View style={styles.restHead}>
                                <View style={{ width: Dimensions.get('window').width - 30, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                                    <Text style={styles.restTitle}>{restaurantName}</Text>
                                </View>
                                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>
                                    {distancekm !== '' && <Text style={[styles.ratingcardtitle, styles.distance]}>{distancekm}</Text>}
                                    <View style={styles.ratingcard}><View style={[styles.rating, styles.hrating]}><Text style={{ color: '#FFFFFF' }}>{rating ? rating : 0}<Entypo name="star" size={15} color="#FFFFFF" /></Text></View><View><Text style={styles.ratingcardtitle}>Halal{"\n"}Rating</Text></View></View>
                                    <View style={styles.ratingcard}><View style={[styles.rating, styles.grating]}><Text style={{ color: '#FFFFFF' }}>{GoogleRating}<Entypo name="star" size={15} color="#FFFFFF" /></Text></View><View><Text style={styles.ratingcardtitle}>Google{"\n"}Rating</Text></View></View>
                                </View>
                            </View>
                            <View style={[{ paddingHorizontal: 15 }]}>
                                <View>
                                    <View style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="location-pin" size={24} style={styles.rowicon} /><Text style={styles.rowinfo}>{formattedAddress}</Text></View></View>
                                </View>
                                <ModelComponent visible={hoursVisible} onDismiss={() => setHoursVisible(false)} heading='Hours' subheading=''>
                                    <ScrollView>
                                        {daysOfWeek && daysOfWeek.map((item, index) => {
                                            let value = item.split(',')
                                            return <View key={index} style={[styles.row, styles.rowsm]}><Text style={styles.rowinfotimetxt1}>{value[0]}</Text><Text style={styles.rowinfotimetxt2}>{value[1]}</Text></View>
                                        })}
                                    </ScrollView>
                                </ModelComponent>
                                <View>
                                    <Pressable onPress={() => setHoursVisible(true)} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="clock" size={24} style={styles.rowicon} /><View style={styles.rowinfotime}><Text style={styles.rowinfotimetxt1}>{dayOfWeek[0]}: </Text><Text style={styles.rowinfotimetxt2}>{dayOfWeek[1]}</Text></View></View><SimpleLineIcons name="arrow-down" size={20} style={styles.rowicon} /></Pressable>

                                    <Pressable onPress={() => openMap()} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="map" size={24} style={styles.rowicon} /><Text style={styles.rowinfo}>Open in Google Maps</Text></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>

                                    <Pressable onPress={() => { Linking.openURL(`tel:${telephoneNo}`) }} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="phone" size={24} style={styles.rowicon} /><Text style={styles.rowinfo}>{telephoneNo}</Text></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>
                                    {(remark_1 || remark_2) &&
                                        <View style={styles.remarks}>
                                            <Text style={{ fontFamily: 'popS', marginBottom: 5 }}>Remark(s)</Text>
                                            {remark_1 && <View style={styles.rowinner}><Entypo name="dot-single" size={24} color="black" /><Text style={{ width: Dimensions.get('window').width - 80 }}>{remark_1}</Text></View>}
                                            {remark_2 && <View style={styles.rowinner}><Entypo name="dot-single" size={24} color="black" /><Text style={{ width: Dimensions.get('window').width - 80 }}>{remark_2}</Text></View>}
                                        </View>}
                                </View>
                            </View>
                        </View>
                        <View style={{ width: Dimensions.get('window').width - 30, paddingHorizontal: 15, marginVertical: 30 }}>
                            {verifiedDate && <Text style={styles.reviewTitle}>Last Verified on {FormattedVerifiedDate}</Text>}
                            <Text style={styles.reviewSubTitle}>Help your community by <Text style={{ fontFamily: 'popB', color: "#87aa03" }} onPress={handleReview}>Verifying</Text></Text>
                        </View>
                    </View>
                }
            </Animated.ScrollView>
        </View>
    )
}

export default SingleRestaurantScreen

const styles = StyleSheet.create({
    scrollContent: {
        width: Dimensions.get('window').width,
        paddingTop: HEADER_MAX_HEIGHT,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
        zIndex: 2,
    },
    restImg: {
        width: Dimensions.get('window').width,
        flex: 1,
        justifyContent: "flex-end",
        //marginBottom: 30
    },
    restHead: {
        width: Dimensions.get('window'),
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5'
    },
    restTitle: {
        textAlign: 'left',
        fontSize: 18,
        lineHeight: 30,
        fontFamily: 'popS',
        color: '#2D2729',
        width: Dimensions.get('window').width - 30,
    },
    reviewTitle: {
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 25,
        fontFamily: 'popS',
        color: '#2D2729',
        marginBottom: 10
    },
    reviewSubTitle: {
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 18,
        fontFamily: 'popM',
        color: '#2D2729',
    },
    ratingcard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    ratingcardtitle: {
        fontSize: 10,
        lineHeight: 12,
        textAlign: 'left',
        fontFamily: 'popB',
        textTransform: 'uppercase',
        color: '#2D2729',
    },
    distance: {
        fontSize: 14,
        lineHeight: 18,
    },
    rating: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 5,
        borderRadius: 4,
        minWidth: 40
    },
    hrating: {
        backgroundColor: '#87aa03',
    },
    grating: {
        backgroundColor: '#2D2729',
    },
    row: {
        width: Dimensions.get('window').width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        paddingVertical: 15,
        borderBottomColor: '#ddd',
        borderStyle: 'dotted',
        borderBottomWidth: 2
    },
    rowsm: {
        justifyContent: 'space-between',
        paddingVertical: 10,
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
        fontSize: 16,
        color: '#2D2729',
        fontFamily: 'popM',
        width: Dimensions.get('window').width - 105
    },
    rowinfotime: {
        flexDirection: 'row',
        width: Dimensions.get('window').width - 105
    },
    rowinfotimetxt1: {
        fontSize: 16,
        color: '#2D2729',
        fontFamily: 'popS',
    },
    rowinfotimetxt2: {
        fontSize: 16,
        color: '#2D2729',
        fontFamily: 'popM',
        paddingEnd: 10
    },
    fbtn: {
        width: '60%',
    },
    favour: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e5e5e7',
        boxShadow: '0 2px 3px #e5e5e7',
    },
    remarks: {
        width: Dimensions.get('window').width - 30,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 5,
        paddingVertical: 15,
        borderBottomColor: '#ddd',
        borderStyle: 'dotted',
        borderBottomWidth: 2
    },
})