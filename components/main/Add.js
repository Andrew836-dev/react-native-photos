import React, { useState, useEffect } from "react";
import { Button, View, StyleSheet, Text, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    Camera.requestPermissionsAsync()
      .then(({ status }) => setHasCameraPermission(() => status === "granted"))
      .catch(() => setHasCameraPermission(() => false));

    ImagePicker.requestCameraPermissionsAsync()
      .then(({ status }) => setHasGalleryPermission(() => status === "granted"))
      .catch(() => setHasGalleryPermission(() => false));
  }, []);

  const takePicture = async () => {
    if (camera) {
      camera.takePictureAsync(null)
        .then(({ uri }) => setImage(uri))
        .catch(console.log);
    }
  }

  const pickImage = async () => {
    let { uri, cancelled, ...result } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (cancelled === false) {
      setImage(uri);
    }
  }

  if (hasCameraPermission === null || !hasGalleryPermission) return <View />;

  if (!hasCameraPermission || !hasGalleryPermission) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio="1:1"
        />
      </View>
      <Button
        style={{ flex: 0.1, alignSelf: "flex-end", alignItems: "center" }}
        title="Flip Image"
        onPress={() => (
          setType(currentType => (
            currentType === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          ))
        )}
      />
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
      <Button title="Save" onPress={() => navigation.navigate("Save", { image })} />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row"
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
});

export default Add;