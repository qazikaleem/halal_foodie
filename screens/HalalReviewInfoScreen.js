import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import FilterList from '../assets/filter-list.png';
import Logo from '../assets/icon-bs.png';
import globalStyles from '../constants/globalStyles';

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
    color: '#87aa03',
    textAlign: 'center',
  },
  card: {
    width: Dimensions.get('window').width - 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 0,
    borderRadius: 8,
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
})