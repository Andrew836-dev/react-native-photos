import React from "react";
import { View, Text, Button } from "react-native";
import firebase from "firebase";

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>Profile</Text>
      <Button onPress={() => firebase.auth().signOut()} title="Sign Out" />
    </View>
  );
}

export default Profile;