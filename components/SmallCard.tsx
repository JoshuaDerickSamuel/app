import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface SmallCardProps {
  title: string;
  caption: string;
  imageUrl: string;
  type: 'pants' | 't-shirt' | 'hoodies' | 'longsleeves' | 'outerwear' | 'polos' | 'shirts' | 'shorts';
  color: string;
}

const typeToImageMap: { [key in SmallCardProps['type']]: any } = {
  pants: require('../assets/images/pants.png'),
  't-shirt': require('../assets/images/tshirt.png'),
  hoodies: require('../assets/images/hoodie.png'),
  longsleeves: require('../assets/images/long.png'),
  outerwear: require('../assets/images/hoodie.png'),
  polos: require('../assets/images/polo.png'),
  shirts: require('../assets/images/shirt.png'),
  shorts: require('../assets/images/shorts.png'),
};

const SmallCard: React.FC<SmallCardProps> = ({ title, caption, imageUrl, type, color }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.rectangle]}>
        <Image style={styles.image} source={typeToImageMap[type]} tintColor={color} />
        <View style={[styles.tintOverlay, { backgroundColor: 'white', opacity: 0.1 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    paddingEnd: 10,
    paddingBottom: 5,
    marginVertical: 0,
    alignItems: 'center',
  },
  rectangle: {
    width: 170,
    height: 170,
    borderRadius: 10,
    borderWidth: 2,
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