import { StyleSheet, Text, View, Image, SafeAreaView, Alert, Dimensions, StatusBar, Pressable, TextInput, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as Location from "expo-location"
import * as LocationGeoCoding from "expo-location"
import globalStyles from '../constants/globalStyles'
import { useNavigation } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import { fetchRestaurants, fetchRestaurantsByCoords } from '../servers/fetchRestaurants'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import SearchLogo from '../assets/searchlogo.png'

SplashScreen.preventAutoHideAsync();

const RestaurantsScreen = () => {

    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([])
    const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
    const [currentLocation, setCurrentLocation] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")

    useEffect(() => {
        CheckIfLocationServicesEnabled()
        GetCurrentLocation()
        FetchRestaurants()
    }, [currentLocation, latitude, longitude])

    const CheckIfLocationServicesEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert(
                "Location services not enabled",
                "Please enable your location services",
                [{ text: "OK" }],
                { cancelable: false }
            )
        } else {
            setLocationServicesEnabled(true)
        }
    }

    const GetCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                "Permission not granted",
                "Allow the app to use location service",
                [{ text: "OK" }],
                { cancelable: false }
            )
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
        })
        console.log(location)

        let { coords } = await Location.getCurrentPositionAsync()
        if (coords) {
            const { latitude, longitude } = coords

            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            })

            const address = await LocationGeoCoding.reverseGeocodeAsync({
                latitude,
                longitude
            })
            const streetAddress = address[0].name
            for (let item of response) {
                let address = `${item.name}, ${item?.postalCode}, ${item?.city}`
                setCurrentLocation(address)
            }
            setLatitude(latitude)
            setLongitude(longitude)
        }
    }

    const FetchRestaurants = useCallback(async () => {
        setLoading(true);
        try {
            const Restaurantsdata = (latitude !== "" && longitude !== "") ? await fetchRestaurantsByCoords(latitude, longitude) : await fetchRestaurants();
            //console.log(Restaurantsdata)
            setRestaurants(Restaurantsdata);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    }, [GetCurrentLocation]);

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

    const RestaurantCard = ({ item }) => {
        return (
            <Pressable key={item.id} style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.card]} onPress={() => navigation.navigate('SingleRestaurant', {
                id: item.id,
                latitude: latitude,
                longitude: longitude
            })}>
                <View>
                    <Text style={styles.cardTitle}>{item.restaurantName.length > 25 ? `${item.restaurantName.substring(0, 25)}...` : item.restaurantName}</Text>
                    <Text style={styles.location}>{item.formattedAddress.length > 28 ? `${item.formattedAddress.substring(0, 28)}...` : item.formattedAddress}</Text>
                    <Text style={styles.distance}>{item?.distancekm}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={[styles.rating, styles.hrating]}><Text style={{ color: '#ffffff' }}>5<Entypo name="star" size={15} color="#ffffff" /></Text></View><View><Text style={{ fontSize: 10, textAlign: 'center', fontFamily: 'popB' }}>halal</Text></View>
                    <View style={[styles.rating, styles.grating]}><Text style={{ color: '#ffffff' }}>3<Entypo name="star" size={15} color="#ffffff" /></Text></View><View><Text style={{ fontSize: 10, textAlign: 'center', fontFamily: 'popB' }}>google</Text></View>
                </View>
            </Pressable>
        )
    }

    const width_proportion = '90%';

    return (
        <SafeAreaView style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                animated={true}
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={globalStyles.header}>
                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <View style={{ width: width_proportion }}>
                        <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'popR' }}>Your Location</Text>
                        <Text style={{ fontSize: 18, color: '#FFFFFF', fontFamily: 'popS' }}>{currentLocation ? currentLocation : 'Loading your location...'}</Text>
                    </View>
                    <View>
                        <Entypo name="location" size={24} color="white" />
                    </View>
                </View>
                <Pressable style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderRadius: 50, paddingVertical: 0, paddingHorizontal: 5, marginTop: 10 }}>
                    <Entypo name="location-pin" size={30} color="#2D2729" />
                    <TextInput placeholder='Search Restaurants ...' style={{ width: Dimensions.get('window').width - 120, fontSize: 18, fontFamily: 'popR' }} />
                    <Image source={SearchLogo} style={{ width: 40, height: 40, borderRadius: 50 }} />
                </Pressable>
                {/* <View style={{ width: Dimensions.get('window').width - 30 }}>
                    <Text style={{ fontSize: 14, color: '#FFFFFF', marginTop: 10, textAlign: 'left', fontFamily: 'popR' }}>Search any area or locate based on current location</Text>
                </View> */}
            </View>
            <View style={[globalStyles.container, globalStyles.contentArea]}>
                {isLoading ? <Text style={globalStyles.loadingtitle}>Loading</Text> : <FlatList
                    scrollEnabled={true}
                    data={restaurants.sort((a, b) => a.distance > b.distance ? 1 : -1)}
                    renderItem={RestaurantCard}
                    keyExtractor={(item) => item.id.toString()}
                />}
            </View>
        </SafeAreaView >
    )
}

export default RestaurantsScreen

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e5e5e7',
        boxShadow: '0 2px 3px #ddd',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: Dimensions.get('window').width - 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        color: '#2D2729',
        fontSize: 18,
        fontFamily: 'popB',
        width: Dimensions.get('window').width - 100,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        color: '#2D2729',
        fontSize: 15,
        fontFamily: 'popM',
        opacity: 0.45,
        width: Dimensions.get('window').width - 100,
    },
    distance: {
        color: '#2D2729',
        fontSize: 15,
        marginTop: 3,
        fontFamily: 'popB',
    },
    rating: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 4
    },
    hrating: {
        backgroundColor: '#B1D235',
    },
    grating: {
        backgroundColor: '#2D2729',
        marginTop: 5
    }
})