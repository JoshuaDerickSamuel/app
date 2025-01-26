import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhotoUri(photo.uri);
        setModalVisible(true);
      }
      console.log(photo);
    }
  }

  async function uploadPhoto() {
      try {
        if (photoUri) {
        const response = await fetch(photoUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        console.log('Photo uploaded to Firebase');
  
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL:', downloadURL);
  
        await sendToServer(downloadURL);
        console.log('Photo sent to server');
        } else {
          throw new Error('Photo URI is null');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        Alert.alert('Error', 'Failed to upload the photo.');
      }
    }
  
    async function sendToServer(downloadURL: string) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: downloadURL,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);
  
        const response = await fetch('http://10.244.113.222:8080/predict', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const result = await response.json();
        Alert.alert('Server Response', JSON.stringify(result));
      } catch (error) {
        console.error('Error sending to server:', error);
        Alert.alert('Error', 'Failed to send the image to the server.');
      }
    }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {photoUri && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <Button title="Upload Photo" onPress={uploadPhoto} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
              
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'white',
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  previewImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
});