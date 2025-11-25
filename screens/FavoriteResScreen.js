import { StyleSheet, Text, TextInput, View, Image, ScrollView, Dimensions, StatusBar, Pressable, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import globalStyles from '../constants/globalStyles'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import { fetchLikedRestaurants } from '../servers/likeunlike';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Logo from '../assets/icon-bs.png'
import CardComponent from '../components/CardComponent';
import { useSelector } from 'react-redux'
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

const FavoriteResScreen = () => {
  const navigation = useNavigation();
  const location = useSelector((state) => state.location)
  const uid = useSelector((state) => state.auth.uid);
  const [isLoading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([])
  const [page, setPage] = useState(1); // Start at page 1 (or 0, depending on your API)
  const [search, setSearch] = useState('')

  const { currentLocation } = location

  const FetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await fetchLikedRestaurants(uid);
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
      <ScrollView style={{ width: Dimensions.get('window').width }}>
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
                renderItem={({ item, index}) => <CardComponent item={item} ratings={false} index={index} />}
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

export default FavoriteResScreen

const styles = StyleSheet.create({
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