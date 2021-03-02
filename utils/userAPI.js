import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


export const doSignOut = () => firebase.auth().signOut();

export const doSignIn = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);

export const doRegister = async (name, email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => (
      firebase.firestore().collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set({ name, email, uid: firebase.auth().currentUser.uid })
    ));
}

export const getCurrentUser = async () => getOneByUserId(firebase.auth().currentUser.uid);

export const getOneByUserId = async (uid) => {
  return firebase.firestore()
    .collection("users")
    .doc(uid)
    .get()
    .then(snapshot => snapshot.exists ? snapshot.data() : null);
}

export const getCurrentUserPosts = async () => getPostsByUserId(firebase.auth().currentUser.uid);

export const getPostsByUserId = async (uid) => {
  return firebase.firestore()
    .collection("posts")
    .doc(uid)
    .collection("userPosts")
    .orderBy("creation", "asc")
    .get()
    .then(snapshot => (
      snapshot.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return { ...data, id };
      })
    ));
}

export const getBulkUsers = (uids) => {
  return firebase.firestore()
    .collection("users")
    .where("uid", "in", uids)
    .get()
    .then(response => response.docs.map(doc => doc.data()));
}

export const getCurrentUserFollowingCollection = () => getUserFollowingCollection(firebase.auth().currentUser.uid);

export const getUserFollowingCollection = (uid) => {
  return firebase.firestore()
    .collection("following")
    .doc(uid)
    .collection("userFollowing")
}

export const followUser = async (follower, leader) => {
  return firebase.firestore()
    .collection("following")
    .doc(follower)
    .collection("userFollowing")
    .doc(leader)
    .set({});
}

export const unFollowUser = async (follower, leader) => {
  return firebase.firestore()
    .collection("following")
    .doc(follower)
    .collection("userFollowing")
    .doc(leader)
    .delete();
}