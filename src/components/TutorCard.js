import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const TutorCard = ({ tutor, onPress, onEdit, onDelete }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Image
          source={{ 
            uri: tutor.foto_url || 'https://berbagipendidikan.org/images/default.png'
          }}
          style={styles.tutorPhoto}
        />
        <View style={styles.tutorInfo}>
          <Text style={styles.tutorName} numberOfLines={1}>
            {tutor.nama}
          </Text>
          <Text style={styles.tutorMaple} numberOfLines={1}>
            Mata Pelajaran: {tutor.maple || '-'}
          </Text>
          <Text style={styles.tutorDetail}>
            {tutor.pendidikan || '-'} • {tutor.shelter?.nama_shelter || '-'}
          </Text>
          <Text style={styles.tutorEmail} numberOfLines={1}>
            {tutor.email || '-'}
          </Text>
        </View>
      </View>
      
      {(onEdit || onDelete) && (
        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={(e) => {
                e.stopPropagation();
                onEdit(tutor.id_tutor);
              }}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={(e) => {
                e.stopPropagation();
                onDelete(tutor.id_tutor, tutor.nama);
              }}
            >
              <Text style={[styles.buttonText, styles.deleteText]}>Hapus</Text>
            </TouchableOpacity>
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
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  tutorPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#2E86DE',
    marginRight: 15,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tutorMaple: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  tutorDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  tutorEmail: {
    fontSize: 13,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#2E86DE',
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
  },
});

export default TutorCard;