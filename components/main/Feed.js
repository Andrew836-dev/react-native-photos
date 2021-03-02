import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet, Platform } from "react-native";
import { useSelector } from "react-redux";

function Feed({ navigation }) {
  const [posts, setPosts] = useState([]);

  const users = useSelector(store => store.usersState.users);
  const following = useSelector(store => store.userState.following);

  useEffect(() => {
      const posts = users.filter(user => user.hasOwnProperty("posts"))
        .map(user => user.posts)
        .reduce((prev, curr) => [...prev, ...curr], [])
        .sort((x, y) => x.creation - y.creation);
      setPosts(posts);
  }, [following, users]);

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={3}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <View style={styles.containerImage}>
                <Text onPress={() => navigation.navigate("Profile", { uid: item.user.uid })}>
                  {item.user.name}
                </Text>
                <Text style={styles.image}>{item.caption}</Text>
                {/* <Image
                  style={styles.image}
                  source={{ uri: item.imageURL }}
                  accessibilityLabel={`Image caption: ${item.caption}`}
                /> */}
                <Text onPress={() => navigation.navigate("Comment", { uid: item.user.uid, postId: item.id, imageURL: item.imageURL })}>
                  View Commments...
                </Text>
              </View>
            )}
          />
          {/* <Button title="refresh" onPress={() => refresh(props.route.params.uid)} /> */}
        </View>
      ) : (
          <Text>No posts here!</Text>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  containerGallery: {
    flex: 1
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1
  },
  containerImage: Platform.OS === "web" ? ({
    minHeight: 120,
    flex: 1 / 3
  }) : ({
    flex: 1 / 3
  })
});

export default Feed;