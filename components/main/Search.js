import React, { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import firebase from "firebase";
import "firebase/firestore";

function SearchScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = search => {
    firebase.firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then(snapshot => {
        const userData = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { ...data, id }
        });
        setUsers(userData);
      });
  }

  return (
    <View>
      <TextInput placeholder="Search . . ." onChangeText={fetchUsers} />
      <FlatList
        numColumns={1}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { uid: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default SearchScreen;