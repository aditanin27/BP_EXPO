import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AbsenItem = ({ anak, onStatusChange }) => {
  // Generate status buttons based on current status
  const renderStatusButtons = () => {
    const statuses = ['Ya', 'Tidak', 'Izin'];
    
    return statuses.map(status => (
      <TouchableOpacity
        key={status}
        style={[
          styles.statusButton,
          anak.status_absen === status && getStatusStyle(status).button
        ]}
        onPress={() => onStatusChange(status)}
      >
        <Text 
          style={[
            styles.statusButtonText,
            anak.status_absen === status && getStatusStyle(status).text
          ]}
        >
          {getStatusLabel(status)}
        </Text>
      </TouchableOpacity>
    ));
  };
  
  // Get style for status button
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ya':
        return { 
          button: styles.presentButton,
          text: styles.presentText
        };
      case 'Tidak':
        return { 
          button: styles.absentButton,
          text: styles.absentText
        };
      case 'Izin':
        return { 
          button: styles.permissionButton,
          text: styles.permissionText
        };
      default:
        return { 
          button: {},
          text: {}
        };
    }
  };
  
  // Get label for status button
  const getStatusLabel = (status) => {
    switch (status) {
      case 'Ya':
        return '✓';
      case 'Tidak':
        return '✕';
      case 'Izin':
        return 'I';
      default:
        return status;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Child info */}
      <View style={styles.infoSection}>
        <Image
          source={{ 
            uri: anak.foto_url || 'https://berbagipendidikan.org/images/default.png' 
          }}
          style={styles.photo}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>{anak.nama_anak || anak.full_name}</Text>
          {anak.nick_name && (
            <Text style={styles.nickname}>"{anak.nick_name}"</Text>
          )}
        </View>
      </View>
      
      {/* Status section */}
      <View style={styles.statusSection}>
        {renderStatusButtons()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  nickname: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  statusSection: {
    flexDirection: 'row',
  },
  statusButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginLeft: 5,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  presentButton: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  presentText: {
    color: 'white',
  },
  absentButton: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  absentText: {
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  permissionText: {
    color: 'white',
  },
});

export default AbsenItem;