import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import ProtectedRoute from "../auth/protectedRoute";
import FavoriteResScreen from '../screens/FavoriteResScreen';
import HalalReviewInfoScreen from '../screens/HalalReviewInfoScreen';
import HalalReviewScreen from "../screens/HalalReviewScreen";
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from "../screens/LoginScreen";
import MapViewScreen from '../screens/MapViewScreen';
import RegisterScreen from "../screens/RegisterScreen";
import RestaurantsScreen from '../screens/RestaurantsScreen';
import ResultRestaurantsScreen from "../screens/ResultRestaurantsScreen";
import SearchLocationScreen from '../screens/SearchLocationScreen';
import SingleRestaurantScreen from '../screens/SingleRestaurantScreen';
import SortFilterScreen from "../screens/SortFilterScreen";
import UserAccountScreen from '../screens/UserAccountScreen';
import VerifiedResScreen from '../screens/VerifiedResScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, tabBarStyle: { backgroundColor: '#B1D235', paddingTop: 5, height: 50 }, tabBarLabelStyle: { display: 'none' } }}>
            <Tab.Screen
                name='Restaurants'
                component={RestaurantsScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <SimpleLineIcons name="home" size={25} color="#2D2729" />
                        ) : (
                            <SimpleLineIcons name="home" size={25} color="#ffffff" />
                        ),
                }}
            />
            <Tab.Screen
                name='MapView'
                component={MapViewScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <SimpleLineIcons name="map" size={25} color="#2D2729" />
                        ) : (
                            <SimpleLineIcons name="map" size={25} color="#ffffff" />
                        ),
                }}
            />
            {/* <Tab.Screen
                name='FavoriteRes'
                children={() => (
                    <ProtectedRoute>
                        <FavoriteResScreen />
                    </ProtectedRoute>
                )}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <SimpleLineIcons name="heart" size={25} color="#2D2729" />
                        ) : (
                            <SimpleLineIcons name="heart" size={25} color="#ffffff" />
                        ),
                }}
            /> */}
            <Tab.Screen
                name='VerifiedRes'
                component={VerifiedResScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Octicons name="verified" size={28} color="#2D2729" />
                        ) : (
                            <Octicons name="verified" size={28} color="#ffffff" />
                        ),
                }}
            />
            <Tab.Screen
                name='UserAccount'
                children={() => (
                    <ProtectedRoute>
                        <UserAccountScreen />
                    </ProtectedRoute>
                )}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <SimpleLineIcons name="user" size={25} color="#2D2729" />
                        ) : (
                            <SimpleLineIcons name="user" size={25} color="#ffffff" />
                        ),
                }}
            />
            <Tab.Screen
                name='HalaReviewInfo'
                component={HalalReviewInfoScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <SimpleLineIcons name="info" size={25} color="#2D2729" />
                        ) : (
                            <SimpleLineIcons name="info" size={25} color="#ffffff" />
                        ),
                }}
            />
            {/* <Tab.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    tabBarButton: () => null, // hides from bottom tab bar
                }}
            />
            <Tab.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                    tabBarButton: () => null, // hides from bottom tab bar
                }}
            /> */}
        </Tab.Navigator>
    )
}
const StackNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Main" component={BottomTabs} />
                <Stack.Screen name="ResultRestaurants" component={ResultRestaurantsScreen} />
                <Stack.Screen name="SingleRestaurant" component={SingleRestaurantScreen} />
                <Stack.Screen name="SingleRestaurantHalalReview" component={HalalReviewScreen} />
                <Stack.Screen name="FavoriteRes" children={() => (<ProtectedRoute><FavoriteResScreen /></ProtectedRoute>)} />
                <Stack.Screen name="SearchLocation" component={SearchLocationScreen} />
                <Stack.Screen name="SortFilter" component={SortFilterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default StackNavigation