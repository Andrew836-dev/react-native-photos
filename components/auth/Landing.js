import React from "react";
import { Button, StyleSheet, View } from "react-native";

function LandingScreen({ navigation }) {
  return (<View style={styles.container}>
    <View style={styles.margins}>
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
    <View style={styles.margins}>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
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
  }
});

export default LandingScreen;