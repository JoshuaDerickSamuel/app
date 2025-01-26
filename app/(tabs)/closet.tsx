import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, RefreshControl, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import BigCard from '../../components/BigCard';
import SmallCard from '../../components/SmallCard';
import OutfitDetail from '../(components)/outfitDetail'; // Import OutfitDetail
import ClothesDetail from '../(components)/clothesDetail'; // Import ClothesDetail
import { getAuth } from 'firebase/auth';

type Outfit = {
  id: string;
  title: string;
  caption: string;
  details: string;
  color: string;
  isColdWeather: boolean;
  imageUrl: string; // Add imageUrl property
};

type ClothingItem = {
  id: string;
  title: string;
  caption: string;
  color: string;
  isColdWeather: boolean;
  imageUrl: string; // Add imageUrl property
  type: string; // Add type property
};

export default function HomeScreen() {
  const [firstName, setFirstName] = useState('User');
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [selectedClothingItem, setSelectedClothingItem] = useState<ClothingItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [pants, setPants] = useState<ClothingItem[]>([]);
  const [tShirts, setTShirts] = useState<ClothingItem[]>([]);
  const [hoodies, setHoodies] = useState<ClothingItem[]>([]);
  const [longSleeves, setLongSleeves] = useState<ClothingItem[]>([]);
  const [outwear, setOutwear] = useState<ClothingItem[]>([]);
  const [polos, setPolos] = useState<ClothingItem[]>([]);
  const [shirts, setShirts] = useState<ClothingItem[]>([]);
  const [shorts, setShorts] = useState<ClothingItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  const fetchData = async () => {
    const user = auth.currentUser;
    if (user) {
      const pantsQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Pants"));
      const pantsSnapshot = await getDocs(pantsQuery);
      
      const tShirtsQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "T-Shirt"));
      const tShirtsSnapshot = await getDocs(tShirtsQuery);
      
      const hoodiesQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Hoodie"));
      const hoodiesSnapshot = await getDocs(hoodiesQuery);
      
      const outfitsQuery = query(collection(db, `users/${user.uid}/outfits`));
      const outfitsSnapshot = await getDocs(outfitsQuery);
      
      const longSleeveQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Longsleeve"));
      const longSleeveSnapshot = await getDocs(longSleeveQuery);
      
      const outwearQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Outwear"));
      const outwearSnapshot = await getDocs(outwearQuery);
      
      const poloQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Polo"));
      const poloSnapshot = await getDocs(poloQuery);
      
      const shirtQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Shirt"));
      const shirtSnapshot = await getDocs(shirtQuery);
      
      const shortsQuery = query(collection(db, `users/${user.uid}/clothes`), where("type", "==", "Shorts"));
      const shortsSnapshot = await getDocs(shortsQuery);
      
      setPants(pantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setTShirts(tShirtsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setHoodies(hoodiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setOutfits(outfitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as Outfit)));
      setLongSleeves(longSleeveSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setOutwear(outwearSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setPolos(poloSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setShirts(shirtSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
      setShorts(shortsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), imageUrl: doc.data().imageUrl } as ClothingItem)));
    } else {
      console.error('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCardPress = (item: Outfit | ClothingItem) => {
    if ('details' in item) {
      setSelectedOutfit(item);
    } else {
      setSelectedClothingItem(item);
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOutfit(null);
    setSelectedClothingItem(null);
  };

  const handleAddPress = () => {
    router.push('/add');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.verticalScrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          {outfits.map((outfit, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(outfit)}>
              <BigCard title={outfit.title} caption={outfit.caption} details={outfit.details}/>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Pants</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {pants.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="pants" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>T-Shirts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {tShirts.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="t-shirt" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>Hoodies</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {hoodies.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="hoodies" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>Long Sleeves</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {longSleeves.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="longsleeves" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>Outwear</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {outwear.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="outerwear" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>Polos</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {polos.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="polos" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>Shirts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {shirts.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="shirts" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Text style={styles.subHeaderText}>Shorts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {shorts.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} imageUrl={item.imageUrl} type="shorts" color={item.color} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleAddPress}>
            <View style={styles.addCard}>
              <MaterialIcons name="add" size={24} color="#333333" />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.spacer} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedOutfit && (
                  <OutfitDetail
                    id={selectedOutfit.id}
                    title={selectedOutfit.title}
                    caption={selectedOutfit.caption}
                    details={selectedOutfit.details}
                    color={selectedOutfit.color}
                    isColdWeather={selectedOutfit.isColdWeather}
                    onClose={closeModal}
                  />
                )}
                {selectedClothingItem && (
                  <ClothesDetail
                    id={selectedClothingItem.id}
                    title={selectedClothingItem.title}
                    caption={selectedClothingItem.caption}
                    color={selectedClothingItem.color}
                    isColdWeather={selectedClothingItem.isColdWeather}
                    imageUrl={selectedClothingItem.imageUrl} // Pass imageUrl as a prop
                    onClose={closeModal}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? (StatusBar.currentHeight || 20) : 16,
    backgroundColor: '#F8F8FF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 65,
    paddingHorizontal: 5,
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    alignSelf: 'flex-start',
    fontFamily: 'OpenSans-Bold',
  },
  firstSubHeaderText: {
    fontSize: 22,
    color: '#333333',
    fontFamily: 'OpenSans-Bold',
    marginTop: 18,
    paddingHorizontal: 21,
  },
  subHeaderText: {
    fontSize: 22,
    color: '#333333',
    fontFamily: 'OpenSans-Bold',
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 21,
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
    paddingStart: 21,
    width: '100%',
    marginBottom: 20,
  },
  extra: {
    paddingHorizontal: 16,
  },
  verticalScrollContainer: {
    width: '100%',
    height: '100%',
  },
  spacer: {
    height: 70,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  addCard: {
    alignItems: 'center',
    width: 170,
    height: 170,
    borderColor: '#333333',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 48,
    color: '#333333',
  },
});