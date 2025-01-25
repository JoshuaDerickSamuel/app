import { useCallback, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const ClothesRoute = () => (
  <ThemedView style={styles.tabContent}>
    <ThemedText>Your clothes will appear here</ThemedText>
  </ThemedView>
);

const OutfitsRoute = () => (
  <ThemedView style={styles.tabContent}>
    <ThemedText>Your outfits will appear here</ThemedText>
  </ThemedView>
);

const renderScene = SceneMap({
  clothes: ClothesRoute,
  outfits: OutfitsRoute,
});

export default function ClosetScreen() {
  const layout = useWindowDimensions();
  const colorScheme = useColorScheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "clothes", title: "Clothes" },
    { key: "outfits", title: "Outfits" },
  ]);

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        style={styles.tabBar}
        indicatorStyle={{
          backgroundColor: Colors[colorScheme ?? "light"].tint,
        }}
        activeColor={Colors[colorScheme ?? "light"].tint}
        inactiveColor={Colors[colorScheme ?? "light"].tabIconDefault}
        labelStyle={styles.tabLabel}
      />
    ),
    [colorScheme]
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        My Closet
      </ThemedText>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    marginTop: 60,
  },
  tabBar: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    textTransform: "none",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
