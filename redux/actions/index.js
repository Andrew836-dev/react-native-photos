import { doSignOut, getBulkUsers, getCurrentUser, getCurrentUserFollowingCollection, getCurrentUserPosts, getOneByUserId, getPostsByUserId } from "../../utils/userAPI";
import { CLEAR_DATA, USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants";


export function clearData() {
  return (dispatch => {
    dispatch({ type: CLEAR_DATA });
  })
}

export function signOut() {
  return (dispatch => {
    doSignOut();
    dispatch(clearData());
  });
}
export function fetchUser() {
  return (dispatch => {
    getCurrentUser()
      .then(user => dispatch({ type: USER_STATE_CHANGE, currentUser: user }));
  });
}

export function fetchUserPosts() {
  return (dispatch => {
    getCurrentUserPosts()
      .then(posts => dispatch({ type: USER_POSTS_STATE_CHANGE, posts }));
  });
}

export function fetchUserFollowing() {
  return (dispatch => {
    getCurrentUserFollowingCollection()
      .onSnapshot(snapshot => {
        const following = snapshot.docs.map(({ id }) => id);
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        const uidList = Array.from(following);
        while (uidList.length) {
          const maximumQueries = 10;
          dispatch(fetchUsersData(uidList.slice(0, maximumQueries), true));
          uidList.splice(0, maximumQueries);
        }
      });
  });
}

export function fetchUsersData(uidList, isFollowed) {
  if (!Array.isArray(uidList)) uidList = [uidList];
  return ((dispatch, getState) => {
    const existingUsers = getState().usersState.users;
    const missingUserIDs = uidList.filter(uid => existingUsers.every(user => user.uid !== uid));
    if (missingUserIDs.length) {
      getBulkUsers(missingUserIDs)
        .then(users => {
          users.forEach(user => {
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            if (isFollowed) {
              dispatch(fetchUsersFollowingPosts(user.uid));
            }
          });
        }).catch((err) => console.log("Error in fetchUsersData", err));
    }
  });
}

export function fetchUsersFollowingPosts(uid) {
  return ((dispatch, getState) => {
    getPostsByUserId(uid)
      .then(posts => {
        const user = getState().usersState.users.find(el => el.uid === uid)
        posts.forEach(post => post.user = user);
        dispatch({ type: USERS_POSTS_STATE_CHANGE, uid, posts });
      });
  })
}