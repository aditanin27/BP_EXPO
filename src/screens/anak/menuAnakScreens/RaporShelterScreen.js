import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const RaporShelterScreen = ({ route }) => {
  const { anakName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hallo, Rapor Shelter {anakName}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RaporShelterScreen;