// src/screens/aktivitas/FotoAktivitasScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAktivitasDetail,
  updateAktivitas,
  uploadFotoAktivitas,
  resetAktivitasState
} from '../../redux/slices/aktivitasSlice';
import FotoUploader from '../../components/FotoUploader';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const { width: screenWidth } = Dimensions.get('window');

const FotoAktivitasScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id } = route.params || {};
  
  const {
    detail,
    isLoadingDetail,
    isUploading,
    uploadSuccess,
    updateSuccess,
    error
  } = useAppSelector(state => state.aktivitas);
  
  const [photos, setPhotos] = useState({
    foto_1: null,
    foto_2: null,
    foto_3: null,
    hapus_foto_1: false,
    hapus_foto_2: false,
    hapus_foto_3: false
  });
  
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch aktivitas detail on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchAktivitasDetail(id));
    }
  }, [dispatch, id]);
  
  // Handle success response
  useEffect(() => {
    if (uploadSuccess || updateSuccess) {
      setIsSubmitting(false);
      Alert.alert('Sukses', 'Foto aktivitas berhasil diperbarui', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      dispatch(resetAktivitasState());
    }
  }, [uploadSuccess, updateSuccess, navigation, dispatch]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
      Alert.alert('Error', error);
      dispatch(resetAktivitasState());
    }
  }, [error, dispatch]);
  
  // Reset photo state when detail changes
  useEffect(() => {
    if (detail) {
      setPhotos({
        foto_1: null,
        foto_2: null,
        foto_3: null,
        hapus_foto_1: false,
        hapus_foto_2: false,
        hapus_foto_3: false
      });
    }
  }, [detail]);
  
  const handleSelectPhoto = (field, photo) => {
    setPhotos(prevState => ({
      ...prevState,
      [field]: photo,
      // Reset hapus flag if user selects a new photo
      [`hapus_${field}`]: false
    }));
  };
  
  const handleRemovePhoto = (field) => {
    setPhotos(prevState => ({
      ...prevState,
      [field]: null,
      // Set hapus flag if detail has this photo
      [`hapus_${field}`]: isPhotoPresent(field)
    }));
  };
  
  // Check if the photo exists in the detail
  const isPhotoPresent = (field) => {
    if (!detail) return false;
    
    const urlField = `${field}_url`;
    return !!(detail[urlField] && 
      detail[urlField] !== 'https://berbagipendidikan.org/images/default.png');
  };
  
  // Get photo URL for display
  const getPhotoUrl = (field) => {
    // If user selected a new photo
    if (photos[field]) {
      return photos[field].uri;
    }
    
    // If detail has a photo and it's not marked for deletion
    if (detail && !photos[`hapus_${field}`]) {
      const urlField = `${field}_url`;
      const url = detail[urlField];
      
      if (url && url !== 'https://berbagipendidikan.org/images/default.png') {
        return url;
      }
    }
    
    return null;
  };
  
  // Preview a photo in fullscreen
  const handlePreviewPhoto = (url) => {
    if (url) {
      setPhotoPreviewUrl(url);
    }
  };
  
  // Close photo preview
  const closePhotoPreview = () => {
    setPhotoPreviewUrl(null);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Check if any changes were made
    const hasChanges = 
      photos.foto_1 || photos.foto_2 || photos.foto_3 || 
      photos.hapus_foto_1 || photos.hapus_foto_2 || photos.hapus_foto_3;
    
    if (!hasChanges) {
      Alert.alert('Info', 'Tidak ada perubahan yang dilakukan');
      return;
    }
    
    setIsSubmitting(true);
    
    if (id) {
      // Using updateAktivitas as it handles file uploads and deletions
      dispatch(updateAktivitas({ 
        id, 
        aktivitasData: {
          ...photos,
          // Include the required fields from detail
          jenis_kegiatan: detail.jenis_kegiatan,
          tanggal: detail.tanggal,
          materi: detail.materi,
          level: detail.level,
          nama_kelompok: detail.nama_kelompok
        }
      }));
    }
  };
  
  // Show loading indicator when fetching detail
  if (isLoadingDetail) {
    return <LoadingOverlay />;
  }
  
  // Handle error when detail not found
  if (!detail && !isLoadingDetail) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kelola Foto</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data aktivitas tidak ditemukan</Text>
          <Button 
            title="Kembali"
            onPress={() => navigation.goBack()}
            style={styles.backToListButton}
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Foto</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Activity info */}
          <View style={styles.activityInfo}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{detail.jenis_kegiatan}</Text>
            </View>
            <Text style={styles.activityTitle}>{detail.materi}</Text>
          </View>
          
          {/* Photo management section */}
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Foto Aktivitas</Text>
            <Text style={styles.sectionDescription}>
              Tambah, ubah, atau hapus foto untuk aktivitas ini
            </Text>
            
            <View style={styles.photoUploadersContainer}>
              <FotoUploader
                title="Foto 1"
                imageUri={getPhotoUrl('foto_1')}
                onSelectImage={(photo) => handleSelectPhoto('foto_1', photo)}
                onRemoveImage={() => handleRemovePhoto('foto_1')}
                onImagePress={() => handlePreviewPhoto(getPhotoUrl('foto_1'))}
                isUploading={isUploading}
              />
              
              <FotoUploader
                title="Foto 2"
                imageUri={getPhotoUrl('foto_2')}
                onSelectImage={(photo) => handleSelectPhoto('foto_2', photo)}
                onRemoveImage={() => handleRemovePhoto('foto_2')}
                onImagePress={() => handlePreviewPhoto(getPhotoUrl('foto_2'))}
                isUploading={isUploading}
              />
              
              <FotoUploader
                title="Foto 3"
                imageUri={getPhotoUrl('foto_3')}
                onSelectImage={(photo) => handleSelectPhoto('foto_3', photo)}
                onRemoveImage={() => handleRemovePhoto('foto_3')}
                onImagePress={() => handlePreviewPhoto(getPhotoUrl('foto_3'))}
                isUploading={isUploading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom action buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Simpan Perubahan"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          style={styles.saveButton}
        />
        
        <Button
          title="Kembali"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
      
      {/* Photo preview modal */}
      <Modal
        visible={!!photoPreviewUrl}
        transparent={true}
        animationType="fade"
        onRequestClose={closePhotoPreview}
      >
        <View style={styles.previewModalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closePhotoPreview}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Image
            source={{ uri: photoPreviewUrl }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Extra space for bottom buttons
  },
  activityInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F2FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    color: '#2E86DE',
    fontWeight: '600',
    fontSize: 14,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  photoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photoUploadersContainer: {
    marginTop: 8,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    elevation: 5,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
  },
  cancelButtonText: {
    color: '#2E86DE',
  },
  previewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewImage: {
    width: screenWidth,
    height: screenWidth,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToListButton: {
    width: 200,
  },
});

export default FotoAktivitasScreen;