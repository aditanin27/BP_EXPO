// src/components/AbsenItem.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StatusButton from './StatusButton';

const AbsenItem = ({ anak, onStatusChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ 
            uri: anak.foto_url || 'https://berbagipendidikan.org/images/default.png' 
          }}
          style={styles.anakPhoto}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.anakName}>{anak.nama_anak}</Text>
          {anak.nick_name && (
            <Text style={styles.anakNickname}>"{anak.nick_name}"</Text>
          )}
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <StatusButton
          status="Ya"
          isSelected={anak.status_absen === 'Ya'}
          onPress={() => onStatusChange('Ya')}
        />
        
        <StatusButton
          status="Tidak"
          isSelected={anak.status_absen === 'Tidak' || !anak.status_absen}
          onPress={() => onStatusChange('Tidak')}
        />
        
        <StatusButton
          status="Izin"
          isSelected={anak.status_absen === 'Izin'}
          onPress={() => onStatusChange('Izin')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  anakPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  anakName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  anakNickname: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AbsenItem;