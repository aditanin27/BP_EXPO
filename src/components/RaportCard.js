import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const RaportCard = ({ raport, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.semester}>{raport.semester}</Text>
        <Text style={styles.tanggal}>{raport.tanggal}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Tingkat:</Text>
          <Text style={styles.infoValue}>{raport.tingkat}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Kelas:</Text>
          <Text style={styles.infoValue}>{raport.kelas}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Nilai Rata-rata:</Text>
          <Text style={styles.infoValue}>{raport.nilai_rata_rata}</Text>
        </View>
      </View>
      
      {raport.foto_rapor && raport.foto_rapor.length > 0 && (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: raport.foto_rapor[0].foto_url }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          {raport.foto_rapor.length > 1 && (
            <View style={styles.morePhotosIndicator}>
              <Text style={styles.morePhotosText}>+{raport.foto_rapor.length - 1}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  semester: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  tanggal: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  previewContainer: {
    position: 'relative',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  morePhotosIndicator: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RaportCard;