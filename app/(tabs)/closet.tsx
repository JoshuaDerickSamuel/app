import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import BigCard from '../../components/BigCard';
import SmallCard from '../../components/SmallCard';
import OutfitDetail from '../(components)/outfitDetail'; // Import OutfitDetail
import ClothesDetail from '../(components)/clothesDetail'; // Import ClothesDetail
import { getAuth} from 'firebase/auth';
type Outfit = {
  id: string;
  title: string;
  caption: string;
  details: string;
  color: string;
  isColdWeather: boolean;
};

type ClothingItem = {
  id: string;
  title: string;
  caption: string;
  color: string;
  isColdWeather: boolean;
};

export default function HomeScreen() {
  const [firstName, setFirstName] = useState('User');
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [selectedClothingItem, setSelectedClothingItem] = useState<ClothingItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);       
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // const outfitsSnapshot = await getDocs(collection(db, 'outfits'));
      const user = auth.currentUser;
      if (user) {
      const clothesSnapshot = await getDocs(collection(db, `users/${user.uid}/clothes`));
      console.log(clothesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClothingItem)));
      // setOutfits(outfitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Outfit)));
      setClothes(clothesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClothingItem)));
      } else {
        console.error('User is not authenticated');
      }
    };

    fetchData();
  }, []);

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
          {outfits.map((outfit, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(outfit)}>
              <BigCard title={outfit.title} caption={outfit.caption} details={outfit.details} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Clothes</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {clothes.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} />
            </TouchableOpacity>
          ))}
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
});