import firebase from "firebase";
import "firebase/firestore";
import { CLEAR_DATA, USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants";


export function clearData() {
  return (dispatch => {
    dispatch({ type: CLEAR_DATA });
  })
}
export function fetchUser() {
  return (dispatch => {
    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("Snapshot does not exist");
        }
      });
  });
}

export function fetchUserPosts() {
  return (dispatch => {
    firebase.firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then(snapshot => {
        const posts = snapshot.docs.map(doc => {
          const id = doc.id;
          const data = doc.data();
          return { ...data, id };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  });
}

export function fetchUserFollowing() {
  return (dispatch => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot(snapshot => {
        const following = snapshot.docs.map(({ id }) => id);
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        following.forEach(uid => dispatch(fetchUsersData(uid)));
      });
  });
}

export function fetchUsersData(uid) {
  return ((dispatch, getState) => {
    const found = getState().usersState.users.some(el => el.uid === uid);
    if (!found) {
      firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            const user = snapshot.data();
            user.uid = uid;
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            dispatch(fetchUsersFollowingPosts(uid));
          } else {
            console.log("Snapshot does not exist");
          }
        });
    }
  });
}

export function fetchUsersFollowingPosts(uid) {
  return ((dispatch, getState) => {
    firebase.firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then(snapshot => {
        // this may be required with longer lists to check and longer async delays
        // const uid = snapshot.gP.en.path.segments[1];
        const user = getState().usersState.users.find(el => el.uid === uid)
        const posts = snapshot.docs.map(doc => {
          const id = doc.id;
          const data = doc.data();
          return { ...data, user, id };
        });
        dispatch({ type: USERS_POSTS_STATE_CHANGE, uid, posts });
      });
  })
}