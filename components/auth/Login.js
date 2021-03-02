import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { doSignIn } from "../../utils/userAPI"

function LoginScreen() {
  const [formValues, setFormValue] = useState({ email: "", password: "" });

  function onSignIn() {
    const { email, password } = formValues;
    doSignIn(email, password)
      .then((result) => console.log("Login success", result))
      .catch((error) => console.log(error));
  }
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <TextInput value={formValues.email} onChangeText={email => setFormValue(oldValue => ({ ...oldValue, email }))} />
      <TextInput value={formValues.password} onChangeText={password => setFormValue(oldValue => ({ ...oldValue, password }))} secureTextEntry={true} />
      <Button onPress={onSignIn} title="Sign in" />
    </View>
  )
}

export default LoginScreen;