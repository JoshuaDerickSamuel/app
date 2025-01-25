// import { useCallback, useState } from "react";
// import { StyleSheet, useWindowDimensions } from "react-native";
// import { SceneMap, TabBar, TabView } from "react-native-tab-view";

// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { Colors } from "@/constants/Colors";
// import { useColorScheme } from "@/hooks/useColorScheme";

// const ClothesRoute = () => (
//   <ThemedView style={styles.tabContent}>
//     <ThemedText>Your clothes will appear here</ThemedText>
//   </ThemedView>
// );

// const OutfitsRoute = () => (
//   <ThemedView style={styles.tabContent}>
//     <ThemedText>Your outfits will appear here</ThemedText>
//   </ThemedView>
// );

// const renderScene = SceneMap({
//   clothes: ClothesRoute,
//   outfits: OutfitsRoute,
// });

// export default function ClosetScreen() {
//   const layout = useWindowDimensions();
//   const colorScheme = useColorScheme();
//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     { key: "clothes", title: "Clothes" },
//     { key: "outfits", title: "Outfits" },
//   ]);

//   const renderTabBar = useCallback(
//     (props: any) => (
//       <TabBar
//         {...props}
//         style={styles.tabBar}
//         indicatorStyle={{
//           backgroundColor: Colors[colorScheme ?? "light"].tint,
//         }}
//         activeColor={Colors[colorScheme ?? "light"].tint}
//         inactiveColor={Colors[colorScheme ?? "light"].tabIconDefault}
//         labelStyle={styles.tabLabel}
//       />
//     ),
//     [colorScheme]
//   );

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText type="title" style={styles.title}>
//         My Closet
//       </ThemedText>

//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={{ width: layout.width }}
//         renderTabBar={renderTabBar}
//         style={styles.tabView}
//       />
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     marginBottom: 24,
//     marginTop: 60,
//   },
//   tabBar: {
//     backgroundColor: "transparent",
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   tabLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     textTransform: "none",
//   },
//   tabView: {
//     flex: 1,
//   },
//   tabContent: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import { useRouter } from 'expo-router';
import BigCard from '../../components/BigCard';
import SmallCard from '../../components/SmallCard'; // Import SmallCard
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore

type Plan = {
  id: string;
  title: string;
  caption: string;
  details: string;
  days: number;
};

export default function HomeScreen() {
  const [firstName, setFirstName] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFirstName(docSnap.data().firstName);
        } else {
          console.log('No such document!');
        }
      }
    };

    const fetchPlans = async () => {
      const plansRef = collection(db, 'plans');
      const q = query(plansRef, where('tag', '==', 'For You'));
      const querySnapshot = await getDocs(q);
      const fetchedPlans: Plan[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlans.push({ id: doc.id, ...doc.data() } as Plan);
      });
      setPlans(fetchedPlans);
    };

    fetchUserName();
    fetchPlans();
  }, [auth, db]);

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
            <Text style={styles.headerText}>Hi, {firstName}</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={20} color="#333333" />
            </View>
          </View>
        </View>
        <Text style={styles.firstSubHeaderText}>For You</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={300} 
          decelerationRate="fast"
        >
          {plans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <BigCard title={plan.title} caption={plan.caption} details={plan.details} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>More for You</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} // Adjust snapToInterval for SmallCard
          decelerationRate="fast"
        >
          {plans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <SmallCard title={plan.title} caption={plan.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Even More</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} // Adjust snapToInterval for SmallCard
          decelerationRate="fast"
        >
          {plans.map((plan, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(plan)}>
              <SmallCard title={plan.title} caption={plan.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Don't Miss</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} // Adjust snapToInterval for SmallCard
          decelerationRate="fast"
        >
          {plans.map((plan, index) => (
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
