import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SuratCard = ({ surat, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {surat.foto_url && (
        <Image 
          source={{ uri: surat.foto_url }} 
          style={styles.cardImage} 
          resizeMode="cover"
        />
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardDetails}>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {surat.pesan}
          </Text>
          <Text style={styles.cardDate}>{surat.tanggal}</Text>
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
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default SuratCard;