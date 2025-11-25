import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as Location from "expo-location"
import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import Logo from '../assets/icon-bs.png'
import globalStyles from '../constants/globalStyles'
import { upLocation } from '../redux/locSlice'

SplashScreen.preventAutoHideAsync();

const SearchLocationScreen = () => {

    const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false);

    const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

    const mylocation = useSelector((state) => state.location)

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { currentLocation, latitude, longitude } = mylocation

    const [location, setLocation] = useState({
        currentLocation: currentLocation ? currentLocation : '',
        latitude: latitude ? latitude : -26.853388, // Default latitude (e.g., Australia)
        longitude: longitude ? longitude : 133.275154, // Default longitude (e.g., Australia)
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [markerCoordinate, setMarkerCoordinate] = useState(null);
    const mapRef = useRef(null);

    const [searchText, setSearchText] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmLoc, setConfirmLoc] = useState(false);
    const autocompleteRef = useRef(null);

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
        setLoadingLocation(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                "Permission not granted",
                "Allow the app to use location service",
                [
                    { text: "OK" },
                    {
                        text: 'Open Settings',
                        onPress: () => {
                            Linking.openSettings();
                        },
                    }],
                { cancelable: false }
            )
            setLocationServicesEnabled(false)
        }

        let { coords } = await Location.getCurrentPositionAsync()
        if (coords) {
            const { latitude, longitude } = coords

            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            })

            for (let item of response) {
                let address = `${item.name}, ${item?.postalCode}, ${item?.city}`
                dispatch(upLocation({
                    currentLocation: address,
                    latitude: latitude,
                    longitude: longitude
                }))
            }
            setLoadingLocation(false)
            navigation.navigate('Main')
        }
    }

    useEffect(() => {
        setMarkerCoordinate({
            latitude: location.latitude,
            longitude: location.longitude,
        });
    }, [])

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

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const handleClearText = () => {
        setSearchText('');
        if (autocompleteRef.current) {
            autocompleteRef.current.clear(); // Programmatically clear the autocomplete input
        }
    };

    const handlePlaceSelect = (data, details = null) => {
        if (details) {  // Check if details are available (important!)
            const { geometry } = details;
            const { location: placeLocation } = geometry;

            setLocation({
                ...location, // Keep the deltas for zoom level
                currentLocation: data.description,
                latitude: placeLocation.lat,
                longitude: placeLocation.lng,
            });
            setSearchText(data.description);
            setShowConfirm(true)

            setMarkerCoordinate({
                latitude: placeLocation.lat,
                longitude: placeLocation.lng,
            });

            // Animate map to the new location
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    ...location, // Keep the deltas for zoom level
                    latitude: placeLocation.lat,
                    longitude: placeLocation.lng,
                }, 1000); // Animation duration in milliseconds
            }

            handleClearText();
        }
    };

    const confirmLocation = () => {
        dispatch(upLocation({
            currentLocation: location.currentLocation,
            latitude: location.latitude,
            longitude: location.longitude,
        }))

        setConfirmLoc(true)
        navigation.navigate('Main')
    }

    const backtoList = () => {
        currentLocation ? navigation.navigate('Main') : navigation.navigate('Home')
    }

    return (
        <View style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                translucent
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={{ position: 'relative' }}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={location}
                    region={location} // Make sure the region updates
                >
                    {markerCoordinate && ( // Conditionally render the marker
                        <Marker coordinate={markerCoordinate} title="Selected Location" />
                    )}
                </MapView>
                <View style={{ position: 'absolute', width: Dimensions.get('window').width }}>
                    <View style={[globalStyles.header, { width: Dimensions.get('window').width, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, minHeight: 72, paddingTop: StatusBar.currentHeight + 15 }]}>
                        <Pressable onPress={() => backtoList()}>
                            <MaterialCommunityIcons name="keyboard-backspace" size={28} color="#2D2729" />
                        </Pressable>
                        <View style={{ width: Dimensions.get('window').width - 120 }}>
                            <Text style={{ fontSize: 18, color: '#2D2729', fontFamily: 'popS', textAlign: 'center' }}>Search Your Location</Text>
                        </View>
                        <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-between', padding: 15, height: Dimensions.get('window').height - (StatusBar.currentHeight + 72) }}>
                        <View>
                            <Pressable onPress={() => GetCurrentLocation()} style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#2D2729', marginBottom: 10 }, globalStyles.btn, styles.fbtn]}>
                                <FontAwesome6 name="location-arrow" size={18} color="#ffffff" />
                                <Text style={styles.btnText}>Use my current location</Text>
                            </Pressable>
                            <View style={styles.searchContainer}>
                                <GooglePlacesAutocomplete
                                    ref={autocompleteRef}
                                    placeholder="SEARCH FOR A LOCATION"
                                    minLength={2} // Minimum characters before suggestions appear
                                    autoFocus={false}
                                    returnKeyType={'search'}
                                    fetchDetails
                                    onPress={handlePlaceSelect}
                                    query={{
                                        key: GOOGLE_MAPS_API_KEY,
                                        language: 'en', // Language for results
                                        components: 'country:AUS',
                                    }}
                                    styles={{
                                        textInputContainer: styles.textInputContainer,
                                        textInput: styles.textInput,
                                        predefinedPlacesDescription: {
                                            color: '#2D2729',
                                        },
                                    }}
                                    debounce={400} // Delay before making API request
                                    onFail={(error) => console.error("Google API Error:", error)}
                                />
                                <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
                            </View>
                        </View>
                        {showConfirm && <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Pressable
                                onPress={() => confirmLocation()}
                                style={({ pressed }) => [{ backgroundColor: pressed ? '#B1D235' : '#2D2729' }, globalStyles.btn, styles.fbtn]}
                            >
                                {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : styles.btnText}>Confirm Location</Text>)}
                            </Pressable>
                        </View>}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SearchLocationScreen

const styles = StyleSheet.create({
    contentArea: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    map: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        marginTop: StatusBar.currentHeight + 15
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#B1D235',
    },
    textInputContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0, // Remove default border
    },
    textInput: {
        height: 40,
        fontSize: 16,
        lineHeight: 20
    },
    locsearchbtn: {
        width: Dimensions.get('window').width - 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 12
    },
    searchIcon: {
        paddingVertical: 12,
    },
    clearButton: {
        paddingVertical: 10,
    },
    loadingIndicator: {
        marginLeft: 10,
    },
    fbtn: {
        width: Dimensions.get('window').width - 30,
    },
    btnText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'popS',
        textTransform: 'uppercase'
    },
})