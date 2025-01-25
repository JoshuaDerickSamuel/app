import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import { useRouter } from 'expo-router';
import BigCard from '../../components/BigCard';
import SmallCard from '../../components/SmallCard'; // Import SmallCard

type Plan = {
  id: string;
  title: string;
  caption: string;
  details: string;
  days: number;
};

export default function HomeScreen() {
  const [firstName, setFirstName] = useState('User');
  const placeholderPlans: Plan[] = [
    { id: '1', title: 'Plan 1', caption: 'Caption 1', details: 'Details 1', days: 7 },
    { id: '2', title: 'Plan 2', caption: 'Caption 2', details: 'Details 2', days: 14 },
    { id: '3', title: 'Plan 3', caption: 'Caption 3', details: 'Details 3', days: 21 },
  ];

  const router = useRouter();

  const handleCardPress = (plan: Plan) => {
    router.push({
      pathname: '../(components)/[plan].tsx',
      params: { id: plan.id, title: plan.title, days: plan.days },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.verticalScrollContainer}>
        <View style={styles.extra}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{firstName}'s Closet</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={20} color="#333333" />
            </View>
          </View>
        </View>
        <Text style={styles.firstSubHeaderText}>Outfits</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={300} 
          decelerationRate="fast"
        >
          {placeholderPlans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <BigCard title={plan.title} caption={plan.caption} details={plan.details} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Pants</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} // Adjust snapToInterval for SmallCard
          decelerationRate="fast"
        >
          {placeholderPlans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <SmallCard title={plan.title} caption={plan.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Shirts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} // Adjust snapToInterval for SmallCard
          decelerationRate="fast"
        >
          {placeholderPlans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <SmallCard title={plan.title} caption={plan.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Hoodies</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} // Adjust snapToInterval for SmallCard
          decelerationRate="fast"
        >
          {placeholderPlans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <SmallCard title={plan.title} caption={plan.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? (StatusBar.currentHeight || 20) : 16,
    backgroundColor: '#F8F8FF', // Changed to new color
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 65, // Add margin to move elements lower
    paddingHorizontal: 5, // Add padding to move elements inward
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8, // Moved higher
    alignSelf: 'flex-start',
    fontFamily: 'OpenSans-Bold', // Ensure Open Sans Bold is used
  },
  firstSubHeaderText: {
    fontSize: 22,
    color: '#333333',
    fontFamily: 'OpenSans-Bold', // Ensure Open Sans Regular is used
    marginTop: 18, // Move subheader lower
    paddingHorizontal: 21, // Add padding to move elements inward
  },
  subHeaderText: {
    fontSize: 22,
    color: '#333333',
    fontFamily: 'OpenSans-Bold', // Ensure Open Sans Regular is used
    marginTop: 5, // Move subheader lower
    marginBottom: 5, // Move subheader lower
    paddingHorizontal: 21, // Add padding to move elements inward
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  scrollContainer: {
    paddingStart: 21, // Add padding to move elements inward
    width: '100%', // Make the scroll container go from edge to edge
    marginBottom: 20, // Add margin to create space between horizontal scroll views
  },
  extra: {
    paddingHorizontal: 16,
  },
  verticalScrollContainer: {
    width: '100%',
    height: '100%',
  },
  spacer: {
    height: 70, // Spacer height
  },
});