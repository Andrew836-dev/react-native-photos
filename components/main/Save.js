import React, { useState } from "react";
import { View, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";

function SaveScreen({ navigation, ...props }) {
  const [caption, setCaption] = useState("")
  const uri = props.route.params.image;

  const uploadImage = async () => {
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    fetch(uri)
      .then(response => response.blob())
      .then(blob => {
        const task = (
          firebase.storage()
            .ref()
            .child(childPath)
            .put(blob)
        );
        const taskProgress = snapshot => console.log(`transferred: ${snapshot.bytesTransferred}`);
        const taskError = console.log;
        const taskCompleted = () => task.snapshot.ref.getDownloadURL().then(savePostData);
        task.on("state_changed", taskProgress, taskError, taskCompleted);
      }).catch(console.log);

  }
  const savePostData = imageURL => {
    firebase.firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        imageURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => navigation.popToTop())
      .catch(console.log);
  }
  return <View style={{ flex: 1 }}>
    <Image source={{ uri }} style={{ flex: 1 }} />
    <TextInput
      value={caption}
      placeholder="Write a Caption . . ."
      onChangeText={caption => setCaption(caption)}
    />
    <Button title="Save" onPress={() => uploadImage()} />
  </View>
}

export default SaveScreen;