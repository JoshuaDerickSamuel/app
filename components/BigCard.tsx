import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BigCardProps {
  title: string;
  caption: string;
  details: string;
}

const BigCard: React.FC<BigCardProps> = ({ title, caption, details }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.details}>{details}</Text>
      <View style={styles.topRectangle} />
      <View style={styles.bottomRectangle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
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
  details: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 8,
    fontFamily: 'Open Sans', // Ensure Open Sans font is used
  },
});

export default BigCard;
