import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, sendPasswordResetEmail } from 'firebase/auth'; // Import GoogleAuthProvider, signInWithCredential, and sendPasswordResetEmail
import { app, auth } from '../../firebaseConfig'; // Ensure Firebase is initialized
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import * as Google from 'expo-auth-session/providers/google'; // Import Google from expo-auth-session
import * as AuthSession from 'expo-auth-session'; // Import AuthSession from expo-auth-session
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import KeyboardAwareScrollView

export default function Login() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Login Error', 'Invalid email or password');
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot');
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: '846245652608-0tmh35shs7l8s19rvcuk8betfc8q0r05.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({
      
    }) // Use Expo's proxy
  });
  
  
  
    React.useEffect(() => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            router.replace('/(tabs)/home');
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('Google Login Error', errorMessage);
          });
      }
    }, [response]);
  
    const handleGoogleLogin = () => {
      promptAsync();
    };

  const handleSignupPress = () => {
    const routes = navigation.getState()?.routes || [];
    const hasSignin = routes.some(route => route.name === 'signup');
    
    if (hasSignin) {
      router.back();
    } else {
      router.push('/(auth)/signup');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: '#F8F8FF' }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="never"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.circleContainer}>
          <View style={styles.circle} />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="mail" size={24} color="#333333" style={styles.iconStyle} />
          <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            placeholderTextColor="#333333"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#333333" style={styles.iconStyle} />
          <TextInput
            style={styles.inputStyle}
            placeholder="Password"
            placeholderTextColor="#333333"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../../assets/images/apple.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSignupPress}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    paddingTop: 86, // Added padding to move elements down
    backgroundColor: '#F8F8FF', // Changed to true white
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  circle: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#355c7dff',
    top: -450,
    right: -265,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 8,
    textAlign: 'left',
    fontFamily: 'OpenSans-Bold', // Ensure Open Sans Bold is used
    paddingStart: 8
  },
  subtitle: {
    fontSize: 16,
    paddingStart: 8,
    color: 'grey',
    textAlign: 'left',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 16, // Increased margin
    backgroundColor: 'F8F8FF', // Changed to true white
    borderRadius: 20, // Rounded corners
    borderWidth: 1, // Add outline
    borderColor: '#333333', // Outline color
  },
  iconStyle: {
    padding: 12,
    paddingEnd: 0 // Add padding around the icon
  },
  inputStyle: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F8F8FF', // Changed to true white
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
    borderRadius: 20, // Rounded corners
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 12, // Decreased margin
  },
  button: {
    backgroundColor: '#355c7d', // Match theme color
    padding: 10,
    alignItems: 'center',
    borderRadius: 20, // Rounded corners
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
  },
  linkText: {
    color: '#355c7d', // Match theme color
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
  },
  forgotText: {
    color: '#355c7d', // Match theme color
    padding: 12,
    paddingStart: 0,
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18, // Decreased margin
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  orText: {
    marginHorizontal: 8,
    color: '#333333',
    fontFamily: 'OpenSans-Regular', // Ensure Open Sans Regular is used
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 9,
    marginBottom: 20,
    paddingHorizontal: 50, // Added padding to bring buttons closer
  },
  socialButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8F8FF', // Match background color
    borderWidth: 1,
    borderColor: '#333333', // Outline color
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});
