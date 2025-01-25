import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, auth } from '../../firebaseConfig'; // Ensure Firebase is initialized
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const db = getFirestore(app);

export default function SignUp() {
  const router = useRouter();
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Parse the full name
    const nameParts = fullName.trim().split(' ');
    let firstName = '';
    let lastName = '';

    if (nameParts.length === 2) {
      [firstName, lastName] = nameParts;
    } else if (nameParts.length >= 3) {
      firstName = nameParts[0];
      lastName = nameParts[nameParts.length - 1];
    } else {
      Alert.alert('Error', 'Please enter at least a first and last name');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Push data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        password
      });

      router.replace('/(tabs)/home'); // Changed from push to replace
    } catch (error) {
      Alert.alert('Sign Up Error');
    }
  };

  const handleLoginPress = () => {
    const routes = navigation.getState()?.routes || [];
    const hasLogin = routes.some(route => route.name === 'login');
    
    if (hasLogin) {
      router.back();
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: '#F8F8FF' }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="never" // Prevent touch interaction with keyboard visible
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.circleContainer}>
          <View style={styles.circle} />
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill in the form to continue</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#333333" style={styles.iconStyle} />
          <TextInput
            style={styles.inputStyle}
            placeholder="Full Name"
            placeholderTextColor="#333333"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
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
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#333333" style={styles.iconStyle} />
          <TextInput
            style={styles.inputStyle}
            placeholder="Confirm Password"
            placeholderTextColor="#333333"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLoginPress}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#355c7dff',
    position: 'absolute',
    top: -450, // Moved higher
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
  button: {
    backgroundColor: '#355c7d', // Match theme color
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 20, // Rounded corners
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
});
