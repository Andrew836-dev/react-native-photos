import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import firebase from "firebase";
import "firebase/firestore";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState({ email: "", name: "" });
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserPosts = useSelector(store => store.userState.posts);
  const currentUser = useSelector(store => store.userState.currentUser);
  const following = useSelector(store => store.userState.following);

  useEffect(() => {
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(currentUserPosts);
    } else {
      refresh(props.route.params.uid);
    }
    setIsFollowing(() => following.includes(props.route.params.uid));
  }, [props.route.params.uid, following]);

  function refresh(UID) {
    firebase.firestore()
      .collection("posts")
      .doc(UID)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then(snapshot => {
        const posts = snapshot.docs.map(doc => {
          const id = doc.id;
          const data = doc.data();
          return { ...data, id };
        });
        setUserPosts(posts);
      });
    firebase.firestore()
      .collection("users")
      .doc(UID)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          setUser(snapshot.data());
        } else {
          console.log("Snapshot does not exist");
        }
      });
  }
  const onFollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }
  const onUnfollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete()
  }

  return user && (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        {currentUser.email === user.email && <Text>{user.email}</Text>}
        {props.route.params.uid !== firebase.auth().currentUser.uid && (
          <View>
            {isFollowing ? (
              <Button
                title="Following"
                onPress={() => onUnfollow()}
              />
            ) :
              (
                <Button
                  title="Follow"
                  onPress={() => onFollow()}
                />
              )}
          </View>
        )}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={{ uri: item.imageURL }}
              />
            </View>

          )}
        />
        {/* <Button title="refresh" onPress={() => refresh(props.route.params.uid)} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 20
  },
  containerGallery: {
    flex: 1
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1
  },
  containerImage: {
    flex: 1 / 3
  }
})

export default Profile;