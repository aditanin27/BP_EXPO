import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HistoriCard = ({ histori, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {histori.foto_url && (
        <Image 
          source={{ uri: histori.foto_url }} 
          style={styles.cardImage} 
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {histori.nama_histori}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardSubtitle}>
            {histori.jenis_histori}
          </Text>
          <Text style={styles.cardDate}>{histori.tanggal}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default HistoriCard;