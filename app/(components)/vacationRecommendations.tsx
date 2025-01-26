import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Correct hook for accessing query params
//import { getFlightData, getWeatherData } from './flightdata';


export default function VacationRecommendation() {
  const router = useRouter();
  const { flightNumber } = useLocalSearchParams(); // Access query parameters using useLocalSearchParams

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outfit Recommendations for Flight: {flightNumber}</Text>

      {/* Display outfit suggestions as a comma-separated list */}
      <Text style={styles.weatherText}>Outfit Suggestions:</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cityText: {
    fontSize: 18,
    marginTop: 10,
  },
  weatherText: {
    fontSize: 16,
    marginTop: 10,
    color: 'gray',
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
