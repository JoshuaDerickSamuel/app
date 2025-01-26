import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import vacationDetail from '../(components)/vacationDetail'; // Import VacationDetail
import budgetDetail from '../(components)/budgetDetail'; // Import VacationDetail


type Category = {
  title: string;
  description: string;
  image: any; 
  buttonText: string; 
};

export default function ExploreScreen() {
  const router = useRouter();

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const categories: Category[] = [
    {
      title: 'On Vacation?',
      description: 'Explore vacation outfits for a tropical getaway or a snowy ski trip.',
      image: require('../../assets/images/vacation.png'), 
      buttonText: 'Find Your New Vacation Outfit',
    },
    {
      title: 'On a Budget?',
      description: 'Make financially sound and stylish decisions with our affordable outfits.',
      image: require('../../assets/images/budget.png'), 
      buttonText: 'Explore Affordable Styles',
    },
  ];

  // State to track the current index of the visible card
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle category selection
  const handleCategoryPress = (category: string) => {
    // Check the category and navigate to the corresponding page
    if (category === 'On Vacation?') {
      router.push({
        pathname: '../(components)/vacationDetail', 
      });
    } else if (category === 'On a Budget?') {
      router.push({
        pathname: '../(components)/budgetDetail', 
      });
    }
  };

  // Render each category item in the carousel
  const renderCategory = ({ item }: { item: Category }) => (
    <View style={[styles.categoryContainer, { width: screenWidth, height: screenHeight }]}>
      <ImageBackground
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.categoryImageBackground}
        imageStyle={styles.categoryImage}
      >
        <View style={styles.textContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleCategoryPress(item.title)}
          >
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>

          {/* Dots indicating current category */}
          <View style={styles.dotsContainer}>{renderDots()}</View>
        </View>
      </ImageBackground>
    </View>
  );

  // Handle scroll event to update the current index
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / screenWidth);
    setCurrentIndex(index); // Update current index on scroll
  };

  // Render dots to indicate the current card
  const renderDots = () => {
    return categories.map((_, index) => (
      <View
        key={index}
        style={[styles.dot, index === currentIndex && styles.activeDot]} // Highlight the active dot
      />
    ));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth} // Ensures that each card snaps into place
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        pagingEnabled={true} // Ensures only one item is shown at a time
        onScroll={handleScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Ensure the content is aligned at the top
    alignItems: 'center',
    backgroundColor: '#F8F8FF',
    paddingBottom: 0, // Remove bottom padding to eliminate the space
    marginTop: 0, // Ensure no extra top margin
  },
  
  carouselContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: 160, // Align content at the bottom
  },
  categoryImageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Align text at the bottom of the image
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    resizeMode: 'cover', // Ensure the image fills the card
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 20,
    backgroundColor: '#fff', // White background for the text container
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    bottom: 0,
    width: '100%',
    height: 200, // Fixed height for consistency in card height
  },
  
  categoryTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000', // Changed text color to black
  },
  categoryDescription: {
    fontSize: 16,
    color: '#000', // Changed text color to black
    marginTop: 10,
  },
  button: {
    marginTop: 15, // Adjusted margin for the button
    paddingVertical: 16, // Increased button height
    paddingHorizontal: 30, // Increased button padding
    backgroundColor: '#0066FF',
    borderRadius: 5,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 16, // Increased button text size
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10, // Adjusted margin between dots and button
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#0066FF',
  },
});
