import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, DocumentData } from "firebase/firestore";
import tinycolor from "tinycolor2";

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [clothesList, setClothesList] = useState<DocumentData[]>([]);

  const handleAddClothesPress = () => {
    router.push("/add");
  };

  const handleGeneratePress = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const clothesCollection = collection(db, `users/${user.uid}/clothes`);
        const clothesSnapshot = await getDocs(clothesCollection);
        const clothesData = clothesSnapshot.docs.map(doc => doc.data());
        setClothesList(clothesData);
        console.log(`Number of clothes documents: ${clothesData.length}`);
        console.log(clothesData);
      } else {
        console.error("No authenticated user found");
      }
    } catch (error) {
      console.error("Error fetching clothes documents:", error);
    }
  };

  const getClosestColor = (color: string) => {
    const colors = {
      red: "#FF0000",
      orange: "#FFA500",
      yellow: "#FFFF00",
      green: "#008000",
      blue: "#0000FF",
      indigo: "#4B0082",
      violet: "#EE82EE",
      white: "#FFFFFF",
      black: "#000000",
      grey: "#808080",
    };

    let closestColor = "";
    let minDistance = Infinity;

    for (const [name, hex] of Object.entries(colors)) {
      const colorRgb = tinycolor(color).toRgb();
      const hexRgb = tinycolor(hex).toRgb();
      const distance = Math.sqrt(
        Math.pow(colorRgb.r - hexRgb.r, 2) +
        Math.pow(colorRgb.g - hexRgb.g, 2) +
        Math.pow(colorRgb.b - hexRgb.b, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    }

    return closestColor;
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

      <TouchableOpacity onPress={handleGeneratePress}>
        <ThemedText type="link" style={styles.buttonText}>Generate</ThemedText>
      </TouchableOpacity>

      {/* Example of traversing the clothesList */}
      {clothesList.map((clothes, index) => {
        const closestColor = getClosestColor(clothes.color);
        return (
          <ThemedText key={index} style={[styles.clothesItem, { color: clothes.color }]}>
            Type: {clothes.type} - Closest Color: {closestColor}
          </ThemedText>
        );
      })}
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
    marginTop: 20, // Add margin to separate the buttons
  },
  clothesItem: {
    marginTop: 10,
    fontSize: 14,
  },
});