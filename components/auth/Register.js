import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";
import { doRegister } from "../../utils/userAPI";

function RegisterScreen() {
  const [formValues, setFormValue] = useState({ name: "", email: "", password: "" });

  function onSignUp() {
    const { name, email, password } = formValues;
    doRegister(name, email, password)
      .catch((error) => console.log(error));
  }

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <TextInput value={formValues.name} onChangeText={name => setFormValue(oldValue => ({ ...oldValue, name }))} />
      <TextInput value={formValues.email} onChangeText={email => setFormValue(oldValue => ({ ...oldValue, email }))} />
      <TextInput value={formValues.password} onChangeText={password => setFormValue(oldValue => ({ ...oldValue, password }))} secureTextEntry={true} />
      <Button onPress={onSignUp} title="Sign Up" />
    </View>
  )
}

export default RegisterScreen;