import { StyleSheet, Text, TextInput, View, Image, Dimensions, StatusBar, Platform, Pressable, ImageBackground } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import globalStyles from '../constants/globalStyles'
import { useNavigation } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import Logo from '../assets/icon-bs.png'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from "../redux/authSlice";
import { fetchUserDataByID } from '../servers/user'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

const UserAccountScreen = () => {
  const dispatch = useDispatch();
  const mylocation = useSelector((state) => state.location)
  const accessToken = useSelector((state) => state.auth.accessToken);
  const uid = useSelector((state) => state.auth.uid);
  const navigation = useNavigation();
  const { currentLocation } = mylocation
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('')

  const SearchLocationHandle = () => {
    navigation.navigate('SearchLocation')
  }

  const image = { uri: 'https://backend.halalfoodnearme.com.au/artifacts/account/558559199.jpg' };

  useEffect(() => {
    FetchUserData();
  }, [accessToken]);

  const FetchUserData = useCallback(async () => {
    try {
      const response = await fetchUserDataByID(uid);
      setUser(response);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      AsyncStorage.clear();
      dispatch(logout()); // Clear Redux authentication state
      navigation.navigate('Login')
    } catch (error) {
      console.log("Error clearing AsyncStorage:", error);
    }
  };
  const handleSearch = (value) => {
    navigation.navigate('ResultRestaurants', {
      search: value,
    })
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
        translucent
        backgroundColor="#B1D235"
        statusBarStyle='light-content'
      />
      <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
        {currentLocation && <Pressable onPress={() => SearchLocationHandle()} style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <View>
            <Entypo name="location" size={24} color="#2D2729" />
          </View>
          <View style={{ width: Dimensions.get('window').width - 120 }}>
            <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'popS' }}>Use your Current or Search any Location</Text>
            <Text style={{ fontSize: 14, color: '#2D2729', fontFamily: 'popS' }}>{currentLocation.length > 30 ? `${currentLocation.substring(0, 30)}...` : currentLocation}{" "}<Entypo name="chevron-thin-right" size={15} color="#2D2729" /></Text>
          </View>
          <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
        </Pressable>}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search by restaurant"
            onChangeText={(value) => handleSearch(value)}
            value={search}
            style={styles.textInput}
          />
          <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
        </View>
      </View>
      <View style={[globalStyles.container]}>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between', paddingVertical: 15, height: '100%' }}>
          <View style={styles.box}>
            <Text style={{ fontFamily: 'popS', fontSize: 15 }}>Hello,</Text>
            <Text style={{ fontFamily: 'popS', fontSize: 20, color: '#87aa03' }}>{user?.fullname}</Text>
          </View>
          <Pressable onPress={() => handleLogout()} style={({ pressed }) => [{ backgroundColor: pressed ? '#2D2729' : '#B1D235' }, globalStyles.btn, styles.fbtn]}>{({ pressed }) => (<Text style={pressed ? globalStyles.btnTextPress : styles.btnText}>Logout</Text>)}
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default UserAccountScreen

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 240,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fbtn: {
    width: Dimensions.get('window').width - 30,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'popS'
  },
  box: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderColor: '#87aa03',
    borderStyle: 'solid',
    borderWidth: 1
  },
  searchContainer: {
    width: Dimensions.get('window').width - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B1D235',
    marginTop: 10
  },
  textInput: {
    width: Dimensions.get('window').width - 70,
    height: 40,
    fontSize: 16,
    lineHeight: 20
  },
})