import { StyleSheet, Text, TextInput, View, Image, Dimensions, StatusBar, Platform, Pressable, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import globalStyles from '../constants/globalStyles'
import { useNavigation } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import Logo from '../assets/icon-bs.png'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector } from 'react-redux'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { fetchRestaurants } from '../servers/restaurants'
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

const MapViewScreen = () => {

  const mylocation = useSelector((state) => state.location)
  const navigation = useNavigation();

  const [restaurants, setRestaurants] = useState([])
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('')
  const { currentLocation, latitude, longitude } = mylocation

  const [location, setLocation] = useState({
    latitude: latitude ? latitude : -26.853388, // Default latitude (e.g., Australia)
    longitude: longitude ? longitude : 133.275154, // Default longitude (e.g., Australia)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    FetchRestaurants()
  }, [location])

  const FetchRestaurants = useCallback(async () => {

    try {
      const response = await fetchRestaurants(page);
      //console.log(response)
      if (response.length > 0) { // Example: Check if the response has any data
        setRestaurants(response); // Append new data
      } else {
        setHasMore(false); // No more data to load
      }

    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }, []);

  const SearchLocationHandle = () => {
    navigation.navigate('SearchLocation')
  }

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
      <View style={{ position: 'relative' }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
          region={location} // Make sure the region updates
        >
          {restaurants && restaurants.map((item) => (
            <Marker
              key={item.id}
              coordinate={{ latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }}
              title={item.restaurantName}
              description={item.formattedAddress}
            />
          ))}
        </MapView>
        <View style={{ position: 'absolute', width: Dimensions.get('window').width }}>
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
            {/* <Pressable onPress={() => setSearchLocationVisible(true)} style={({ pressed }) => [{ backgroundColor: pressed ? '#526119' : '#2D2729' }, styles.locsearchbtn]}>
                    <View style={{ flexDirection: 'row', gap: 16 }}><Feather name="search" size={18} color="#FFFFFF" /><Text style={{ fontSize: 16, lineHeight: 20, color: '#FFFFFF', textAlign: 'left', fontFamily: 'popM' }}>Search any or Current Location</Text></View><Feather name="chevron-right" size={18} color="#FFFFFF" />
                </Pressable> */}
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search by restaurant"
                onChangeText={(value) => handleSearch(value)}
                value={search}
                style={styles.textInput}
              />
              <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
            </View>
            {/* <ModelComponent visible={sortModelVisible} onDismiss={() => setSortModelVisible(false)} heading='Sort & Filter' subheading=''>
              <View>
                <Text style={{ fontSize: 18, fontFamily: 'popS', marginBottom: 10 }}>Sort by</Text>
                {sortOptions.map((option) => (
                  <RadioButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    checked={orderby === option.value}
                    onPress={() => handleSort(option.value)}
                  />
                ))}
              </View>
            </ModelComponent> */}
          </View>
          <View style={{ flex: 1, justifyContent: 'space-between', padding: 15, height: Dimensions.get('window').height - (StatusBar.currentHeight + 100) }}>

          </View>
        </View>
      </View>
    </View >
  )
}

export default MapViewScreen


const styles = StyleSheet.create({
  contentArea: {
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0, // Remove default border
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
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'popS'
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