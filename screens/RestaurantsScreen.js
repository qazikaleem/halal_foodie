import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useDispatch, useSelector } from 'react-redux';
import FilterList from '../assets/filter-list.png';
import Logo from '../assets/icon-bs.png';
import CardComponent from '../components/CardComponent';
import globalStyles from '../constants/globalStyles';
import { upCategories } from '../redux/catSlice';
import { fetchCategories } from '../servers/categories';
import { fetchRestaurantsByCoords } from '../servers/restaurants';

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');
const images = [
    { id: 1, url: 'https://backend.halalfoodnearme.com.au/artifacts/slider/10956.jpg' },
    { id: 2, url: 'https://backend.halalfoodnearme.com.au/artifacts/slider/18551.jpg' },
    { id: 3, url: 'https://backend.halalfoodnearme.com.au/artifacts/slider/10956.jpg' },
];

const HEADER_COMPONENT = 'HEADER';

const RestaurantsScreen = () => {

    const location = useSelector((state) => state.location);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // --- Pagination & data state ---
    const [isLoading, setIsLoading] = useState(true);       // initial / refresh load
    const [isLoadingMore, setIsLoadingMore] = useState(false); // bottom load-more
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const backPressTimestamp = useRef(0);
    const isFetchingRef = useRef(false); // guard against concurrent fetches

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

    const { currentLocation, latitude, longitude } = location;

    // ─── Fetch categories (unchanged) ────────────────────────────────────────
    const FetchCategories = useCallback(async () => {
        try {
            const response = await fetchCategories();
            if (response) {
                dispatch(upCategories({
                    parent: response.parent,
                    child: response.child,
                }));
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    // ─── Reset & initial fetch when location changes ──────────────────────────
    useEffect(() => {
        // Reset everything when location changes
        setRestaurants([]);
        setPage(1);
        setHasMore(true);
        FetchCategories();
        FetchRestaurantsPage(1, true); // fresh load
    }, [currentLocation, latitude, longitude]);

    // ─── Core fetch function ──────────────────────────────────────────────────
    /**
     * @param {number} pageToFetch  - which page number to request
     * @param {boolean} isRefresh   - true → replace list; false → append to list
     */
    const FetchRestaurantsPage = useCallback(async (pageToFetch, isRefresh = false) => {
        if (isFetchingRef.current) return; // prevent duplicate calls
        isFetchingRef.current = true;

        if (isRefresh) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            // fetchRestaurantsByCoords must accept (lat, lng, page) and return { res, lmore }
            const response = await fetchRestaurantsByCoords(latitude, longitude, pageToFetch);

            // Expected API shape: { res: [...], lmore: true|false }
            const newItems = response?.res ?? [];
            const more = response?.lmore ?? false;

            if (isRefresh) {
                setRestaurants(newItems);
            } else {
                setRestaurants(prev => [...prev, ...newItems]);
            }

            setHasMore(more);
            setPage(pageToFetch + 1); // next page ready

        } catch (error) {
            console.error('Failed to fetch restaurants:', error);
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [latitude, longitude]);

    // ─── Called when FlatList reaches the bottom ──────────────────────────────
    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && hasMore && !isFetchingRef.current) {
            FetchRestaurantsPage(page, false);
        }
    }, [isLoadingMore, hasMore, page, FetchRestaurantsPage]);

    // ─── Navigation helpers ───────────────────────────────────────────────────
    const SearchLocationHandle = () => navigation.navigate('SearchLocation');

    // ─── Carousel header rendered inside FlatList ─────────────────────────────
    const ListHeaderComponent = useCallback(() => (
        <View style={{ flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }}>
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
                    <Image
                        source={{ uri: item.url }}
                        style={{ width: width - 30, height: 130, borderRadius: 8, overflow: 'hidden' }}
                    />
                )}
                pagingEnabled={true}
                snapEnabled={true}
                style={{ marginVertical: 10, borderRadius: 8, overflow: 'hidden' }}
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
    ), []);

    // ─── Footer: spinner while loading more, "No more" message, or nothing ────
    const ListFooterComponent = useCallback(() => {
        if (isLoadingMore) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="large" color="#B1D235" />
                    <Text style={styles.footerText}>Loading more...</Text>
                </View>
            );
        }
        if (!hasMore && restaurants.length > 0) {
            return (
                <View style={styles.footerLoader}>
                    <Text style={styles.footerText}>You've reached the end 🎉</Text>
                </View>
            );
        }
        return null;
    }, [isLoadingMore, hasMore, restaurants.length]);

    // ─── Fonts ────────────────────────────────────────────────────────────────
    const [fontsLoaded] = useFonts({
        popR: require('../assets/fonts/Poppins-Regular.ttf'),
        popM: require('../assets/fonts/Poppins-Medium.ttf'),
        popS: require('../assets/fonts/Poppins-SemiBold.ttf'),
        popB: require('../assets/fonts/Poppins-Bold.ttf'),
    });

    const handleOnLayout = useCallback(async () => {
        if (fontsLoaded) await SplashScreen.hideAsync();
    }, [fontsLoaded]);

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hide();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <View style={globalStyles.droidSafeArea} onLayout={handleOnLayout}>
            <StatusBar
                translucent
                backgroundColor="#B1D235"
                statusBarStyle="light-content"
            />

            {/* ── Fixed Header ── */}
            <View style={[globalStyles.header, { paddingTop: StatusBar.currentHeight + 15 }]}>
                {currentLocation && (
                    <Pressable
                        onPress={SearchLocationHandle}
                        style={{
                            width: Dimensions.get('window').width - 30,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                        }}
                    >
                        <View>
                            <Entypo name="location" size={24} color="#2D2729" />
                        </View>
                        <View style={{ width: Dimensions.get('window').width - 120 }}>
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
                        <Image source={Logo} style={{ maxWidth: 40, height: 40 }} />
                    </Pressable>
                )}

                <View style={{
                    width: Dimensions.get('window').width - 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginTop: 10,
                }}>
                    <View style={styles.searchContainer}>
                        <Pressable
                            style={styles.textInput}
                            onPress={() => navigation.navigate('ResultRestaurants', { search: '' })}
                        >
                            <Text style={{ paddingHorizontal: 4, paddingVertical: 8, fontSize: 16, opacity: 0.55 }}>
                                Search by restaurant
                            </Text>
                        </Pressable>
                        <Feather name="search" size={20} color="#B1D235" style={styles.searchIcon} />
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            { backgroundColor: pressed ? 'rgba(177, 210, 53,0.45)' : '#ffffff' },
                            styles.filterbtn,
                        ]}
                        onPress={() => navigation.navigate('SortFilter')}
                    >
                        <Image source={FilterList} style={{ maxWidth: 30, height: 30 }} />
                    </Pressable>
                </View>
            </View>

            {/* ── Main List ── */}
            {isLoading ? (
                <View style={styles.initialLoader}>
                    <ActivityIndicator size={50} color="#B1D235" />
                </View>
            ) : (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <CardComponent item={item} ratings={true} index={index} screen="Home" />
                    )}
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={ListFooterComponent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No restaurants found nearby.</Text>
                        </View>
                    }
                    // ── Infinite scroll ──
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.4}   // trigger when 40% from bottom
                    contentContainerStyle={{ width: Dimensions.get('window').width - 30, paddingHorizontal: 15, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default RestaurantsScreen;

const styles = StyleSheet.create({
    initialLoader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerLoader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 6,
    },
    footerText: {
        fontSize: 13,
        color: '#888',
        fontFamily: 'popR',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyText: {
        fontSize: 15,
        color: '#888',
        fontFamily: 'popM',
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
        lineHeight: 20,
    },
});
