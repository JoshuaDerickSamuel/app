import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const router = useRouter();

  const handleAddClothesPress = () => {
    router.push("/add");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to the Home Page!</ThemedText>
      <ThemedText style={styles.subtitle}>
        This is your starting point.
      </ThemedText>

      <TouchableOpacity onPress={handleAddClothesPress}>
        <ThemedText type="link" style={styles.buttonText}>Add Clothes</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});