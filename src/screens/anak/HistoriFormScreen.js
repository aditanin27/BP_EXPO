import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createHistori, updateHistori, resetHistoriState } from '../../redux/slices/historiSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import * as ImagePicker from 'expo-image-picker';

const HistoriFormScreen = ({ route, navigation }) => {
  const { selectedAnak, histori } = route.params || {};
  const isEditing = !!histori;

  if (!selectedAnak) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Data anak tidak ditemukan</Text>
        <Button 
          title="Kembali" 
          onPress={() => navigation.goBack()} 
        />
      </SafeAreaView>
    );
  }

  const dispatch = useAppDispatch();
  const { isLoading, createSuccess, updateSuccess, error } = useAppSelector((state) => state.histori);

  const [formData, setFormData] = useState({
    nama_histori: histori?.nama_histori || '',
    jenis_histori: histori?.jenis_histori || '',
    di_opname: histori?.di_opname || '',
    tanggal: histori?.tanggal || new Date().toISOString().split('T')[0],
    foto: histori?.foto || null
  });

  const [existingFoto, setExistingFoto] = useState(
    histori?.foto_url || (histori?.foto ? `https://berbagipendidikan.org/storage/Histori/${selectedAnak.id_anak}/${histori.foto}` : null)
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      Alert.alert('Sukses', isEditing ? 'Riwayat berhasil diperbarui' : 'Riwayat berhasil ditambahkan');
      dispatch(resetHistoriState());
      
      if (isEditing) {
        navigation.replace('HistoriDetail', { historiId: histori.id_histori });
      } else {
        navigation.goBack();
      }
    }
  }, [createSuccess, updateSuccess, dispatch, navigation, isEditing, histori]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Izin Dibutuhkan', 'Untuk memilih foto, izin akses galeri diperlukan');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      
      setFormData(prev => ({
        ...prev,
        foto: selectedImage
      }));

      setExistingFoto(null);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      foto: null
    }));
    setExistingFoto(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_histori.trim()) {
      newErrors.nama_histori = 'Nama riwayat wajib diisi';
    }
    
    if (!formData.jenis_histori.trim()) {
      newErrors.jenis_histori = 'Jenis riwayat wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        id_anak: selectedAnak.id_anak,
        // Retain existing photo if no new photo selected
        foto: formData.foto || (existingFoto ? histori.foto : null)
      };

      if (isEditing) {
        dispatch(updateHistori({ 
          id: histori.id_histori, 
          historiData: submitData 
        }));
      } else {
        dispatch(createHistori(submitData));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Riwayat' : 'Tambah Riwayat'}
          </Text>
          <Text style={styles.headerSubtitle}>{selectedAnak.full_name}</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Nama Riwayat *"
            value={formData.nama_histori}
            onChangeText={(value) => handleInputChange('nama_histori', value)}
            error={errors.nama_histori}
          />
          
          <Input
            label="Jenis Riwayat *"
            value={formData.jenis_histori}
            onChangeText={(value) => handleInputChange('jenis_histori', value)}
            error={errors.jenis_histori}
          />
          
          <Input
            label="Di Opname"
            value={formData.di_opname}
            onChangeText={(value) => handleInputChange('di_opname', value)}
            error={errors.di_opname}
          />
          
          <Input
            label="Tanggal"
            value={formData.tanggal}
            onChangeText={(value) => handleInputChange('tanggal', value)}
          />
          
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>Foto Riwayat</Text>
            <Button 
              title="Pilih Foto" 
              onPress={pickImage} 
              style={styles.imagePickerButton}
            />
            
            {(formData.foto || existingFoto) && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ 
                    uri: formData.foto 
                      ? formData.foto.uri 
                      : existingFoto 
                  }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                  <Text style={styles.removeImageText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Button
            title={isEditing ? "Simpan Perubahan" : "Simpan Riwayat"}
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageSection: {
    marginTop: 15,
    marginBottom: 15,
  },
  imageSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imagePickerButton: {
    marginBottom: 10,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffeded',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#2E86DE',
  },
});

export default HistoriFormScreen;