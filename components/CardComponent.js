import { StyleSheet, Text, View, Dimensions, Pressable, Image, Platform } from 'react-native'
import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
/* import SplashScreen from 'react-native-splash-screen';
import useFonts from '../hooks/useFonts'; */
import RestLogo from '../assets/restlogo.png'
import { useSelector } from 'react-redux'

SplashScreen.preventAutoHideAsync();

const CardComponent = ({ item, ratings = true, index }) => {

    //console.log(item)

    const location = useSelector((state) => state.location)
    const navigation = useNavigation();

    const { currentLocation, latitude, longitude } = location

    const SingleRestaurantHandle = (itemID) => {
        navigation.navigate('SingleRestaurant', {
            id: itemID,
            currentLocation: currentLocation,
            latitude: latitude,
            longitude: longitude
        })
    }

    const hours = (item) => {
        const daysOfWeek = [item.tSun, item.tMon, item.tTue, item.tWed, item.tThu, item.tFri, item.tSat];
        const now = new Date();
        const dayOfWeek = daysOfWeek[now.getDay()]
        return dayOfWeek
    }

    const [fontsLoaded] = useFonts({
        "popR": require("../assets/fonts/Poppins-Regular.ttf"),
        "popM": require("../assets/fonts/Poppins-Medium.ttf"),
        "popS": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "popB": require("../assets/fonts/Poppins-Bold.ttf")
    });

    //const fontsLoaded = useFonts();

    const handleOnLayout = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync(); //hide the splashscreen
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Pressable key={item.id} style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.card, index === 0 && styles.firstCard]} onPress={() => SingleRestaurantHandle(item.id)} onLayout={handleOnLayout}>
            <View style={{ width: 50 }}>
                <Image source={RestLogo} style={{ maxWidth: 45, height: 45 }} />
            </View>
            <View style={{ width: ratings ? Dimensions.get('window').width - 140 : Dimensions.get('window').width - 100 }}>
                <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                    {ratings ? <Text style={styles.cardTitle}>{item.restaurantName.length > 22 ? `${item.restaurantName.substring(0, 22)}...` : item.restaurantName}</Text> :
                        <Text style={styles.cardTitle}>{item.restaurantName.length > 32 ? `${item.restaurantName.substring(0, 32)}...` : item.restaurantName}</Text>
                    }
                    {ratings ? <View style={styles.location}><Entypo name="location-pin" size={15} color="#87aa03" /><Text style={styles.locationtxt}>{item.formattedAddress.length > 28 ? `${item.formattedAddress.substring(0, 28)}...` : item.formattedAddress}</Text></View> :
                        <View style={styles.location}><Entypo name="location-pin" size={15} color="#87aa03" /><Text style={styles.locationtxt}>{item.formattedAddress.length > 35 ? `${item.formattedAddress.substring(0, 35)}...` : item.formattedAddress}</Text></View>}
                </View>
                <View style={{ width: Dimensions.get('window').width - 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                    {item.resopenclose ? <Text style={[styles.hours, { color: '#87aa03' }]}>Open Now</Text> : <Text style={[styles.hours, { color: '#df0000ff' }]}>Closed</Text>}
                    {item.distancekm ? <Text style={styles.distance}>{item.distancekm}</Text> : ''}
                </View>
            </View>
            {ratings && <View style={{ alignItems: 'center', justifyContent: 'space-between', gap: 5 }}>
                <View><View style={[styles.rating, styles.hrating]}><Text style={{ fontSize: 11, color: '#ffffff' }}>{Math.ceil(item.rating)}<Entypo name="star" size={12} color="#ffffff" /></Text></View><Text style={{ fontSize: 8, textAlign: 'center', fontFamily: 'popB' }}>halal</Text></View>
                <View><View style={[styles.rating, styles.grating]}><Text style={{ fontSize: 11, color: '#ffffff' }}>3<Entypo name="star" size={12} color="#ffffff" /></Text></View><Text style={{ fontSize: 8, textAlign: 'center', fontFamily: 'popB' }}>google</Text></View>
            </View>}
        </Pressable>
    )
}
export default CardComponent

const styles = StyleSheet.create({
    card: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#e5e5e7',
        borderStyle: 'solid',
        width: Dimensions.get('window').width - 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 6,
        marginBottom: 5,
        borderRadius: 12,
        boxShadow: '0 2px 3px 1px #e6e6e6ff'
    },
    firstCard: {
        borderTopWidth: 1,
        borderColor: '#e6e6e6ff',
    },
    cardTitle: {
        color: '#2D2729',
        fontSize: 15,
        fontFamily: 'popS',
        //fontFamily: 'Poppins-SemiBold',
        width: Dimensions.get('window').width - 100,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'flex-start',
        marginLeft: -3
    },
    locationtxt: {
        color: '#2D2729',
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'popM',
        opacity: 0.65
    },
    distance: {
        color: '#2D2729',
        fontSize: 13,
        marginTop: 4,
        fontFamily: 'popS',
    },
    hours: {
        fontSize: 13,
        marginTop: 4,
        fontFamily: 'popB',
        textTransform: 'uppercase'
    },
    rating: {
        paddingVertical: 3,
        width: 32,
        borderRadius: 4,
        alignItems: 'center'
    },
    hrating: {
        backgroundColor: '#87aa03',
    },
    grating: {
        backgroundColor: '#2D2729',
    },
})