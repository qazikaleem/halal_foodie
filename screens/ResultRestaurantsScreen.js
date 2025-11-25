import { StyleSheet, Text, TextInput, View, Image, ScrollView, Dimensions, StatusBar, Pressable, FlatList, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import globalStyles from '../constants/globalStyles'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fetchRestaurantsByCoords } from '../servers/restaurants';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Logo from '../assets/icon-bs.png'
import FilterList from '../assets/filter-list.png'
import ModelComponent from '../components/ModelComponent'
import { useSelector } from 'react-redux'
import CardComponent from '../components/CardComponent';
import Feather from '@expo/vector-icons/Feather';
import Chip from '../components/ChipComponent';

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

const ResultRestaurantsScreen = () => {

    const location = useSelector((state) => state.location)
    const categories = useSelector((state) => state.categories)
    const route = useRoute();

    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    const [loadmore, setLoadmore] = useState(true);
    const [restaurants, setRestaurants] = useState([])
    const [page, setPage] = useState(1); // Start at page 1 (or 0, depending on your API)
    const [hasMore, setHasMore] = useState(true);
    const [orderby, setOrderby] = useState(null)

    const [search, setSearch] = useState(route.params.search || '')
    const [sortfilter, setSortFilter] = useState(route.params.sortfilter || {})

    const { filter, sort } = sortfilter

    const filterCategories = categories.child.filter(item => filter?.includes(item.id));

    const { currentLocation, latitude, longitude } = location

    useEffect(() => {
        FetchRestaurants()
    }, [currentLocation, latitude, longitude, search, sortfilter])

    const FetchRestaurants = useCallback(async () => {
        setLoading(true);
        setLoadmore(true);
        //console.log("orderby", order)
        try {
            const response = await fetchRestaurantsByCoords(latitude, longitude, page, search, filter);
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
            setLoading(false);
            setLoadmore(false);
        }
    }, [currentLocation, search, page, sortfilter]);

    const SearchLocationHandle = () => {
        navigation.navigate('SearchLocation')
    }

    const handleCloseFilterCat = (id) => {
        setSortFilter({
            filter: filter.filter(item => item !== id),
            sort: sort
        })
    }

    const handleSort = (value) => {
        setOrderby(value);
        //console.log("Orderby", value);
        FetchRestaurants(value)
    };

    const LoadMoreHandle = () => {
        !loadmore && hasMore && setPage(page + 1)
        FetchRestaurants(orderby)
    }

    const sortOptions = [
        { label: 'Nearest', value: 'nearest' },
        { label: 'Halal Rating', value: 'hrating' }
    ]

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
                {/* <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search by restaurant"
                        onChangeText={(value) => setSearch(value)}
                        value={search}
                        style={styles.textInput}
                    />
                    <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
                </View> */}
                <View style={{ width: Dimensions.get('window').width - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search by restaurant"
                            onChangeText={(value) => setSearch(value)}
                            value={search}
                            style={styles.textInput}
                        />
                        <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
                    </View>
                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => navigation.navigate('SortFilter', {
                        search: search,
                    })}>
                        <Image source={FilterList} style={{ maxWidth: 30, height: 30 }} />
                    </Pressable>
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
            {/* <View style={styles.filters}>
                <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]} onPress={() => setSortModelVisible(true)} >
                    <MaterialIcons name="sort" size={18} color="#2D2729" />
                    <Text style={{ color: '#2D2729', fontSize: 14 }}>{orderby === 'nearest' ? 'Nearest' : 'Halal Rating'}</Text>
                    <MaterialIcons name="arrow-drop-down" size={18} color="#2D2729" />
                </Pressable>
                <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' }, styles.filterbtn]}>
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
                {isLoading ?
                    <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 15, }]}>
                        <ActivityIndicator size='50' color='#B1D235' />
                    </View> :
                    <View style={[globalStyles.container, { paddingVertical: 15 }]}>
                        {filterCategories.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                            {filterCategories.map((item) => {
                                return <Chip key={item.id} label={item.label} onClose={() => handleCloseFilterCat(item.id)} />
                            })}
                        </View>}
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
        </View>
    )
}

export default ResultRestaurantsScreen

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