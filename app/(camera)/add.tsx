import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { storage, app } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const auth = getAuth();
  const db = getFirestore(app);

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
    if (photoUri) {
      setUploading(true);  // Set uploading state to true
      try {
        const response = await fetch(photoUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        console.log('Photo uploaded to Firebase');

        // Retrieve the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL:', downloadURL);

        // Send the image to your server using the download URL
        const serverResponse = await sendToServer(downloadURL);

        // Log the color in the console
        console.log('Dominant Color:', serverResponse.dominant_color.color_code);

        // Add a new document to Cloud Firestore
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, `users/${user.uid}/clothes`), {
            color: serverResponse.dominant_color.color_code, // Use the hex color code from the server response
            type: serverResponse.label, // Use the type from the server response
            img_ref: downloadURL,
          });
          console.log('Document added to Firestore');
        } else {
          console.error('No authenticated user found');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        Alert.alert('Error', 'Failed to upload the photo.');
      } finally {
        setUploading(false);  // Reset the uploading state
      }
    }
  }

  async function sendToServer(downloadURL: string) {
    try {
      const formData = new FormData();
      // Bypass TypeScript error by casting to 'any'
      formData.append('file', {
        uri: downloadURL,
        type: 'image/jpeg', // Adjust MIME type if needed
        name: 'photo.jpg',
      } as any);  // Typecasting to 'any' to bypass TypeScript error

      const response = await fetch('http://10.245.160.14:8080/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      Alert.alert('Server Response', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Error sending to server:', error);
      Alert.alert('Error', 'Failed to send the image to the server.');
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      {!photoUri && (
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
      )}
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
            <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto}>
              <Text style={styles.buttonText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
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
    width: 300, // Increase the width
    height: 300, // Increase the height
    borderRadius: 20, // Add rounded corners
    marginBottom: 20, // Add some margin at the bottom
  },
  uploadButton: {
    backgroundColor: '#4CAF50', // Green background
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#f44336', // Red background
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});