import React, { useCallback, useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet, Platform } from "react-native";
import { followUser, getOneByUserId, getPostsByUserId, unFollowUser } from "../../utils/userAPI";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../redux/actions";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState({ email: "", name: "" });
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserPosts = useSelector(store => store.userState.posts);
  const currentUser = useSelector(store => store.userState.currentUser);
  const following = useSelector(store => store.userState.following);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser !== null) {
      if (props.route.params.uid === currentUser.uid) {
        setUser(currentUser);
        setUserPosts(currentUserPosts);
      } else {
        getUserData(props.route.params.uid);
      }
      setIsFollowing(() => following.includes(props.route.params.uid));
    }
  }, [props.route.params.uid, following, currentUser, currentUserPosts]);

  function getUserData(uid) {
    getPostsByUserId(uid)
      .then(posts => setUserPosts(() => posts));
    getOneByUserId(uid)
      .then(user => setUser(() => user));
  }

  const onSignOut = () => {
    dispatch(signOut());
    setUser(() => null);
  }

  const onFollow = () => followUser(currentUser.uid, props.route.params.uid);

  const onUnfollow = () => unFollowUser(currentUser.uid, props.route.params.uid);

  return !!user ? (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        {currentUser.email === user.email && <Text>{user.email}</Text>}
        <View>
          {props.route.params.uid === currentUser.uid
            ? (<Button title="Log Out" onPress={() => onSignOut()} />)
            : (isFollowing
              ? <Button title="Following" onPress={() => onUnfollow()} />
              : <Button title="Follow" onPress={() => onFollow()} />
            )}
        </View>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text>{item.caption}</Text>
              {/* <Image
                style={styles.image}
                source={{ uri: item.imageURL }}
              /> */}
            </View>

          )}
        />
        {/* <Button title="refresh" onPress={() => refresh(props.route.params.uid)} /> */}
      </View>
    </View>
  ) : (
      <View><Text style={{ textAlign: "center" }}>{`There as an error loading this user`}</Text></View>
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
  containerImage: Platform.OS === "web" ? ({
    minHeight: 120,
    flex: 1 / 3
  }) : ({
    flex: 1 / 3
  })
});

export default Profile;