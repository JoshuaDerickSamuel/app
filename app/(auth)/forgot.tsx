import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendResetEmail = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Password Reset", "Password reset link sent to your email");
        router.back();
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email to reset your password
      </Text>
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="mail"
          size={24}
          color="#333333"
          style={styles.iconStyle}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder=" Email"
          placeholderTextColor="#333333"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSendResetEmail}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    paddingTop: 86,
    backgroundColor: "#F8F8FF",
  },
  circle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#355c7dff",
    top: -50,
    right: -150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: "#333333",
    marginBottom: 8,
    textAlign: "left",
    fontFamily: "OpenSans-Bold",
    paddingStart: 8,
  },
  subtitle: {
    fontSize: 16,
    paddingStart: 8,
    color: "grey",
    textAlign: "left",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 16,
    backgroundColor: "F8F8FF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  iconStyle: {
    padding: 12,
    paddingEnd: 0,
  },
  inputStyle: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontFamily: "OpenSans-Regular",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#355c7d",
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenSans-Regular",
  },
  linkText: {
    color: "#355c7d",
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
  },
});
