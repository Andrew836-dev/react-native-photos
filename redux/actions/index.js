import firebase from "firebase";
import "firebase/firestore";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants";

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
          console.log(id, data);
          return { id, data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  });
}