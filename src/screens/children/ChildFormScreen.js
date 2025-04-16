import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  createChild, 
  updateChild, 
  fetchChildById,
  resetChildrenState
} from '../../redux/slices/childrenSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { IMAGE_BASE_URL } from '../../utils/constants';
import * as ImagePicker from 'expo-image-picker';

const ChildFormScreen = ({ route, navigation }) => {
  const { childId } = route.params || {};
  const isEditing = !!childId;
  
  const dispatch = useAppDispatch();
  const { selectedChild, isLoading, error, createSuccess, updateSuccess } = useAppSelector((state) => state.children);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    nick_name: '',
    nik_anak: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L',
    agama: '',
    anak_ke: '',
    dari_bersaudara: '',
    tinggal_bersama: '',
    hobi: '',
    pelajaran_favorit: '',
    prestasi: '',
    hafalan: '',
    jarak_rumah: '',
    transportasi: '',
    foto: null,
    status_validasi: 'tidak aktif',
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Load child data if editing
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchChildById(childId));
    }
  }, [dispatch, isEditing, childId]);

  // Populate form when child data is available
  useEffect(() => {
    if (isEditing && selectedChild) {
      setFormData({
        full_name: selectedChild.full_name || '',
        nick_name: selectedChild.nick_name || '',
        nik_anak: selectedChild.nik_anak || '',
        tempat_lahir: selectedChild.tempat_lahir || '',
        tanggal_lahir: formatDateForInput(selectedChild.tanggal_lahir) || '',
        jenis_kelamin: selectedChild.jenis_kelamin || 'L',
        agama: selectedChild.agama || '',
        anak_ke: selectedChild.anak_ke ? selectedChild.anak_ke.toString() : '',
        dari_bersaudara: selectedChild.dari_bersaudara ? selectedChild.dari_bersaudara.toString() : '',
        tinggal_bersama: selectedChild.tinggal_bersama || '',
        hobi: selectedChild.hobi || '',
        pelajaran_favorit: selectedChild.pelajaran_favorit || '',
        prestasi: selectedChild.prestasi || '',
        hafalan: selectedChild.hafalan || '',
        jarak_rumah: selectedChild.jarak_rumah ? selectedChild.jarak_rumah.toString() : '',
        transportasi: selectedChild.transportasi || '',
        foto: selectedChild.foto || null,
        status_validasi: selectedChild.status_validasi || 'tidak aktif',
      });
    }
  }, [isEditing, selectedChild]);

  // Handle success responses
  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Sukses', 'Data anak berhasil disimpan');
      dispatch(resetChildrenState());
      navigation.navigate('ChildrenList');
    }
    if (updateSuccess) {
      Alert.alert('Sukses', 'Data anak berhasil diperbarui');
      dispatch(resetChildrenState());
      navigation.goBack();
    }
  }, [createSuccess, updateSuccess, dispatch, navigation]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    }
    
    if (!formData.tempat_lahir.trim()) {
      newErrors.tempat_lahir = 'Tempat lahir wajib diisi';
    }
    
    if (!formData.tanggal_lahir.trim()) {
      newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.tanggal_lahir)) {
      newErrors.tanggal_lahir = 'Format tanggal harus YYYY-MM-DD';
    }
    
    if (!formData.agama.trim()) {
      newErrors.agama = 'Agama wajib diisi';
    }
    
    // Number validations
    if (formData.anak_ke && isNaN(Number(formData.anak_ke))) {
      newErrors.anak_ke = 'Anak ke harus berupa angka';
    }
    
    if (formData.dari_bersaudara && isNaN(Number(formData.dari_bersaudara))) {
      newErrors.dari_bersaudara = 'Dari bersaudara harus berupa angka';
    }
    
    if (formData.jarak_rumah && isNaN(Number(formData.jarak_rumah))) {
      newErrors.jarak_rumah = 'Jarak rumah harus berupa angka';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert string numbers to actual numbers
      const processedData = {
        ...formData,
        anak_ke: formData.anak_ke ? parseInt(formData.anak_ke, 10) : null,
        dari_bersaudara: formData.dari_bersaudara ? parseInt(formData.dari_bersaudara, 10) : null,
        jarak_rumah: formData.jarak_rumah ? parseFloat(formData.jarak_rumah) : null,
      };
      
      if (isEditing) {
        dispatch(updateChild({ id: childId, childData: processedData }));
      } else {
        dispatch(createChild(processedData));
      }
    }
  };

  const handleSelectImage = async () => {
    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Aplikasi membutuhkan izin untuk mengakses galeri foto');
        return;
      }
    }
    
    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData({
        ...formData,
        foto: result.assets[0],
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Data Anak' : 'Tambah Anak Baru'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={handleSelectImage}>
              <Image
                source={{ 
                  uri: formData.foto 
                    ? formData.foto.uri 
                      ? formData.foto.uri 
                      : `${IMAGE_BASE_URL}Anak/${childId}/${formData.foto}`
                    : 'https://berbagipendidikan.org/images/default.png'
                }}
                style={styles.childPhoto}
              />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoText}>Pilih Foto</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Data Pribadi</Text>
          
          <Input
            label="Nama Lengkap *"
            value={formData.full_name}
            onChangeText={(value) => handleInputChange('full_name', value)}
            placeholder="Masukkan nama lengkap"
            error={errors.full_name}
          />
          
          <Input
            label="Nama Panggilan"
            value={formData.nick_name}
            onChangeText={(value) => handleInputChange('nick_name', value)}
            placeholder="Masukkan nama panggilan"
            error={errors.nick_name}
          />
          
          <Input
            label="NIK"
            value={formData.nik_anak}
            onChangeText={(value) => handleInputChange('nik_anak', value)}
            placeholder="Masukkan NIK (opsional)"
            error={errors.nik_anak}
            keyboardType="numeric"
          />
          
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Jenis Kelamin *</Text>
            <View style={styles.radioOptions}>
              <TouchableOpacity 
                style={[
                  styles.radioOption, 
                  formData.jenis_kelamin === 'L' && styles.radioSelected
                ]}
                onPress={() => handleInputChange('jenis_kelamin', 'L')}
              >
                <Text 
                  style={[
                    styles.radioText, 
                    formData.jenis_kelamin === 'L' && styles.radioTextSelected
                  ]}
                >
                  Laki-laki
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.radioOption, 
                  formData.jenis_kelamin === 'P' && styles.radioSelected
                ]}
                onPress={() => handleInputChange('jenis_kelamin', 'P')}
              >
                <Text 
                  style={[
                    styles.radioText, 
                    formData.jenis_kelamin === 'P' && styles.radioTextSelected
                  ]}
                >
                  Perempuan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Input
            label="Tempat Lahir *"
            value={formData.tempat_lahir}
            onChangeText={(value) => handleInputChange('tempat_lahir', value)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir}
          />
          
          <Input
            label="Tanggal Lahir *"
            value={formData.tanggal_lahir}
            onChangeText={(value) => handleInputChange('tanggal_lahir', value)}
            placeholder="YYYY-MM-DD"
            error={errors.tanggal_lahir}
          />
          
          <Input
            label="Agama *"
            value={formData.agama}
            onChangeText={(value) => handleInputChange('agama', value)}
            placeholder="Masukkan agama"
            error={errors.agama}
          />
          
          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Input
                label="Anak ke"
                value={formData.anak_ke}
                onChangeText={(value) => handleInputChange('anak_ke', value)}
                placeholder="Anak ke"
                error={errors.anak_ke}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Dari"
                value={formData.dari_bersaudara}
                onChangeText={(value) => handleInputChange('dari_bersaudara', value)}
                placeholder="Bersaudara"
                error={errors.dari_bersaudara}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <Input
            label="Tinggal Bersama"
            value={formData.tinggal_bersama}
            onChangeText={(value) => handleInputChange('tinggal_bersama', value)}
            placeholder="Contoh: Orang Tua, Kakek/Nenek, dll"
            error={errors.tinggal_bersama}
          />
          
          <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
          
          <Input
            label="Hobi"
            value={formData.hobi}
            onChangeText={(value) => handleInputChange('hobi', value)}
            placeholder="Masukkan hobi"
            error={errors.hobi}
          />
          
          <Input
            label="Pelajaran Favorit"
            value={formData.pelajaran_favorit}
            onChangeText={(value) => handleInputChange('pelajaran_favorit', value)}
            placeholder="Masukkan pelajaran favorit"
            error={errors.pelajaran_favorit}
          />
          
          <Input
            label="Prestasi"
            value={formData.prestasi}
            onChangeText={(value) => handleInputChange('prestasi', value)}
            placeholder="Masukkan prestasi"
            error={errors.prestasi}
          />
          
          <Input
            label="Hafalan"
            value={formData.hafalan}
            onChangeText={(value) => handleInputChange('hafalan', value)}
            placeholder="Masukkan hafalan"
            error={errors.hafalan}
          />
          
          <Input
            label="Jarak Rumah (km)"
            value={formData.jarak_rumah}
            onChangeText={(value) => handleInputChange('jarak_rumah', value)}
            placeholder="Masukkan jarak dalam km"
            error={errors.jarak_rumah}
            keyboardType="numeric"
          />
          
          <Input
            label="Transportasi"
            value={formData.transportasi}
            onChangeText={(value) => handleInputChange('transportasi', value)}
            placeholder="Contoh: Jalan kaki, Sepeda, dll"
            error={errors.transportasi}
          />
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              title={isEditing ? "Simpan Perubahan" : "Simpan Data"}
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.saveButton}
            />
            
            <Button
              title="Batal"
              onPress={handleCancel}
              style={styles.cancelButton}
              textStyle={styles.cancelText}
            />
          </View>
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
    padding: 0,
  },
  header: {
    padding: 20,
    backgroundColor: '#2E86DE',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  formContainer: {
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  childPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    alignItems: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  photoText: {
    color: 'white',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  radioOptions: {
    flexDirection: 'row',
  },
  radioOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#2E86DE',
    borderColor: '#2E86DE',
  },
  radioText: {
    color: '#555',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: 'white',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffeded',
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2E86DE',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#555',
  },
  cancelText: {
    color: '#555',
  },
});

export default ChildFormScreen;