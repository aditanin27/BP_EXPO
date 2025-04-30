import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ 
  imageUri, 
  onImageSelected, 
  label = 'Pilih Foto',
  isLoading = false,
  size = 'medium'
}) => {
  const [uploading, setUploading] = useState(false);
  
  // Request permission and pick image
  const pickImage = async () => {
    if (isLoading || uploading) return;
    
    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Kami memerlukan izin untuk mengakses galeri foto Anda.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    try {
      setUploading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        onImageSelected(selectedAsset);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat memilih gambar.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  // Determine container size based on prop
  const getContainerSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80, borderRadius: 40 };
      case 'large':
        return { width: 150, height: 150, borderRadius: 75 };
      case 'medium':
      default:
        return { width: 120, height: 120, borderRadius: 60 };
    }
  };
  
  const containerSize = getContainerSize();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.imageContainer, containerSize]}
        onPress={pickImage}
        disabled={isLoading || uploading}
      >
        {imageUri ? (
          <>
            <Image 
              source={{ uri: imageUri }} 
              style={[styles.image, containerSize]} 
            />
            <View style={styles.changeOverlay}>
              <Text style={styles.changeText}>Ubah</Text>
            </View>
          </>
        ) : (
          <View style={[styles.placeholder, containerSize]}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>{label}</Text>
          </View>
        )}
        
        {(isLoading || uploading) && (
          <View style={[styles.loadingOverlay, containerSize]}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#2E86DE',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderIcon: {
    fontSize: 24,
    marginBottom: 5,
    color: '#666',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 5,
    alignItems: 'center',
  },
  changeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImagePickerComponent;