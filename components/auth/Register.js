import React, { useRef, useState } from "react";
import { View, Button, StyleSheet, Text, TextInput } from "react-native";
import { doRegister } from "../../utils/userAPI";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedBack, setFeedBack] = useState({ type: "plain", message: " " });
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSignUp = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return setFeedBack({ type: "error", message: "Please fill all fields" });
    }
    setFeedBack({ type: "plain", message: "Creating account . . ." });
    doRegister(name, email, password)
      .catch((error) => {
        const { message } = error;
        // console.log(error)
        setFeedBack({ type: "error", message });
      });
  }

  const validatePassword = input => {
    if (input.length < 6) {
      setFeedBack({ type: "error", message: "Password must be at least 6 characters" });
    } else {
      setFeedBack({ type: "plain", message: " " });
    }
    setPassword(input);
  }

  return (
    <View style={styles.container}>
      <TextInput
        ref={nameRef}
        style={[styles.margins, styles.borders]}
        placeholder="Your name . . ."
        value={name}
        onChangeText={setName}
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <TextInput
        ref={emailRef}
        style={[styles.margins, styles.borders]}
        placeholder="Your email . . ."
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <TextInput
        ref={passwordRef}
        style={[styles.margins, styles.borders]}
        placeholder="Your password . . ."
        value={password}
        secureTextEntry={true}
        onChangeText={validatePassword}
        onSubmitEditing={onSignUp}
      />
      <View style={styles.margins}>
        <Button onPress={onSignUp} title="Sign Up" />
      </View>
      <View style={styles.margins}>
        <Text style={[styles.centerText, { color: textColor[feedBack.type] }]}>
          {feedBack.message}
        </Text>
      </View>
    </View>
  )
}

const textColor = {
  error: "#d00",
  plain: "#000"
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
  }
});

export default RegisterScreen;