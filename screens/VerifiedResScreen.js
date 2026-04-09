import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import FilterList from '../assets/filter-list.png';
import Logo from '../assets/icon-bs.png';
import CardComponent from '../components/CardComponent';
import globalStyles from '../constants/globalStyles';
import { fetchVerifiedRestaurants } from '../servers/halalrating';

SplashScreen.preventAutoHideAsync();

const VerifiedResScreen = () => {
  const navigation = useNavigation();
  const location = useSelector((state) => state.location)
  const [isLoading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([])
  const [page, setPage] = useState(1); // Start at page 1 (or 0, depending on your API)
  const [search, setSearch] = useState('')

  const { currentLocation } = location

  const FetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetchVerifiedRestaurants();
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
      <View style={{ width: Dimensions.get('window').width - 30, paddingHorizontal: Platform.OS === 'android' ? 15 : 0, }}>
        <View style={styles.heading}>
          <Text style={styles.headingTxt}>Verified Restaurants</Text>
        </View>
      </View>
      <ScrollView>
        {isLoading ?
          <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, }]}>
            <ActivityIndicator size='50' color='#B1D235' />
          </View> :
          restaurants.length > 0 ?
            <View style={[globalStyles.container]}>
              <FlatList
                scrollEnabled={false}
                data={restaurants}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => <CardComponent item={item} ratings={true} index={index} screen="Favorite" />}
                style={{ marginTop: 10 }}
              /* onEndReached={() => !loadmore && hasMore && setPage(page + 1)}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() => loadmore && hasMore && <ActivityIndicator />} */
              />
            </View> :
            <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, }]}>
              <Text style={{ fontSize: 20 }}>No Liked Restaurants</Text>
            </View>}
      </ScrollView>

    </View>
  )
}

export default VerifiedResScreen

const styles = StyleSheet.create({
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
  heading: {
    width: Dimensions.get('window').width - 30,
    paddingVertical: 10,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderColor: '#e5e5e7',
    borderStyle: 'solid',
  },
  headingTxt: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'popB',
    color: '#87aa03',
    textAlign: 'center',
  },
})