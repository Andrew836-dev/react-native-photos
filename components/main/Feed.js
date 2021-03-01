import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet, Platform } from "react-native";
import { useSelector } from "react-redux";

function Feed() {
  const [posts, setPosts] = useState([]);

  const usersLoaded = useSelector(store => store.usersState.usersLoaded);
  const users = useSelector(store => store.usersState.users);
  const following = useSelector(store => store.userState.following);

  useEffect(() => {
    let posts = [];
    if (usersLoaded === following.length) {
      following.forEach(uid => {
        const user = users.find(el => el.uid === uid);
        if (user !== undefined) {
          posts = [...posts, ...user.posts];
        }
      });
      posts.sort((x, y) => x.creation - y.creation);
      setPosts(() => posts);
    }
  }, [usersLoaded, following]);

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
                <Image
                  style={styles.image}
                  source={{ uri: item.imageURL }}
                />
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
    marginTop: 40,
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