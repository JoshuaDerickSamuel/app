import { Link } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to the Home Page!</ThemedText>
      <ThemedText style={styles.subtitle}>
        This is your starting point.
      </ThemedText>

      <Link href="/(components)/add">
              <ThemedText type="link" style={styles.buttonText}>Add Clothes</ThemedText>
            </Link>
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
    // backgroundColor: "#0a7ea4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    // color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
