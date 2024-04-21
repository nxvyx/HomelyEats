import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from "expo-splash-screen";
import * as Location from 'expo-location';
import BottomTab from './app/navigation/BottomTab';
import { UserLocationContext } from './app/context/UserLocationContext';
import { LoginContext } from './app/context/LoginContext';
import { CartCountContext } from './app/context/CartCountContext';
import { RestaurantContext } from './app/context/RestaurantContext';
import { UserReversedGeoCode } from './app/context/UserReversedGeoCode';
import FoodNavigator from './app/navigation/FoodNavigator';
import RestaurantPage from './app/navigation/RestaurantPage';
import Restaurant from './app/screens/restaurant/Restaurant';
import AddRating from './app/screens/AddRating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './app/screens/SignUp';
const Stack = createNativeStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [restaurantObj, setRestaurantObj] = useState(null);
  const [error, setErrorMsg] = useState(null);


  const defaultAddresss = { "city": "Delhi", "country": "India", "district": "North Delhi", "isoCountryCode": "IN", "name": "Flat no. 10, Buddha Apartments", "postalCode": "110007", "region": "DL", "street": "C.C,Colony", "streetNumber": "109/2A", "subregion": "Delhi", "timezone": "India/Kolkata" }

  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/Poppins-Regular.ttf'),
    light: require('./assets/fonts/Poppins-Light.ttf'),
    bold: require('./assets/fonts/Poppins-Bold.ttf'),
    medium: require('./assets/fonts/Poppins-Medium.ttf'),
    extrabold: require('./assets/fonts/Poppins-ExtraBold.ttf'),
    semibold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      setAddress(defaultAddresss);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location as denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location)
      console.log(location);
      loginStatus();
    })();
  }, [])

  if (!fontsLoaded) {
    return;
  }

  const loginStatus = async () => {
    const userToken = await AsyncStorage.getItem('token')

    if (userToken !== null) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  };

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      <UserReversedGeoCode.Provider value={{ address, setAddress }}>
        <RestaurantContext.Provider value={{ restaurantObj, setRestaurantObj }}>
        <LoginContext.Provider value={{ login, setLogin }}>
          <CartCountContext.Provider value={{ cartCount, setCartCount }}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name='bottom-navigation'
                  component={BottomTab}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name='food-nav'
                  component={FoodNavigator}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name='restaurant-page'
                  component={RestaurantPage}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name='restaurant'
                  component={Restaurant}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name='signUp'
                  component={SignUp}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name='rating'
                  component={AddRating}
                  options={{ headerShown: false }}
                />


              </Stack.Navigator>
            </NavigationContainer>
            </CartCountContext.Provider>
          </LoginContext.Provider>
        </RestaurantContext.Provider>
      </UserReversedGeoCode.Provider>
    </UserLocationContext.Provider>

  );
}
