import { StyleSheet, Text, TextInput, View, Image, ScrollView, Dimensions, StatusBar, Pressable, FlatList, ActivityIndicator, BackHandler, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import globalStyles from '../constants/globalStyles'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fetchRestaurantsByCoords } from '../servers/restaurants';
import { fetchCategories } from '../servers/categories';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
/* import SplashScreen from 'react-native-splash-screen';
import useFonts from '../hooks/useFonts' */
import Logo from '../assets/icon-bs.png'
import FilterList from '../assets/filter-list.png'
import ModelComponent from '../components/ModelComponent'
import { useDispatch, useSelector } from 'react-redux'
import { upCategories } from '../redux/catSlice';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import CardComponent from '../components/CardComponent';
import Feather from '@expo/vector-icons/Feather';

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');
const images = [
    { id: 1, url: 'https://backend.halalfoodnearme.com.au/artifacts/slider/10956.jpg' },
    { id: 2, url: 'https://backend.halalfoodnearme.com.au/artifacts/slider/18551.jpg' },
    { id: 3, url: 'https://backend.halalfoodnearme.com.au/artifacts/slider/10956.jpg' },
];

const RestaurantsScreen = () => {

    const location = useSelector((state) => state.location)
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    const [loadmore, setLoadmore] = useState(true);
    const [restaurants, setRestaurants] = useState([])
    const [page, setPage] = useState(1); // Start at page 1 (or 0, depending on your API)
    const [hasMore, setHasMore] = useState(true);
    const [sortModelVisible, setSortModelVisible] = useState(false);

    const backPressTimestamp = useRef(0);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const now = Date.now();

                if (backPressTimestamp.current && now - backPressTimestamp.current < 2000) {
                    BackHandler.exitApp();
                    return true;
                }

                backPressTimestamp.current = now;
                ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove();
        }, [])
    );

    const progressValue = useSharedValue(0);

    // Prepare animated styles for each dot OUTSIDE of the map loop
    const animatedDotStyles = images.map((_, index) =>
        useAnimatedStyle(() => {
            const opacity = interpolate(
                progressValue.value,
                [index - 1, index, index + 1],
                [0.3, 1, 0.3],
                Extrapolate.CLAMP
            );
            const scale = interpolate(
                progressValue.value,
                [index - 1, index, index + 1],
                [1, 1.1, 1],
                Extrapolate.CLAMP
            );
            return {
                opacity,
                transform: [{ scale }],
                backgroundColor: '#87aa03',
            };
        }, [progressValue])
    );

    const { currentLocation, latitude, longitude } = location

    const FetchCategories = useCallback(async () => {
        try {
            const response = await fetchCategories();
            if (response) { // Example: Check if the response has any data
                //console.log(response)
                dispatch(upCategories({
                    parent: response.parent,
                    child: response.child,
                }))
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        FetchRestaurants()
        FetchCategories()
    }, [currentLocation, latitude, longitude])

    const FetchRestaurants = useCallback(async () => {
        setLoading(true);
        setLoadmore(true);
        //console.log("orderby", order)
        try {
            const response = await fetchRestaurantsByCoords(latitude, longitude, page);
            //console.log(response)
            if (response.length > 0) { // Example: Check if the response has any data
                setRestaurants(response); // Append new data
                setPage(page + 1); // Increment page for the next request
                //setHasMore(lmore);
            } else {
                setHasMore(false); // No more data to load
            }

        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setSortModelVisible(false);
            setLoading(false);
            setLoadmore(false);
        }
    }, [currentLocation, page]);

    const SearchLocationHandle = () => {
        navigation.navigate('SearchLocation')
    }

    const handleSort = (value) => {
        //setOrderby(value);
        //console.log("Orderby", value);
        FetchRestaurants()
    };

    const handleSearch = (value) => {
        value.length > 0 && navigation.navigate('ResultRestaurants', {
            search: value,
        })
    }

    const LoadMoreHandle = () => {
        !loadmore && hasMore && setPage(page + 1)
        FetchRestaurants()
    }

    const sortOptions = [
        { label: 'Open Now', value: 'opennow' },
        { label: 'Recommended', value: 'recommended' }
    ]

    const [fontsLoaded] = useFonts({
        "popR": require("../assets/fonts/Poppins-Regular.ttf"),
        "popM": require("../assets/fonts/Poppins-Medium.ttf"),
        "popS": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "popB": require("../assets/fonts/Poppins-Bold.ttf")
    });

    //const fontsLoaded = useFonts();

    const handleOnLayout = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync(); //hide the splashscreen
        }
    }, [fontsLoaded]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hide(); // hide only after fonts are "loaded"
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const RadioButton = ({ label, value, checked, onPress }) => {
        return (
            <Pressable style={styles.radioButtonContainer} onPress={() => onPress(value)}>
                <View style={styles.radioCircle}>
                    {checked && <View style={styles.selectedCircle} />}
                </View>
                <Text style={styles.radioLabel}>{label}</Text>
            </Pressable>
        );
    };

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
                {/* <Pressable onPress={() => setSearchLocationVisible(true)} style={({ pressed }) => [{ backgroundColor: pressed ? '#526119' : '#2D2729' }, styles.locsearchbtn]}>
                    <View style={{ flexDirection: 'row', gap: 16 }}><Feather name="search" size={18} color="#FFFFFF" /><Text style={{ fontSize: 16, lineHeight: 20, color: '#FFFFFF', textAlign: 'left', fontFamily: 'popM' }}>Search any or Current Location</Text></View><Feather name="chevron-right" size={18} color="#FFFFFF" />
                </Pressable> */}
                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search by restaurant"
                            onChangeText={(value) => handleSearch(value)}
                            style={styles.textInput}
                        />
                        <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
                    </View>
                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => navigation.navigate('SortFilter')}>
                        <Image source={FilterList} style={{ maxWidth: 30, height: 30 }} />
                    </Pressable>
                </View>
                {/* <ModelComponent visible={sortModelVisible} onDismiss={() => setSortModelVisible(false)} heading='Sort' subheading=''>
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
            {/* <View style={styles.filters}>
                <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => setSortModelVisible(true)} >
                    <MaterialIcons name="sort" size={18} color="#2D2729" />
                    <Text style={{ color: '#2D2729', fontSize: 14 }}>{orderby === 'opennow' ? 'Open Now' : 'Recommended'}</Text>
                    <MaterialIcons name="arrow-drop-down" size={18} color="#2D2729" />
                </Pressable>
                <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => navigation.navigate('SortFilter')}>
                    <MaterialIcons name="filter-list-alt" size={18} color="#2D2729" />
                    <Text style={{ color: '#2D2729', fontSize: 14 }}>Filter</Text>
                </Pressable>
            </View> */}
            {/* <ModelComponent visible={searchLocationVisible} onDismiss={() => setSearchLocationVisible(false)} heading='Search' subheading='Search any Location or locate based on Current Location'>
                <View>
                    <Pressable style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 20, paddingVertical: 5 }} onPress={() => SearchLocationHandle()}>
                        <MaterialIcons name="location-on" size={24} color="#2D2729" />
                        <Text style={{ color: '#2D2729', fontSize: 18 }}>Search location</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 5 }} onPress={() => GetCurrentLocation()}>
                        <MaterialIcons name="my-location" size={24} color="#2D2729" />
                        <Text style={{ color: '#2D2729', fontSize: 18 }}>{loadingLocation ? 'Loading your location...' : 'Detect my location'}</Text>
                    </Pressable>
                </View>
            </ModelComponent> */}
            <ScrollView style={{ width: Dimensions.get('window').width }}>
                <View style={[globalStyles.container]}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }}>
                        <Carousel
                            loop
                            width={width}
                            height={130}
                            autoPlay={true}
                            autoPlayInterval={1500}
                            data={images}
                            scrollAnimationDuration={1500}
                            onProgressChange={(_, absoluteProgress) => {
                                progressValue.value = absoluteProgress;
                            }}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item.url }} style={{ width: width - 30, height: 130, borderRadius: 12, overflow: 'hidden' }} />
                            )}
                            pagingEnabled={true}
                            snapEnabled={true}
                            style={{ marginVertical: 10, borderRadius: 12, overflow: 'hidden' }}
                        />
                        {/* Pagination Dots */}
                        <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                            {images.map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        {
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: 'gray',
                                            marginHorizontal: 5,
                                        },
                                        animatedDotStyles[index],
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </View>
                {isLoading ?
                    <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, }]}>
                        <ActivityIndicator size='50' color='#B1D235' />
                    </View> :
                    <View style={[globalStyles.container]}>
                        <FlatList
                            scrollEnabled={false}
                            data={restaurants}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => <CardComponent item={item} ratings={false} index={index} />}
                        /* onEndReached={() => !loadmore && hasMore && setPage(page + 1)}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => loadmore && hasMore && <ActivityIndicator />} */
                        />
                    </View>
                }
            </ScrollView>
        </View >
    )
}

export default RestaurantsScreen

const styles = StyleSheet.create({
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
    dropdownMenuStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: Dimensions.get('window').width,
        zIndex: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#d8d8d8'
    },
    filterbtn: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        backgroundColor: '#B1D235',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#B1D235',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2D2729',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2D2729',
    },
    radioLabel: {
        fontSize: 16,
        fontFamily: 'popM',
        color: '#2D2729'
    },
    searchContainer: {
        width: Dimensions.get('window').width - 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
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
})