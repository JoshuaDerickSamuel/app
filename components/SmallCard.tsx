import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface SmallCardProps {
  title: string;
  caption: string;
  imageUrl: string;
}

const SmallCard: React.FC<SmallCardProps> = ({ title, caption, imageUrl }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRectangle}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingEnd: 10,
    marginVertical: 0,
    alignItems: 'center',
  },
  topRectangle: {
    width: 170,
    height: 170,
    backgroundColor: '#5d7b95ff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: 'black',
    marginTop: 7,
    textAlign: 'left',
    width: 170,
  },
  caption: {
    fontSize: 13,
    marginTop: 2,
    color: '#666',
    fontWeight: 'thin',
    textAlign: 'left',
    width: 170,
  },
});

export default SmallCard;