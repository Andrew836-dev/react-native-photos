import React from "react";
import { Button, View, Text, Image, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserPosts } from "../../redux/actions";

function Profile() {
  const posts = useSelector(store => store.userState.posts);
  const currentUser = useSelector(store => store.userState.currentUser);
  const dispatch = useDispatch();

  function refresh() {
    dispatch(fetchUserPosts());
  }

  if (!currentUser || !posts) return (<View><Text>Loading Profile...</Text></View>);

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={{ uri: item.data.imageURL }} />
            </View>

          )}
        />
        <Button title="refresh" onPress={() => refresh()} />
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