import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/Button"; // Import the Button component

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to the Landing Page!</ThemedText>
      <ThemedText style={styles.subtitle}>
        This is your starting point.
      </ThemedText>

      {/* <TouchableOpacity
        style={[styles.button, styles.buttonContainer]}
        onPress={() => router.push("/(components)/add")}
      > */}
      <Link href="/(components)/add">
        <ThemedText style={styles.buttonText}>Add Clothes</ThemedText>
        </Link>
      {/* </TouchableOpacity> */}

      {/* <Button title="Add Clothes" onPress={() => router.push("/(components)/add")} /> */}
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
  button: {
    width: "50%",
  },
  buttonContainer: {
    backgroundColor: "#0a7ea4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
