// src/screens/aktivitas/FotoAktivitasScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAktivitasById, 
  updateAktivitas,
  uploadFotoAktivitas,
  resetAktivitasState
} from '../../redux/slices/aktivitasSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import FotoUploader from '../../components/FotoUploader';

const FotoAktivitasScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { 
    selectedAktivitas, 
    isLoadingDetail, 
    isUploadingPhoto,
    error, 
    uploadSuccess,
    updateSuccess
  } = useAppSelector((state) => state.aktivitas);
  
  // Local state for photo management
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [foto3, setFoto3] = useState(null);
  const [removeFoto1, setRemoveFoto1] = useState(false);
  const [removeFoto2, setRemoveFoto2] = useState(false);
  const [removeFoto3, setRemoveFoto3] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAktivitasById(id));
    
    return () => {
      dispatch(resetAktivitasState());
    };
  }, [dispatch, id]);
  
  // Set initial photo URLs
  useEffect(() => {
    if (selectedAktivitas) {
      setFoto1(selectedAktivitas.foto_1_url || null);
      setFoto2(selectedAktivitas.foto_2_url || null);
      setFoto3(selectedAktivitas.foto_3_url || null);
    }
  }, [selectedAktivitas]);
  
  // Handle success responses
  useEffect(() => {
    if (uploadSuccess) {
      Alert.alert('Sukses', 'Foto berhasil diupload');
      dispatch(resetAktivitasState());
    }
    
    if (updateSuccess) {
      Alert.alert('Sukses', 'Foto berhasil diupdate');
      dispatch(resetAktivitasState());
      navigation.goBack();
    }
  }, [uploadSuccess, updateSuccess, dispatch, navigation]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetAktivitasState());
    }
  }, [error, dispatch]);
  
  // Request permissions and pick image
  const pickImage = async (photoNumber) => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      
      // Upload immediately
      dispatch(uploadFotoAktivitas({
        id,
        fotoNumber: photoNumber,
        fotoData: selectedAsset
      }));
      
      // Update local state
      switch (photoNumber) {
        case 1:
          setFoto1(selectedAsset.uri);
          setRemoveFoto1(false);
          break;
        case 2:
          setFoto2(selectedAsset.uri);
          setRemoveFoto2(false);
          break;
        case 3:
          setFoto3(selectedAsset.uri);
          setRemoveFoto3(false);
          break;
      }
    }
  };
  
  // Handle removal of photos
  const handleRemovePhoto = (photoNumber) => {
    switch (photoNumber) {
      case 1:
        setRemoveFoto1(true);
        setFoto1(null);
        break;
      case 2:
        setRemoveFoto2(true);
        setFoto2(null);
        break;
      case 3:
        setRemoveFoto3(true);
        setFoto3(null);
        break;
    }
  };
  
  // Save changes
  const handleSaveChanges = () => {
    const aktivitasData = {
      hapus_foto_1: removeFoto1,
      hapus_foto_2: removeFoto2,
      hapus_foto_3: removeFoto3
    };
    
    dispatch(updateAktivitas({ id, aktivitasData }));
  };
  
  if (isLoadingDetail || !selectedAktivitas) {
    return <LoadingOverlay />;
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kelola Foto Aktivitas</Text>
          <Text style={styles.headerSubtitle}>
            {selectedAktivitas.jenis_kegiatan === 'Bimbel' 
              ? `Bimbel ${selectedAktivitas.nama_kelompok || ''}` 
              : selectedAktivitas.materi}
          </Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Foto Aktivitas (Maksimal 3 Foto)</Text>
          
          <FotoUploader
            title="Foto 1"
            imageUri={foto1}
            onSelectImage={() => pickImage(1)}
            onRemoveImage={() => handleRemovePhoto(1)}
            isUploading={isUploadingPhoto}
          />
          
          <FotoUploader
            title="Foto 2"
            imageUri={foto2}
            onSelectImage={() => pickImage(2)}
            onRemoveImage={() => handleRemovePhoto(2)}
            isUploading={isUploadingPhoto}
          />
          
          <FotoUploader
            title="Foto 3"
            imageUri={foto3}
            onSelectImage={() => pickImage(3)}
            onRemoveImage={() => handleRemovePhoto(3)}
            isUploading={isUploadingPhoto}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Simpan Perubahan"
              onPress={handleSaveChanges}
              isLoading={isUploadingPhoto}
              style={styles.saveButton}
            />
            
            <Button
              title="Kembali"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E86DE',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999',
  },
  cancelButtonText: {
    color: '#555',
  },
});

export default FotoAktivitasScreen;