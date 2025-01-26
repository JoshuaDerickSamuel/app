import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface BigCardProps {
  title: string;
  caption: string;
  details: string;
  type1: string;
  color1: string;
  type2: string;
  color2: string;
}

const typeToImageMap: { [key: string]: any } = {
  pants: require('../assets/images/pants.png'),
  't-shirt': require('../assets/images/tshirt.png'),
  hoodies: require('../assets/images/hoodie.png'),
  longsleeves: require('../assets/images/long.png'),
  outerwear: require('../assets/images/hoodie.png'),
  polos: require('../assets/images/polo.png'),
  shirts: require('../assets/images/shirt.png'),
  shorts: require('../assets/images/shorts.png'),
};

const BigCard: React.FC<BigCardProps> = ({ title, caption, details, type1, color1, type2, color2 }) => {
  return (
    <View style={styles.container}>
      {/* Top Rectangle with Images */}
      <View style={styles.topRectangle}>
        <Image
          source={typeToImageMap[type2.toLowerCase()]}
          style={[styles.image, { tintColor: color2 }]}
        />
        <Image
          source={typeToImageMap[type1.toLowerCase()]}
          style={[styles.image, { tintColor: color1 }]}
        />
      </View>

      {/* Text Content */}
      <View style={styles.bottomRectangle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.typeColorText}>Type 1: {type1}, Color 1: {color1}</Text>
        <Text style={styles.typeColorText}>Type 2: {type2}, Color 2: {color2}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 15,
    width: 300,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#355c7dff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  topRectangle: {
    height: 230,
    backgroundColor: '#5d7b95ff',
    justifyContent: 'space-around', // Distribute space between images
    alignItems: 'center',
    flexDirection: 'row', // Arrange images horizontally
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bottomRectangle: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '40%', // Adjust width relative to the card
    height: '80%', // Adjust height relative to the top rectangle
    resizeMode: 'contain', // Ensure the image fits without distortion
    marginHorizontal: 5, // Add spacing between images
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  caption: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  typeColorText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default BigCard;
