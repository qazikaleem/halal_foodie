import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import FilterList from '../assets/filter-list.png';
import Logo from '../assets/icon-bs.png';
import globalStyles from '../constants/globalStyles';
import { fetchRestaurants } from '../servers/restaurants';

SplashScreen.preventAutoHideAsync();

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MapViewScreen = () => {

  const mylocation = useSelector((state) => state.location);
  const navigation = useNavigation();

  const [restaurants, setRestaurants] = useState([]);
  const [page] = useState(1);
  const { currentLocation, latitude, longitude } = mylocation;

  const initialRegion = {
    latitude: latitude ? parseFloat(latitude) : -26.853388,
    longitude: longitude ? parseFloat(longitude) : 133.275154,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRef = useRef(null);
  // FIX 1: Each marker needs its own ref — use an array
  const markerRefs = useRef([]);

  // FIX 2: Only fetch once on mount — not on every location state change
  useEffect(() => {
    FetchRestaurants();
  }, []);

  // FIX 3: Show first marker callout only after restaurants are loaded
  useEffect(() => {
    if (restaurants.length > 0) {
      const timer = setTimeout(() => {
        markerRefs.current[0]?.showCallout();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [restaurants]);

  const FetchRestaurants = useCallback(async () => {
    try {
      const response = await fetchRestaurants(page);
      if (response && response.length > 0) {
        setRestaurants(response);
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    }
  }, [page]);

  const SearchLocationHandle = () => {
    navigation.navigate('SearchLocation');
  };

  const SingleRestaurantHandle = (itemID) => {
    navigation.navigate('SingleRestaurant', {
      id: itemID,
      currentLocation,
      latitude,
      longitude,
      from: 'MapView',
    });
  };

  const [isLoaded] = useFonts({
    popR: require('../assets/fonts/Poppins-Regular.ttf'),
    popM: require('../assets/fonts/Poppins-Medium.ttf'),
    popS: require('../assets/fonts/Poppins-SemiBold.ttf'),
    popB: require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const handleOnLayout = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    // FIX 4: Root view must have flex: 1 so children can expand to full screen
    <View style={[globalStyles.droidSafeArea, { flex: 1 }]} onLayout={handleOnLayout}>
      <StatusBar translucent backgroundColor="#B1D235" barStyle="light-content" />

      {/* FIX 5: Wrapper must have flex: 1 — without it the map has 0 height and is invisible */}
      <View style={{ flex: 1 }}>

        {/* FIX 6: Use absoluteFillObject so the map fills its parent correctly when overlaying UI */}
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
        >
          {restaurants.map((item, index) => {
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);

            // FIX 7: Skip markers with invalid coordinates — bad coords silently break the map
            if (isNaN(lat) || isNaN(lng)) return null;

            // FIX 8: Check ratings using item data, not undefined `ratings` variable
            const hasRating = item.rating || item.ratingValue || item.GoogleRating;

            return (
              <Marker
                key={item.id}
                // FIX 9: Each marker gets its own slot in the refs array
                ref={(ref) => { markerRefs.current[index] = ref; }}
                coordinate={{ latitude: lat, longitude: lng }}
                // FIX 10: onPress uses index-specific ref, not a shared one
                onPress={() => markerRefs.current[index]?.showCallout()}
              >
                <Callout tooltip onPress={() => SingleRestaurantHandle(item.id)}>
                  <View style={styles.calloutContainer}>

                    <View style={{ alignItems: 'flex-start', width: '100%' }}>
                      <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.restaurantName}
                      </Text>
                      <View style={styles.location}>
                        <Entypo name="location-pin" size={15} color="#87aa03" />
                        <Text style={styles.locationtxt} numberOfLines={1} ellipsizeMode="tail">
                          {item.formattedAddress}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.calloutFooter}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {item.resopenclose
                          ? <Text style={[styles.hours, { color: '#87aa03' }]}>Open Now</Text>
                          : <Text style={[styles.hours, { color: '#df0000' }]}>Closed</Text>
                        }
                        {item.distancekm ? <Text style={styles.distance}>{item.distancekm}</Text> : null}
                      </View>

                      {hasRating && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={[styles.rating, styles.hrating]}>
                            <Text style={styles.ratingText}>
                              {item.rating || item.ratingValue || 0}
                              <Entypo name="star" size={12} color="#ffffff" />
                            </Text>
                          </View>
                          {item.GoogleRating ? (
                            <View style={[styles.rating, styles.grating]}>
                              <Text style={styles.ratingText}>
                                {item.GoogleRating}
                                <Entypo name="star" size={12} color="#ffffff" />
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      )}
                    </View>

                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        {/* Overlay UI — sits on top of the map */}
        <View style={styles.overlayHeader} pointerEvents="box-none">
          <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
            {currentLocation && (
              <Pressable onPress={SearchLocationHandle} style={styles.locationRow}>
                <Entypo name="location" size={24} color="#2D2729" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'popS' }}>
                    Use your Current or Search any Location
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{ flex: 1, marginRight: 5, fontSize: 14, color: '#2D2729', fontFamily: 'popS' }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {currentLocation}
                    </Text>
                    <Entypo name="chevron-thin-right" size={15} color="#2D2729" />
                  </View>
                </View>
                <Image source={Logo} style={{ width: 40, height: 40 }} />
              </Pressable>
            )}

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Pressable
                  style={styles.textInput}
                  onPress={() => navigation.navigate('ResultRestaurants', { search: '' })}
                >
                  <Text style={{ paddingHorizontal: 4, paddingVertical: 8, fontSize: 16, opacity: 0.55 }}>
                    Search by restaurant
                  </Text>
                </Pressable>
                <Feather name="search" size={20} color="#B1D235" />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.filterbtn,
                  { backgroundColor: pressed ? 'rgba(177,210,53,0.45)' : '#ffffff' },
                ]}
                onPress={() => navigation.navigate('SortFilter')}
              >
                <Image source={FilterList} style={{ width: 30, height: 30 }} />
              </Pressable>
            </View>
          </View>
        </View>

      </View>
    </View>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
  },
  locationRow: {
    width: SCREEN_WIDTH - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  searchRow: {
    width: SCREEN_WIDTH - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  searchContainer: {
    flex: 1,
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
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  filterbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B1D235',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B1D235',
    padding: 4,
  },
  calloutContainer: {
    width: SCREEN_WIDTH - 80,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  calloutFooter: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cardTitle: {
    color: '#2D2729',
    fontSize: 15,
    fontFamily: 'popS',
    flexShrink: 1,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -3,
    marginTop: 2,
  },
  locationtxt: {
    color: '#2D2729',
    fontSize: 13,
    fontFamily: 'popM',
    opacity: 0.65,
    flexShrink: 1,
  },
  distance: {
    color: '#2D2729',
    fontSize: 13,
    fontFamily: 'popS',
  },
  hours: {
    fontSize: 13,
    fontFamily: 'popB',
    textTransform: 'uppercase',
  },
  rating: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 36,
    borderRadius: 4,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    color: '#ffffff',
  },
  hrating: {
    backgroundColor: '#87aa03',
  },
  grating: {
    backgroundColor: '#2D2729',
  },
});
