import { StyleSheet, Text, View, Image, StatusBar, Pressable, Platform, Dimensions, Alert, Linking } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as Location from "expo-location"
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import globalStyles from '../constants/globalStyles'
import { useDispatch, useSelector } from 'react-redux'
import { upLocation } from '../redux/locSlice'
import AppLogo from '../assets/logo.png'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const HomeScreen = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const location = useSelector((state) => state.location)

    const { currentLocation } = location

    const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        CheckIfLocationServicesEnabled();
    }, [])

    useFocusEffect(
        useCallback(() => {
            (locationServicesEnabled || currentLocation) && navigation.navigate('Main')
        }, [])
    );

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
            console.log(latitude)
            console.log(longitude)
            setLoadingLocation(false)
            navigation.navigate('Main')
        }
    }

    const SearchLocationHandle = () => {
        navigation.navigate('SearchLocation')
    }

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

    return (
        <View style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                animated={true}
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={[globalStyles.header, globalStyles.headerhome]}>
                <Image source={AppLogo} />

                <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: 'popM', marginTop: 50, color: '#ffffff' }}>Explore Halal options around you +Google & Halal ratings</Text>

            </View>
            <View style={styles.hometext}>
                <Text style={{ fontSize: 25, textAlign: 'center', fontFamily: 'popS', color: '#2D2729' }}>Your Location?</Text>
                <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: 'popM', color: '#2D2729', opacity: 0.5 }}>set your location to start exploring halal restaurants around you.</Text>
                <Pressable
                    onPress={() => GetCurrentLocation()}
                    style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}
                >
                    {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Allow Location Access</Text>)}
                </Pressable>
                <Pressable style={{ padding: 15, marginTop: 10 }} onPress={() => SearchLocationHandle()}><Text style={{ fontSize: 18, textAlign: 'center', color: '#87aa03' }}>Search Location Manually</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    hometext: {
        paddingHorizontal: Platform.OS === 'android' ? 15 : 0,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width,
    },
    fbtn: {
        width: Dimensions.get('window').width - 30,
        marginTop: 20
    },
})