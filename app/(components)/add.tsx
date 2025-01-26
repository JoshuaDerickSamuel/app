import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { storage, app } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

        // Add a new document to Cloud Firestore
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, `users/${user.uid}/clothes`), {
            color: 'red', // Replace with actual color detection logic
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

      const response = await fetch('http://10.244.113.222:8080/predict', {
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
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          {photoUri && (
            <TouchableOpacity style={styles.button} onPress={uploadPhoto} disabled={uploading}>
              <Text style={styles.text}>{uploading ? 'Uploading...' : 'Upload Photo'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});