import React, { useCallback, useState, useEffect } from "react";
import { Button, FlatList, Image, Text, TextInput, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsersData } from "../../redux/actions";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function CommentScreen(props) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postId, setPostId] = useState("");
  const [fetchList, setFetchList] = useState([]);
  const users = useSelector(state => state.usersState.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.route.params.postId !== postId) {
      refreshComments();
      setPostId(props.route.params.postId);
    }
  }, [props.route.params.postId, postId, refreshComments])

  useEffect(() => {
    const allUsersPopulated = comments.every(comment => comment.hasOwnProperty("user"));
    if (!allUsersPopulated) {
      setComments(matchUserToComment);
    }
  }, [comments, matchUserToComment]);

  const fetchCollectionReference = useCallback(() => {
    return firebase.firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
  }, [props.route.params.uid, props.route.params.postId]);

  const refreshComments = useCallback(() => {
    fetchCollectionReference()
      .orderBy("creation", "asc")
      .get()
      .then(snapshot => {
        const comments = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data }
        });
        setComments(() => matchUserToComment(comments));
      });
  }, [fetchCollectionReference, matchUserToComment]);

  const matchUserToComment = useCallback((comments) => {
    const nextFetchList = Array.from(fetchList).filter(uid => users.every(user => user.uid !== uid));
    const output = comments.map(comment => {
      if (comment.user) {
        return comment;
      }
      const [user] = users.filter(user => user.uid === comment.creator);
      if (user) {
        return { ...comment, user }
      }
      if (!nextFetchList.includes(comment.creator)) {
        nextFetchList.unshift(comment.creator);
      }
      return comment;
    });
    if (nextFetchList.filter(currentUID => fetchList.every(oldUID => oldUID !== currentUID)).length > 0) {
      dispatch(fetchUsersData(nextFetchList, false));
      setFetchList(() => nextFetchList);
    }
    return output;
  }, [users, fetchList])

  const onCommentSend = () => {
    fetchCollectionReference()
      .add({
        creator: firebase.auth().currentUser.uid,
        text: commentText,
        creation: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        refreshComments();
        setCommentText("");
      }).catch((err) => console.log("Error in comment send", err));
  };

  return <View>
    {/* <Image style={{ flex: 1, aspectRatio: 1, minHeight: 93 }} source={{ uri: props.route.params.imageURL }} /> */}
    <FlatList
      numColumns={1}
      data={comments}
      renderItem={({ item }) => (
        <View style={{ flexDirection: "row" }}>
          <Text>{`${item.user ? item.user.name : "Loading..."} said: `}</Text>
          <Text>{item.text}</Text>
        </View>
      )}
    />
    <View>
      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Type your comment here . . ."
      />
      <Button title="Send" onPress={onCommentSend} />
    </View>
  </View>
}

export default CommentScreen;