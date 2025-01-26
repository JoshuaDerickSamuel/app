import React from 'react';
import { View, Image, Button, StyleSheet, Alert } from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig'; // Adjust the import path as necessary

interface PhotoPreviewProps {
  route: {
    params: {
      photoUri: string;
    };
  };
  navigation: any;
}

export default function PhotoPreview({ route, navigation }: PhotoPreviewProps) {
  const { photoUri } = route.params;

  async function uploadPhoto() {
    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      console.log('Photo uploaded to Firebase');

      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);

      await sendToServer(downloadURL);
      console.log('Photo sent to server');
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
      <Image source={{ uri: photoUri }} style={styles.image} />
      <Button title="Upload Photo" onPress={uploadPhoto} />
      <Button title="Save" onPress={uploadPhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
});