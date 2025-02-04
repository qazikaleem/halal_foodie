import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar, Pressable, Platform, Dimensions} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import globalStyles from '../constants/globalStyles'
import AppLogo from '../assets/logo.png'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const HomeScreen = () => {
    const navigation = useNavigation();

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
        <SafeAreaView style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                animated={true}
                backgroundColor="#B1D235"
                statusBarStyle='light-content'
            />
            <View style={[globalStyles.header, globalStyles.headerhome]}>
                <Image source={AppLogo} />
            </View>
            <View style={styles.hometext}>
                <Text style={{ fontSize: 20, textAlign: 'center', fontFamily: 'popM' }}>Explore Halal options around you +Google & Halal ratings</Text>
                <Pressable
                    onPress={() => navigation.navigate('Restaurants')}
                    style={({ pressed }) => [{backgroundColor: pressed ? '#B1D235' : '#f6f6f6'}, globalStyles.btn, styles.fbtn]}
                >
                    {({pressed}) => (<Text style={pressed ? globalStyles.btnTextPress : globalStyles.btnText}>CONTINUE</Text>)}
                </Pressable>
            </View>
        </SafeAreaView >
    )
}

export default HomeScreen

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