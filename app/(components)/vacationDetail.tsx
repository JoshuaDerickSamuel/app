import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function VacationDetail() {
  const [flightNumber, setFlightNumber] = useState('');
  const router = useRouter(); // Initialize router for navigation

  const handleSearch = () => {
    if (flightNumber) {
      // Navigate to vacation-recommendation page with the flight number as a query parameter
      router.push('./(components)/vacationRecommendation?flightNumber=${flightNumber}');
    } else {
      alert('Please enter a flight number');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/plane.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Find trip</Text>
        </View>

        <TextInput
          style={styles.searchBox}
          placeholder="Input flight number"
          placeholderTextColor="#333"
          keyboardType="default"
          value={flightNumber}
          onChangeText={setFlightNumber}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBox: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
