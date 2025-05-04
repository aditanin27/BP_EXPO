import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileImagePicker = ({ imageUri, onImageSelected, isUploading }) => {
  const [permissionStatus, setPermissionStatus] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPermissionStatus(status);
    return status === 'granted';
  };

  const pickImage = async () => {
    // Request permission if not already granted
    if (permissionStatus !== 'granted') {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert(
          'Izin Dibutuhkan',
          'Untuk dapat mengganti foto profil, izin akses ke galeri diperlukan.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        onImageSelected(selectedImage);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} disabled={isUploading}>
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: imageUri || 'https://berbagipendidikan.org/images/default.png' 
            }}
            style={styles.image}
          />
          {isUploading ? (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <View style={styles.editIconContainer}>
              <MaterialIcons name="photo-camera" size={24} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E86DE',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileImagePicker;