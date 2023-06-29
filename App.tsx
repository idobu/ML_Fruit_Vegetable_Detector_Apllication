import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  cameraContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  cameraBorder: {
    width: width * 0.95, // Adjust the percentage as desired
    height: height * 0.6, // Adjust the percentage as desired
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4682B4',
    top: '4%',
    marginTop: 0, // Add margin top for spacing
  },
  PhotoBorder: {
    width: width * 0.25, // Adjust the percentage as desired
    height: height * 0.2, // Adjust the percentage as desired
    borderRadius: 30,
    borderWidth: 2,
    left: '5%',
    top: '6%',
    borderColor: '#4682B4',
    position: 'absolute'
  },
  StringBorder: {
    width: width * 0.8, // Adjust the percentage as desired
    height: height * 0.11, // Adjust the percentage as desired
    borderRadius: 30,
    borderWidth: 4,
    top: '138%',
    borderColor: '#6495ED',
    position: 'absolute'
  },
  buttonStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 50,
    backgroundColor: '#6C78D7',
    borderRadius: 25,
    marginTop: 7, // Add margin top for spacing
  },
  buttonStyleClicked: {
    backgroundColor: '#515aa1',
  },
  AnswerText: {
    fontSize: 25, fontWeight: 'bold', color: '#6495ED', paddingTop: 0, textAlign: 'center'
  }
});

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);


  if (hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No Camera Access</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      const photo64 = await FileSystem.readAsStringAsync(data.uri, {
        encoding: 'base64',
      });
      const formData = new FormData();
      formData.append('image', photo64);

      fetch('https://e2d5-85-250-123-76.ngrok-free.app/ToModel', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => response.text())
        .then((data) => {
          alert(data); // "name_fruit_vegetable"
          setItem(data)
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }


  };

  return (

    <View style={{ paddingTop: 'auto', backgroundColor: '#82EEFD', flex: 1 }}>
      <View style={styles.cameraContainer}>

        <Camera
          style={styles.cameraBorder}
          type={type}
          ref={(ref) => setCamera(ref)}
          ratio={'1:1'}

        />
        {image && <Image source={{ uri: image }} style={styles.PhotoBorder} />}

      </View>
      <View style={{ alignItems: 'center', paddingTop: 40 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4682B4', paddingTop: 0 }}>
          Vegetable-Fruit Recognition App
        </Text>
        <Text style={{ fontSize: 16, marginTop: 5, color: '#2E5894', paddingTop: 0 }}>
          Upload a picture of a vegetable to identify it.
        </Text>
        <TouchableOpacity onPress={() => takePicture()} style={styles.buttonStyle}>
          <Text style={{ color: 'white', fontSize: 16 }}>Shoot</Text>
        </TouchableOpacity>

        <View style={styles.StringBorder}>
          <Text style={styles.AnswerText}>Your last item is:</Text>
          <Text style={{marginTop:-10, color: '#6495ED', textAlign: 'center' }}>
            {item && <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#6495ED', textAlign: 'center' }}>{item}</Text>}
          </Text>
        </View>
      </View>



      <Text style={{ fontSize: 11, marginBottom: 0, color: '#2E5894', paddingTop: 86 }}>
        The application recognizes the following fruits and vegetables:
        Apple, Banana, Bell pepper, Carrot, Corn, Cucumber, Lemon, Onion, Orange, Pineapple, Pomegranate, Potato,
        Strawberries, Tomato, Watermelon.
      </Text>

    </View >

  );
}