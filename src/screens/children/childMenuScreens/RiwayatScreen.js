import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const RiwayatScreen = ({ route }) => {
  const { childName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hallo, Riwayat {childName}</Text>
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

export default RiwayatScreen;