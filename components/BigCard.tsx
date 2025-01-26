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
      <View style={styles.topRectangle} />
      <Image source={typeToImageMap[type1.toLowerCase()]} style={{ width: 300, height: 320 }} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.typeColorText}>Type 1: {type1}, Color 1: {color1}</Text>
        <Text style={styles.typeColorText}>Type 2: {type2}, Color 2: {color2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingEnd: 10, // Add padding to move elements inward
    marginVertical: 0,
    width: 300
  },
  topRectangle: {
    height:230,
    backgroundColor: '#5d7b95ff', // Change background color of the top rectangle
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 4
  },
  bottomRectangle: {
    height: 90,
    padding: 10,
    backgroundColor: '#355c7dff', // Change background color of the bottom rectangle
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 0, // Remove gap between rectangles
    alignItems: 'center', // Center the text horizontally
    justifyContent: 'center', // Center the text vertically
  },
  title: {
    fontSize: 16,
    color: '#FFFFFF', // Change text color to white
    marginBottom: 0,
    fontWeight: '600', // Ensure the caption text is thin
    fontFamily: 'Open Sans', // Ensure Open Sans font is used
    textAlign: 'center', // Center align the text
  },
  caption: {
    fontSize: 15,
    color: '#FFFFFF', // Change text color to white
    marginBottom: 10,
    fontWeight: '100', // Ensure the caption text is thin
    fontFamily: 'Open Sans', // Ensure Open Sans font is used
    textAlign: 'center', // Center align the text
  },
  typeColorText: {
    fontSize: 14,
    color: '#FFFFFF', // Change text color to white
    fontFamily: 'Open Sans', // Ensure Open Sans font is used
    textAlign: 'center', // Center align the text
  },
});

export default BigCard;