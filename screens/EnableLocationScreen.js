import { StyleSheet, Text, View, Image, ScrollView, Alert, Dimensions, StatusBar, Pressable, TextInput, FlatList, ActivityIndicator, Modal, Linking, Platform, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from '../constants/globalStyles'
import * as Location from "expo-location"
import { useDispatch } from 'react-redux'
import { upLocation } from '../redux/locSlice'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const EnableLocationScreen = () => {

    const navigation = useNavigation();

    

    

    

    const width_proportion = '90%';

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
            </View>
            <View style={styles.hometext}>
                <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: 'popM' }}>Set Explore Halal options around you +Google & Halal ratings</Text>
                <Pressable
                    onPress={() => GetCurrentLocation()}
                    style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}
                >
                    {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Enable Location</Text>)}
                </Pressable>
                <Pressable
                    onPress={() => SearchLocationHandle()}
                    style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}
                >
                    {({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>Search Location</Text>)}
                </Pressable>
            </View>
        </View>
    )
}

export default EnableLocationScreen

const styles = StyleSheet.create({
    hometext: {
        paddingHorizontal: Platform.OS === 'android' ? 15 : 0,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 100,
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width,
    },
    fbtn: {
        width: '60%',
        marginTop: 20
    },
})