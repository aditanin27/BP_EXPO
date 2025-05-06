// src/components/AktivitasCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const AktivitasCard = ({ aktivitas, onPress, onEdit, onDelete }) => {
  // Determine the title to display based on activity type
  const getTitle = () => {
    if (aktivitas.jenis_kegiatan === 'Bimbel') {
      return `Bimbel ${aktivitas.nama_kelompok || ''}`;
    }
    return aktivitas.materi || 'Aktivitas';
  };

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get the first photo URL if available
  const getPhotoUrl = () => {
    if (aktivitas.foto_1_url) return aktivitas.foto_1_url;
    if (aktivitas.foto_2_url) return aktivitas.foto_2_url;
    if (aktivitas.foto_3_url) return aktivitas.foto_3_url;
    return null;
  };
  
  const photoUrl = getPhotoUrl();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{aktivitas.jenis_kegiatan}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(aktivitas.tanggal)}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{getTitle()}</Text>
        
        {aktivitas.jenis_kegiatan === 'Bimbel' && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Level:</Text>
            <Text style={styles.detailValue}>{aktivitas.level || '-'}</Text>
          </View>
        )}
        
        {aktivitas.jenis_kegiatan === 'Bimbel' && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Materi:</Text>
            <Text style={styles.detailValue}>{aktivitas.materi || '-'}</Text>
          </View>
        )}
        
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Shelter:</Text>
          <Text style={styles.detailValue}>
            {aktivitas.shelter?.nama_shelter || '-'}
          </Text>
        </View>
      </View>
      
      {photoUrl && (
        <Image
          source={{ uri: photoUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.absenButton]}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Absensi</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={[styles.buttonText, styles.deleteText]}>Hapus</Text>
        </TouchableOpacity>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeContainer: {
    backgroundColor: '#E6F2FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  typeText: {
    color: '#2E86DE',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    width: 70,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  absenButton: {
    backgroundColor: '#27ae60',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteText: {
    color: '#e74c3c',
  }
});

export default AktivitasCard;