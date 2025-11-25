import { StyleSheet, Text, TextInput, View, Image, Dimensions, StatusBar, Pressable, Platform, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import globalStyles from '../constants/globalStyles'
import { useNavigation } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Logo from '../assets/icon-bs.png'
import { useSelector } from 'react-redux'
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

const HalalReviewInfoScreen = () => {

  const location = useSelector((state) => state.location)
  const navigation = useNavigation();
  const { currentLocation } = location
  const [search, setSearch] = useState('')

  const infodata = [
    {
      "sign": "",
      "info": "How Do We Provide Halal Ratings?"
    },
    {
      "sign": "1",
      "info": "HALAL BEEF SERVED AT PREMISES"
    },
    {
      "sign": "1",
      "info": "HALAL MUTTON SERVED AT PREMISES"
    },
    {
      "sign": "1",
      "info": "HALAL CHICKEN HAND SLAUGHTERED"
    },
    {
      "sign": "½",
      "info": "HALAL CHICKEN NOT HAND SLAUGHTERED"
    },
    {
      "sign": "½",
      "info": "NO ALCOHOL SERVED AT PREMISES"
    },
    {
      "sign": "1",
      "info": "NO PORK SERVED AT PREMISES"
    },
    {
      "sign": "",
      "info": "BONUS POINTS"
    },
    {
      "sign": "+/-",
      "info": "If alcohol or pork served at premises, are there steps taken to avoid cross-contamination?"
    },
    {
      "sign": "+/-",
      "info": "Are all ingredients such as emulsifiers or flavor enhancers used in dishes halal certified or suitable for halal?"
    }
  ]

  const InfoCard = ({ item, index }) => {
    return (
      item.sign !== "" ? <View style={[styles.card, index === infodata.length - 1 && styles.lastCard]}>
        <View style={styles.cardLable}><Text style={styles.cardLableTxt}>{item.sign} {item.sign !== '+/-' && <Entypo name="star" style={styles.cardRating} />}</Text></View>
        <View style={styles.cardTitle}><Text style={styles.cardTitleTxt}>{item.info}</Text></View>
      </View>
        :
        <View style={[styles.heading, index === infodata.length - 1 && styles.lastHeading]}>
          <Text style={styles.headingTxt}>{item.info}</Text>
        </View>
    )
  }

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

      <View style={[globalStyles.container]}>
        <View style={{ width: Dimensions.get('window').width, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <FlatList
            scrollEnabled={true}
            data={infodata}
            renderItem={InfoCard}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    </View>
  )
}

export default HalalReviewInfoScreen

const styles = StyleSheet.create({
  infoArea: {
    backgroundColor: '#B1D235',
  },
  heading: {
    paddingBottom: 10,
    width: Dimensions.get('window').width - 30,
    paddingVertical: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#e5e5e7',
    borderStyle: 'solid',
  },
  lastHeading: {
    marginBottom: 0,
    borderBottomWidth: 0
  },
  headingTxt: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'popB',
    color: '#2D2729',
    textAlign: 'center',
  },
  card: {
    width: Dimensions.get('window').width - 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 0,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#454955',
    borderStyle: 'solid',
    marginBottom: 15
  },
  lastCard: {
    marginBottom: 30
  },
  cardLable: {
    width: 55,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fde635',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLableTxt: {
    color: '#2D2729',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'popS',
    textAlign: 'center',
  },
  cardRating: {
    color: '#2D2729',
    fontSize: 15,
  },
  cardTitle: {
    width: Dimensions.get('window').width - 87,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f3eff5',
    borderLeftWidth: 1,
    borderColor: '#454955',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardTitleTxt: {
    color: '#2D2729',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'popS',
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