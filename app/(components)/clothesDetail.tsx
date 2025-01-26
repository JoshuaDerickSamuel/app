import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

type ClothesDetailProps = {
  id: string;
  title: string;
  caption: string;
  color: string;
  isColdWeather: boolean;
  onClose: () => void;
};

const ClothesDetail: React.FC<ClothesDetailProps> = ({ id, title, caption, color, isColdWeather, onClose }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
                // ...existing code...
        const docRef = doc(db, `users/${auth.currentUser?.uid}/clothes`, id);
        // ...existing code...
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImageUrl(data.imageUrl);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchImageUrl();
  }, [id]);

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      ) : (
        <Text>Loading image...</Text>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
      <Text style={styles.color}>Color: {color}</Text>
      <Text style={styles.weather}>Cold Weather: {isColdWeather ? 'Yes' : 'No'}</Text>
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Maintain the aspect ratio
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 18,
    marginVertical: 10,
  },
  color: {
    fontSize: 16,
    marginVertical: 10,
  },
  weather: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default ClothesDetail;