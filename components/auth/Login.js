import React, { useState, useRef } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { doSignIn } from "../../utils/userAPI"

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedBack, setFeedBack] = useState({ color: "#000", message: " " });
  const passwordRef = useRef();

  const onSignIn = () => {
    if (password.length < 6) {
      return setFeedBack({ color: "#d00", message: "Password must be at least 6 characters" });
    }
    setFeedBack({ color: "#000", message: "Logging you in." })
    doSignIn(email, password)
      .catch(({ message }) => {
        setFeedBack({ color: "#d00", message });
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        blurOnSubmit
        style={[styles.margins, styles.borders]}
        placeholder="Your email . . ."
        value={email}
        onChangeText={setEmail}
        onBlur={() => passwordRef.current.focus()}
      />
      <TextInput
        ref={passwordRef}
        style={[styles.margins, styles.borders]}
        placeholder="Your password . . ."
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        onSubmitEditing={onSignIn}
      />
      <View style={styles.margins}>
        <Button
          onPress={onSignIn}
          title="Sign in"
        />
      </View>
      <View style={styles.margins}>
        <Text style={[styles.centerText, { color: feedBack.color }]}>
          {feedBack.message}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  margins: {
    marginHorizontal: 10,
    marginVertical: 5
  },
  borders: {
    borderColor: "#ddd",
    borderWidth: 1,
  },
  centerText: {
    textAlign: "center"
  }
});

export default LoginScreen;