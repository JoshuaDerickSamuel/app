import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

type OutfitDetailProps = {
  id: string;
  title: string;
  caption: string;
  details: string;
  color: string;
  isColdWeather: boolean;
  onClose: () => void;
};

const OutfitDetail: React.FC<OutfitDetailProps> = ({ id, title, caption, details, color, isColdWeather, onClose }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
      <Text style={styles.details}>{details}</Text>
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
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 18,
    marginVertical: 10,
  },
  details: {
    fontSize: 16,
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

export default OutfitDetail;