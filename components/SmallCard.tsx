import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SmallCardProps {
  title: string;
  caption: string;
  imageUrl: string;
  type: 'pants' | 't-shirt' | 'hoodies' | 'longsleeves' | 'outerwear' | 'polos' | 'shirts' | 'shorts';
  color: string;
}

const SmallCard: React.FC<SmallCardProps> = ({ title, caption, imageUrl, type, color }) => {
  return (
    <View style={styles.container}>
      {type === 'pants' ? (
        <View style={styles.pantRectangle}>
              <Image style={{height: 150, width: 200, alignItems:'center'}} source={require('../assets/images/pants.png')} tintColor={color} />
        </View>
      ) : (
        <View style={[styles.topRectangle, { backgroundColor: color }]}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingEnd: 10,
    paddingBottom: 5, // Reduced bottom padding
    marginVertical: 0,
    alignItems: 'center',
  },
  topRectangle: {
    width: 170,
    height: 170,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pantRectangle: {
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
  type: {
    fontSize: 13,
    marginTop: 2,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'left',
    width: 170,
  },
});

export default SmallCard;