import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#355c7dff', '#5d7b95ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome to</Text>
      <View style={styles.roundedRectangle}>
        <Image source={require('../assets/images/logo1.png')} style={styles.logo1} resizeMode="contain" />
        <Text style={styles.spokenWordText}>
          <Text style={styles.spokenText}>SMART</Text>
          <Text style={styles.wordText}>CLOSET</Text>
        </Text>
      </View>
      <Text style={styles.description}>
        Enhance your Bible study with personalized reading plans, audio integration, and progress tracking. Study Scripture your way, anytime, anywhere.
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/(tabs)/home')}
        >
          <Text style={styles.buttonText}>
            LOGIN <Text style={styles.semiBoldText}>HERE</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.buttonText}>
            SIGNUP <Text style={styles.semiBoldText}>HERE</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    // backgroundColor: '#121212', // Changed to new color
  },
  title: {
    fontSize: 30, // Larger font size
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
    position: 'absolute',
    top: '24%', // Move the text higher
  },
  roundedRectangle: {
    width: screenWidth * 0.8,
    height: 100,
    backgroundColor: 'white', // Changed to white
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 80, // Add spacing between the text and the title
  },
  logo1: {
    width: 60,
    height: 60,
    marginRight: 20, // Move more to the left
  },
  spokenWordText: {
    fontSize: 26,
    color: '#355c7d', // Changed to match the previous background color
  },
  spokenText: {
    fontFamily: 'OpenSans-SemiBold', // Ensure Open Sans SemiBold is used
  },
  wordText: {
    fontFamily: 'OpenSans-Light', // Ensure Open Sans Light is used
  },
  description: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans-Light', // Ensure Open Sans Light is used
    marginBottom: 24,
    paddingHorizontal: 20,
    marginTop: 80
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25, // Move to the very bottom
  },
  button: {
    backgroundColor: 'transparent', // Make background transparent
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 30, // Increase horizontal margin for more spacing
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
  },
  semiBoldText: {
    fontFamily: 'OpenSans-Bold', // Ensure Open Sans Bold is used
  },
  verticalLine: {
    width: 1,
    height: '75%',
    backgroundColor: 'white',
  },
});