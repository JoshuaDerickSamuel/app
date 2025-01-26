import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BigCard from '../../components/BigCard';
import SmallCard from '../../components/SmallCard';
import OutfitDetail from '../(components)/outfitDetail'; // Import OutfitDetail
import ClothesDetail from '../(components)/clothesDetail'; // Import ClothesDetail

type Outfit = {
  id: string;
  title: string;
  caption: string;
  details: string;
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

  const placeholderOutfits: Outfit[] = [
    { id: '1', title: 'Outfit 1', caption: 'Casual', details: 'Details about Outfit 1' },
    { id: '2', title: 'Outfit 2', caption: 'Formal', details: 'Details about Outfit 2' },
    { id: '3', title: 'Outfit 3', caption: 'Sporty', details: 'Details about Outfit 3' },
  ];

  const placeholderPants: ClothingItem[] = [
    { id: '1', title: 'Pants 1', caption: 'Jeans', color: 'Blue', isColdWeather: false },
    { id: '2', title: 'Pants 2', caption: 'Chinos', color: 'Beige', isColdWeather: false },
    { id: '3', title: 'Pants 3', caption: 'Shorts', color: 'Black', isColdWeather: false },
  ];

  const placeholderShirts: ClothingItem[] = [
    { id: '1', title: 'Shirt 1', caption: 'T-Shirt', color: 'White', isColdWeather: false },
    { id: '2', title: 'Shirt 2', caption: 'Dress Shirt', color: 'Blue', isColdWeather: false },
    { id: '3', title: 'Shirt 3', caption: 'Polo', color: 'Red', isColdWeather: false },
  ];

  const placeholderHoodies: ClothingItem[] = [
    { id: '1', title: 'Hoodie 1', caption: 'Pullover', color: 'Gray', isColdWeather: true },
    { id: '2', title: 'Hoodie 2', caption: 'Zip-Up', color: 'Black', isColdWeather: true },
    { id: '3', title: 'Hoodie 3', caption: 'Sweatshirt', color: 'Navy', isColdWeather: true },
  ];

  const router = useRouter();

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
          {placeholderOutfits.map((outfit, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(outfit)}>
              <BigCard title={outfit.title} caption={outfit.caption} details={outfit.details} />
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
          {placeholderPants.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Shirts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {placeholderShirts.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <SmallCard title={item.title} caption={item.caption} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subHeaderText}>Hoodies</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.scrollContainer}
          snapToInterval={179} 
          decelerationRate="fast"
        >
          {placeholderHoodies.map((item, index) => (
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
                    details={selectedOutfit.details}
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