import React, { useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchUserPosts } from "../redux/actions";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";

const EmptyScreen = () => null;

const Tab = createMaterialBottomTabNavigator();

function MainScreen() {
  const currentUser = useSelector(store => store.userState.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchUserPosts());
  }, []);

  return (
    <Tab.Navigator initialRouteName="Feed" labeled={false}>
      <Tab.Screen name="Feed" component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          )
        }}
      />
      <Tab.Screen name="AddContainer" component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.navigate("Add");
          }
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
          )
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account-circle" color={color} size={26} />
        )
      }}
      />
    </Tab.Navigator>
  )
}

export default MainScreen;