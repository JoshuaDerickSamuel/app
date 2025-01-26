import React from 'react';
import { Text, StyleSheet } from 'react-native';

// outfits detail
export const OutfitDetail = () => {
  return (
    <Text style={styles.firstSubHeaderText}>Outfit Detail</Text>
  );
};

const styles = StyleSheet.create({
  firstSubHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default OutfitDetail;