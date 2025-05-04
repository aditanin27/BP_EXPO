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
import { createRaport, updateRaport, resetRaportState } from '../../redux/slices/raportSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import * as ImagePicker from 'expo-image-picker';

const RaportFormScreen = ({ route, navigation }) => {
  const { selectedAnak, raport } = route.params || {};
  const isEditing = !!raport;

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
  const { isLoading, createSuccess, updateSuccess, error } = useAppSelector((state) => state.raport);

  const [formData, setFormData] = useState({
    tingkat: raport?.tingkat || '',
    kelas: raport?.kelas || '',
    semester: raport?.semester || '',
    tanggal: raport?.tanggal || new Date().toISOString().split('T')[0],
    nilai_max: raport?.nilai_max ? raport.nilai_max.toString() : '',
    nilai_min: raport?.nilai_min ? raport.nilai_min.toString() : '',
    nilai_rata_rata: raport?.nilai_rata_rata ? raport.nilai_rata_rata.toString() : '',
    foto_rapor: [],
    hapus_foto: raport?.foto_rapor ? raport.foto_rapor.map(f => f.id_foto) : []
  });

  const [existingFotos, setExistingFotos] = useState(raport?.foto_rapor || []);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      Alert.alert('Sukses', isEditing ? 'Raport berhasil diperbarui' : 'Raport berhasil ditambahkan');
      dispatch(resetRaportState());
      
      if (isEditing) {
        navigation.replace('RaportDetail', { raportId: raport.id_raport });
      } else {
        navigation.goBack();
      }
    }
  }, [createSuccess, updateSuccess, dispatch, navigation, isEditing, raport]);

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

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Izin Dibutuhkan', 'Untuk memilih foto, izin akses galeri diperlukan');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        foto_rapor: [...prev.foto_rapor, ...result.assets]
      }));
    }
  };

  const removeImage = (index, isNew = true) => {
    if (isNew) {
      const updatedImages = formData.foto_rapor.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        foto_rapor: updatedImages
      }));
    } else {
      const removedFoto = existingFotos[index];
      setExistingFotos(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        hapus_foto: [...(prev.hapus_foto || []), removedFoto.id_foto]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tingkat.trim()) newErrors.tingkat = 'Tingkat wajib diisi';
    if (!formData.kelas.trim()) newErrors.kelas = 'Kelas wajib diisi';
    if (!formData.semester.trim()) newErrors.semester = 'Semester wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        id_anak: selectedAnak.id_anak,
        nilai_max: formData.nilai_max ? parseFloat(formData.nilai_max) : null,
        nilai_min: formData.nilai_min ? parseFloat(formData.nilai_min) : null,
        nilai_rata_rata: formData.nilai_rata_rata ? parseFloat(formData.nilai_rata_rata) : null
      };

      if (isEditing) {
        dispatch(updateRaport({ 
          id: raport.id_raport, 
          raportData: submitData 
        }));
      } else {
        dispatch(createRaport(submitData));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Raport' : 'Tambah Raport'}
          </Text>
          <Text style={styles.headerSubtitle}>{selectedAnak.full_name}</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Tingkat *"
            value={formData.tingkat}
            onChangeText={(value) => handleInputChange('tingkat', value)}
            error={errors.tingkat}
          />
          
          <Input
            label="Kelas *"
            value={formData.kelas}
            onChangeText={(value) => handleInputChange('kelas', value)}
            error={errors.kelas}
          />
          
          <Input
            label="Semester *"
            value={formData.semester}
            onChangeText={(value) => handleInputChange('semester', value)}
            error={errors.semester}
          />
          
          <Input
            label="Tanggal"
            value={formData.tanggal}
            onChangeText={(value) => handleInputChange('tanggal', value)}
          />
          
          <Input
            label="Nilai Maksimum"
            value={formData.nilai_max}
            onChangeText={(value) => handleInputChange('nilai_max', value)}
            keyboardType="numeric"
          />
          
          <Input
            label="Nilai Minimum"
            value={formData.nilai_min}
            onChangeText={(value) => handleInputChange('nilai_min', value)}
            keyboardType="numeric"
          />
          
          <Input
            label="Nilai Rata-rata"
            value={formData.nilai_rata_rata}
            onChangeText={(value) => handleInputChange('nilai_rata_rata', value)}
            keyboardType="numeric"
          />
          
          {isEditing && (
            <View style={styles.imageSection}>
              <Text style={styles.imageSectionTitle}>Foto Raport Tersimpan</Text>
              <View style={styles.existingImagesContainer}>
                {existingFotos.map((foto, index) => (
                  <View key={foto.id_foto} style={styles.existingImageItem}>
                    <Text>{foto.nama}</Text>
                    <TouchableOpacity onPress={() => removeImage(index, false)}>
                      <Text style={styles.removeImageText}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>
              {isEditing ? 'Tambah Foto Raport' : 'Foto Raport'}
            </Text>
            <Button 
              title="Pilih Foto" 
              onPress={pickImages} 
              style={styles.imagePickerButton}
            />
            
            {formData.foto_rapor.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Text>{image.fileName}</Text>
                <TouchableOpacity onPress={() => removeImage(index)}>
                  <Text style={styles.removeImageText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Button
            title={isEditing ? "Simpan Perubahan" : "Simpan Raport"}
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
  existingImagesContainer: {
    marginBottom: 10,
  },
  existingImageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
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

export default RaportFormScreen;