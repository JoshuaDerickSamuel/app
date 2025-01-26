import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAuth } from "firebase/auth";
import { storage, app } from '../../firebaseConfig';
import { getFirestore, collection, getDocs, DocumentData, doc, setDoc, getDoc } from "firebase/firestore";
import tinycolor from "tinycolor2";
import Swiper from "react-native-deck-swiper";
import { ref, uploadString } from "firebase/storage";

export default function HomeScreen() {
  const auth = getAuth();
  const db = getFirestore(app);
  const router = useRouter();
  const [clothesList, setClothesList] = useState<DocumentData[]>([]);
  const [combos, setCombos] = useState<DocumentData[][]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [cardsLeft, setCardsLeft] = useState(0);
  const [swiperKey, setSwiperKey] = useState(0); // Add swiperKey state
  const [swipedCardIds, setSwipedCardIds] = useState<string[]>([]);
  const [userFirstName, setUserFirstName] = useState<string>(""); // Add state for user's first name

  const handleAddClothesPress = () => {
    router.push("/add");
  };

  const logUserFirstName = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const firstName = userDoc.data().firstName;
          setUserFirstName(firstName); // Set the user's first name in state
          console.log(`User's first name: ${firstName}`);
        } else {
          console.error("User document not found");
        }
      } else {
        console.error("No authenticated user found");
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
    }
  };

  const uploadToFirebase = async (docId1: string, docId2: string, type1: string, color1: string, type2: string, color2: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log(`Current user: ${user.displayName}`); // Log the current user's name
        const comboDocRef = doc(db, `users/${user.uid}/outfits`, `${docId1}_${docId2}`);
        await setDoc(comboDocRef, { docId1, docId2, type1, color1, type2, color2 });
        console.log(`Combo document created with IDs: ${docId1}, ${docId2}, types: ${type1}, ${type2}, colors: ${color1}, ${color2}`);
      } else {
        console.error("No authenticated user found");
      }
    } catch (error) {
      console.error("Error uploading combo to Firestore:", error);
    }
  };

  // Call logUserFirstName when the component mounts
  React.useEffect(() => {
    logUserFirstName();
  }, []);

  const handleGeneratePress = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const clothesCollection = collection(db, `users/${user.uid}/clothes`);
        const clothesSnapshot = await getDocs(clothesCollection);
        let clothesData = clothesSnapshot.docs.map(doc => ({ id: doc.id, color: doc.data().color, type: doc.data().type, ...doc.data() }));

        // Shuffle the clothesData array
        clothesData = clothesData.sort(() => Math.random() - 0.5);

        setClothesList(clothesData);
        console.log(`Number of clothes documents: ${clothesData.length}`);

        // Calculate the total amount of combos
        let combos = [];
        const usedClothes = new Set();
        for (let i = 0; i < clothesData.length; i++) {
          if (usedClothes.has(i)) continue;
          for (let j = 0; j < clothesData.length; j++) {
            if (usedClothes.has(j)) continue;
            const closestColorI = getClosestColor(clothesData[i].color);
            const closestColorJ = getClosestColor(clothesData[j].color);
            const isNeutralI = isNeutralColor(closestColorI);
            const isNeutralJ = isNeutralColor(closestColorJ);

            if ((clothesData[i].type === "Pants" || clothesData[i].type === "Shorts") && 
                (clothesData[j].type === "Shirt" || clothesData[j].type === "Hoodie" || clothesData[j].type === "Longsleeve" || clothesData[j].type === "Outwear" || clothesData[j].type === "Polo" || clothesData[j].type === "T-Shirt") && 
                (isNeutralI || isNeutralJ)) {
              combos.push([clothesData[i], clothesData[j]]);
              usedClothes.add(i);
              usedClothes.add(j);
              console.log(`Match found: ${clothesData[i].type} (${clothesData[i].color}, ${closestColorI} ${isNeutralI ? "neutral" : ""}) and ${clothesData[j].type} (${clothesData[j].color}, ${closestColorJ} ${isNeutralJ ? "neutral" : ""})`);
              console.log(""); // Print an empty line
              break; // Move to the next bottom cloth after finding a match
            }
          }
        }
        setCombos(combos);
        setComboCount(combos.length);
        setCardsLeft(combos.length);
        console.log(`Total amount of combos: ${combos.length}`);
        // Reinitialize Swiper props
        setSwiperKey(swiperKey + 1);
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
      tan: "#D2B48C",
      nude: "#F5CBA7",
      lightBrown: "#A52A2A",
      lightGray: "#D3D3D3",
      darkBlue: "#00008B",
      creme: "#FFFDD0",
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

  const isNeutralColor = (color: string) => {
    const neutralColors = ["black", "grey", "tan", "nude", "lightBrown", "lightGray", "darkBlue", "creme"];
    return neutralColors.includes(color);
  };

  const { width, height } = Dimensions.get("window");
  const typeToImageMap: { [key: string]: any } = {
    pants: require('../../assets/images/pants.png'),
    't-shirt': require('../../assets/images/tshirt.png'),
    hoodies: require('../../assets/images/hoodie.png'),
    longsleeves: require('../../assets/images/long.png'),
    outerwear: require('../../assets/images/hoodie.png'),
    polos: require('../../assets/images/polo.png'),
    shirts: require('../../assets/images/shirt.png'),
    shorts: require('../../assets/images/shorts.png'),
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.circleContainer}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
        <View style={styles.welcomeContainer}>
          <ThemedText style={styles.welcomeText}>Welcome Back, {userFirstName}</ThemedText> {/* Wrap welcome text in ThemedText */}
        </View>
        <View style={styles.swiperWrapper}>
          <Swiper
            key={swiperKey} // Use swiperKey to force re-render
            cards={combos.length > 0 ? combos : [[{ type: "No combo available", color: "" }]]} // Default card if no combos
            renderCard={(combo) => (
              <View style={[styles.card, { width: width * 0.8, height: height * 0.6 }]}>
                {/* {combo[0] && combo[1] ? (

                  <ThemedText style={styles.cardText}>
                    {combo[0].type} ({combo[0].color}) and {combo[1].type} ({combo[1].color})
                  </ThemedText>
                  
                   
                ) : (
                  <ThemedText style={styles.cardText}>{combo[0]?.type || "No combo available"}</ThemedText>
                )} */}
                {combo[0] && combo[1] && (
                  <>
                  <Image style={{width: 200,height:200}} tintColor={combo[1].color} source={typeToImageMap[combo[1].type.toLowerCase()]} />
                  <Image style={{width: 200,height:200}} tintColor={combo[0].color} source={typeToImageMap[combo[0].type.toLowerCase()]} />
                  </>
                )}
                {/* <Image style={{width: 200,height:200}} tintColor={combo[1].color} source={typeToImageMap[combo[1].type.toLowerCase()]} />
                <Image style={{width: 200,height:200}} tintColor={combo[0].color} source={typeToImageMap[combo[0].type.toLowerCase()]} /> */}
              </View>
            )}
            stackSize={3}
            backgroundColor="F8F8FF"
            cardIndex={0}
            showSecondCard={true}
            disableTopSwipe
            disableBottomSwipe
            disableLeftSwipe={cardsLeft <= 1} // Disable left swipe if only one card
            disableRightSwipe={cardsLeft <= 1} // Disable right swipe if only one card
            containerStyle={styles.swiperContainer}
            onSwiped={(cardIndex) => {
              const remainingCards = combos.length - cardIndex - 1;
              setCardsLeft(remainingCards);
              const swipedCardId1 = combos[cardIndex][0].id; // Use the document name as the ID
              const swipedCardId2 = combos[cardIndex][1].id;
              const type1 = combos[cardIndex][0].type;
              const color1 = combos[cardIndex][0].color;
              const type2 = combos[cardIndex][1].type;
              const color2 = combos[cardIndex][1].color; // Use the document name as the ID
              setSwipedCardIds([...swipedCardIds, swipedCardId1, swipedCardId2]);
              console.log(`Swiped card IDs: ${swipedCardId1}, ${swipedCardId2}`);
            }}
            onSwipedLeft={(cardIndex) => {
              console.log(`Card ${cardIndex} swiped left`);
            }}
            onSwipedRight={async (cardIndex) => {
              console.log(`Card ${cardIndex} swiped right`);
              const swipedCard = combos[cardIndex];
              const swipedCardId1 = swipedCard[0].id;
              const swipedCardId2 = swipedCard[1].id;
              const type1 = swipedCard[0].type;
              const color1 = swipedCard[0].color;
              const type2 = swipedCard[1].type;
              const color2 = swipedCard[1].color;
              await uploadToFirebase(swipedCardId1, swipedCardId2, type1, color1, type2, color2);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={handleAddClothesPress}>
              <ThemedText style={styles.buttonText}>Add Clothes</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={handleGeneratePress}>
              <ThemedText style={styles.buttonText}>Generate</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "F8F8FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
 
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff", // Change text color to white
    textAlign: "center", // Center text horizontally
  },
  clothesItem: {
    marginTop: 0,
    fontSize: 14,
  },
  comboCount: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  swiperWrapper: {
    flex: 1,
    maxHeight: "80%",
    width: '100%',
    justifyContent: 'center', // Center the swiper vertically
    alignItems: 'center',
    backgroundColor: "F8F8FF",
    marginLeft: 40,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D3D3D3", // Change background color to light gray
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    padding: 20,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center', // Center the swiper vertically
    alignItems: 'center', // Center the swiper horizontally
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: -10,
    zIndex: 1, // Ensure buttons are above the swiper
    
  },
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#355c7dff", // Add background color
    paddingVertical: 10,
    height: 50, // Set a fixed height for the buttons
    width: 150, // Set a fixed width for the buttons
    borderRadius: 10, // Add border radius
    alignItems: "center",
    justifyContent: "center", // Center text vertically
    marginBottom: 20,
  },
  welcomeContainer: {
    marginBottom: -50,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#F8F8FF", // Set text color to black
  },
  circleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1, // Ensure circles are behind all other elements
  },
  circle1: {
    position: "absolute",
    width: 700,
    height: 700,
    borderRadius: 250,
    backgroundColor: "#355c7dff",
    top: -250,
    left: -250,
  },
  circle2: {
    position: "absolute",
    width: 0,
    height: 0,
    borderRadius: 200,
    backgroundColor: "#6c5b7bff",
    bottom: -200,
    right: -200,
  },
});