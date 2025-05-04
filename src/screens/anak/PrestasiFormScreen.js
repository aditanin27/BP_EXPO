import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Alert,
  TouchableOpacity 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createPrestasi, updatePrestasi, resetPrestasiState } from '../../redux/slices/prestasiSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import * as ImagePicker from 'expo-image-picker';

const PrestasiFormScreen = ({ route, navigation }) => {
  const { selectedAnak, prestasi } = route.params || {};
  const isEditing = !!prestasi;
  
  // Safety check
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
  const { isLoading, createSuccess, updateSuccess, error } = useAppSelector((state) => state.prestasi);

  const [formData, setFormData] = useState({
    nama_prestasi: prestasi?.nama_prestasi || '',
    jenis_prestasi: prestasi?.jenis_prestasi || '',
    level_prestasi: prestasi?.level_prestasi || '',
    foto: prestasi?.foto || null,
    tgl_upload: prestasi?.tgl_upload || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      Alert.alert('Sukses', isEditing ? 'Prestasi berhasil diperbarui' : 'Prestasi berhasil ditambahkan');
      dispatch(resetPrestasiState());
      
      if (isEditing) {
        navigation.replace('PrestasiDetail', { prestasiId: prestasi.id_prestasi });
      } else {
        navigation.goBack();
      }
    }
  }, [createSuccess, updateSuccess, dispatch, navigation, isEditing, prestasi]);

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
      setFormData(prev => ({
        ...prev,
        foto: result.assets[0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama_prestasi.trim()) {
      newErrors.nama_prestasi = 'Nama prestasi wajib diisi';
    }
    
    if (!formData.jenis_prestasi.trim()) {
      newErrors.jenis_prestasi = 'Jenis prestasi wajib diisi';
    }
    
    if (!formData.level_prestasi.trim()) {
      newErrors.level_prestasi = 'Level prestasi wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        id_anak: selectedAnak.id_anak
      };

      if (isEditing) {
        dispatch(updatePrestasi({ 
          id: prestasi.id_prestasi, 
          prestasiData: submitData 
        }));
      } else {
        dispatch(createPrestasi(submitData));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Prestasi' : 'Tambah Prestasi'}
          </Text>
          <Text style={styles.headerSubtitle}>{selectedAnak.full_name}</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Nama Prestasi *"
            value={formData.nama_prestasi}
            onChangeText={(value) => handleInputChange('nama_prestasi', value)}
            error={errors.nama_prestasi}
          />
          
          <Input
            label="Jenis Prestasi *"
            value={formData.jenis_prestasi}
            onChangeText={(value) => handleInputChange('jenis_prestasi', value)}
            error={errors.jenis_prestasi}
          />
          
          <Input
            label="Level Prestasi *"
            value={formData.level_prestasi}
            onChangeText={(value) => handleInputChange('level_prestasi', value)}
            error={errors.level_prestasi}
          />
          
          <Input
            label="Tanggal Upload"
            value={formData.tgl_upload}
            onChangeText={(value) => handleInputChange('tgl_upload', value)}
          />
          
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>Foto Prestasi</Text>
            <Button 
              title="Pilih Foto" 
              onPress={pickImage} 
              style={styles.imagePickerButton}
            />
            
            {formData.foto && (
              <View style={styles.imagePreview}>
                <Text>
                  {typeof formData.foto === 'object' 
                    ? formData.foto.fileName 
                    : formData.foto}
                </Text>
                <TouchableOpacity onPress={() => setFormData(prev => ({ ...prev, foto: null }))}>
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
            title={isEditing ? "Simpan Perubahan" : "Simpan Prestasi"}
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
  imagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  removeImageText: {
    color: '#e74c3c',
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

export default PrestasiFormScreen;