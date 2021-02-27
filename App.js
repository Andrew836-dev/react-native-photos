import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));

import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import { View, Text } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
      setLoaded(true);
    });
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading</Text>
      </View>
    )
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Add" component={AddScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
