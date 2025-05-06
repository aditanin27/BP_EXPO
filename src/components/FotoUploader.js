// src/components/FotoUploader.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FotoUploader = ({ 
  title, 
  imageUri, 
  onSelectImage, 
  onRemoveImage,
  isUploading = false
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {isUploading ? (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <View style={styles.buttonOverlay}>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={onSelectImage}
              >
                <MaterialIcons name="edit" size={22} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={onRemoveImage}
              >
                <MaterialIcons name="delete" size={22} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={onSelectImage}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#2E86DE" />
          ) : (
            <>
              <MaterialIcons name="add-photo-alternate" size={40} color="#2E86DE" />
              <Text style={styles.uploadText}>Tambah Foto</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
  },
  changeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 134, 222, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2E86DE',
  },
});

export default FotoUploader;