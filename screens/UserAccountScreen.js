import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FilterList from '../assets/filter-list.png';
import Logo from '../assets/icon-bs.png';
import globalStyles from '../constants/globalStyles';
import { logout } from "../redux/authSlice";
import { fetchRatedRestaurantsByUid } from '../servers/halalrating';
import { fetchUserDataByID } from '../servers/user';

SplashScreen.preventAutoHideAsync();

const UserAccountScreen = () => {
  const dispatch = useDispatch();
  const mylocation = useSelector((state) => state.location)
  const accessToken = useSelector((state) => state.auth.accessToken);
  const uid = useSelector((state) => state.auth.uid);
  const [isLoading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([])
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
      //console.log("response", response)
      setUser(response);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, [accessToken]);

  const FetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetchRatedRestaurantsByUid(uid);
      if (response && response.length > 0) { // Example: Check if the response has any data
        setRestaurants(response); // Append new data
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      FetchRestaurants();
    }, [])
  );

  const handleLogout = () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              dispatch(logout()); // Clear Redux authentication state
              navigation.navigate('Login')
            } catch (error) {
              console.log("Error clearing AsyncStorage:", error);
            }
          }
        },
      ],
      { cancelable: true }
    )
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, marginRight: 5, fontSize: 14, color: '#2D2729', fontFamily: 'popS' }} numberOfLines={1} ellipsizeMode="tail">{currentLocation}</Text><Entypo name="chevron-thin-right" size={15} color="#2D2729" />
            </View>
          </View>
          <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
        </Pressable>}
        <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
          <View style={styles.searchContainer}>
            <Pressable style={styles.textInput} onPress={() => navigation.navigate('ResultRestaurants', { search: '' })}><Text style={{ paddingHorizontal: 4, paddingVertical: 8, fontSize: 16, opacity: 0.55 }}>Search by restaurant</Text></Pressable>
            <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
          </View>
          <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => navigation.navigate('SortFilter')}>
            <Image source={FilterList} style={{ maxWidth: 30, height: 30 }} />
          </Pressable>
        </View>
      </View>
      <View style={[globalStyles.container]}>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', paddingVertical: 15, height: '100%' }}>
          <View style={styles.box}>
            <Text style={{ fontFamily: 'popS', fontSize: 20, color: '#87aa03' }}>{user?.fullname}</Text>
          </View>

          <View style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="envelope" size={24} style={styles.rowicon} /><View style={styles.rowinfotime}><Text style={styles.rowinfotimetxt1} numberOfLines={1} ellipsizeMode="tail">{user?.email}</Text></View></View></View>

          <Pressable onPress={() => navigation.navigate('FavoriteRes')} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="heart" size={24} style={styles.rowicon} /><View style={styles.rowinfotime}><Text style={styles.rowinfotimetxt1}>Favorite</Text></View></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>

          <Pressable style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="settings" size={24} style={styles.rowicon} /><View style={styles.rowinfotime}><Text style={styles.rowinfotimetxt1}>Settings</Text></View></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>

          <Pressable onPress={() => handleLogout()} style={styles.row}><View style={styles.rowinner}><SimpleLineIcons name="logout" size={24} style={styles.rowicon} /><View style={styles.rowinfotime}><Text style={styles.rowinfotimetxt1}>Logout</Text></View></View><SimpleLineIcons name="arrow-right" size={20} style={styles.rowicon} /></Pressable>

          {/* <ScrollView style={{ width: Dimensions.get('window').width - 30 }}>
            {isLoading ?
              <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, }]}>
                <ActivityIndicator size='50' color='#B1D235' />
              </View> :
              restaurants.length > 0 ?
                <View>
                  <FlatList
                    scrollEnabled={false}
                    data={restaurants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => <CardComponent item={item} ratings={false} index={index} screen="Favorite" />}
                    style={{ marginTop: 10 }}
                  onEndReached={() => !loadmore && hasMore && setPage(page + 1)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() => loadmore && hasMore && <ActivityIndicator />}
                  />
                </View> :
                <View style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, }}>
                  <Text style={{ fontSize: 20 }}>No Liked Restaurants</Text>
                </View>}
          </ScrollView> */}

        </View>
      </View>
    </View>
  )
}

export default UserAccountScreen

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
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
    borderRadius: 8,
    borderColor: '#87aa03',
    borderStyle: 'solid',
    borderWidth: 1
  },
  searchContainer: {
    width: Dimensions.get('window').width - 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B1D235',
  },
  textInput: {
    width: Dimensions.get('window').width - 120,
    height: 40,
    fontSize: 16,
    lineHeight: 20
  },
  filterbtn: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    backgroundColor: '#B1D235',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B1D235',
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
    width: Dimensions.get('window').width - 100
  },
  rowinfotimetxt1: {
    fontSize: 18,
    color: '#2D2729',
    fontFamily: 'popM',
  },
  rowinfotimetxt2: {
    fontSize: 16,
    color: '#2D2729',
    fontFamily: 'popM',
    paddingEnd: 10
  },
})