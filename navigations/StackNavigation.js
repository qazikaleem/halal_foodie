import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import SingleRestaurantScreen from '../screens/SingleRestaurantScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="Restaurants" component={RestaurantsScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="SingleRestaurant" component={SingleRestaurantScreen} options={{
                headerShown: false
            }} />

        </Stack.Navigator>
    );
}

const StackNavigation = () => {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    )
}

export default StackNavigation