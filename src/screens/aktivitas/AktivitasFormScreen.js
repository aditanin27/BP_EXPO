// src/screens/aktivitas/AktivitasFormScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAktivitasDetail,
  createAktivitas,
  updateAktivitas,
  resetAktivitasState
} from '../../redux/slices/aktivitasSlice';
import DropdownSelect from '../../components/DropdownSelect';
import DatePicker from '../../components/DatePicker';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import * as ImagePicker from 'expo-image-picker';

const AktivitasFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id } = route.params || {};
  const isEditMode = !!id;
  
  const { detail, isLoading, isLoadingDetail, createSuccess, updateSuccess, error } = 
    useAppSelector(state => state.aktivitas);
  const { adminShelter } = useAppSelector(state => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    jenis_kegiatan: '',
    tanggal: new Date().toISOString().split('T')[0],
    materi: '',
    level: '',
    nama_kelompok: '',
    foto_1: null,
    foto_2: null,
    foto_3: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Options for dropdowns
  const jenisKegiatanOptions = [
    { label: 'Bimbel', value: 'Bimbel' },
    { label: 'Keterampilan', value: 'Keterampilan' },
    { label: 'Keagamaan', value: 'Keagamaan' },
    { label: 'Olahraga', value: 'Olahraga' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  const levelOptions = [
    { label: 'SD', value: 'SD' },
    { label: 'SMP', value: 'SMP' },
    { label: 'SMA', value: 'SMA' },
    { label: 'PT', value: 'PT' }
  ];
  
  // Fetch aktivitas detail if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchAktivitasDetail(id));
    }
  }, [dispatch, isEditMode, id]);
  
  // Populate form with data when detail is fetched
  useEffect(() => {
    if (isEditMode && detail) {
      setFormData({
        jenis_kegiatan: detail.jenis_kegiatan || '',
        tanggal: detail.tanggal || new Date().toISOString().split('T')[0],
        materi: detail.materi || '',
        level: detail.level || '',
        nama_kelompok: detail.nama_kelompok || '',
        // We don't set foto fields here since they will be handled separately
        foto_1: null,
        foto_2: null,
        foto_3: null
      });
    }
  }, [isEditMode, detail]);
  
  // Handle create/update success
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      setIsSubmitting(false);
      
      const message = isEditMode 
        ? 'Aktivitas berhasil diperbarui' 
        : 'Aktivitas berhasil ditambahkan';
      
      Alert.alert('Sukses', message, [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack()
        }
      ]);
      
      dispatch(resetAktivitasState());
    }
  }, [createSuccess, updateSuccess, isEditMode, navigation, dispatch]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
      Alert.alert('Error', error);
      dispatch(resetAktivitasState());
    }
  }, [error, dispatch]);
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error for the field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    handleChange('tanggal', date.toISOString().split('T')[0]);
    setShowDatePicker(false);
  };
  
  // Request camera/gallery permissions
  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus.status !== 'granted' || galleryStatus.status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Aplikasi memerlukan izin untuk mengakses kamera dan galeri',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };
  
  // Pick image from gallery
  const pickImage = async (field) => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleChange(field, result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih gambar dari galeri');
    }
  };
  
  // Take a photo with camera
  const takePhoto = async (field) => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleChange(field, result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto dengan kamera');
    }
  };
  
  // Show photo options (camera/gallery)
  const showPhotoOptions = (field) => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto',
      [
        {
          text: 'Kamera',
          onPress: () => takePhoto(field),
        },
        {
          text: 'Galeri',
          onPress: () => pickImage(field),
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jenis_kegiatan) {
      newErrors.jenis_kegiatan = 'Jenis kegiatan harus diisi';
    }
    
    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }
    
    if (!formData.materi) {
      newErrors.materi = 'Materi harus diisi';
    }
    
    // Additional validations for Bimbel type
    if (formData.jenis_kegiatan === 'Bimbel') {
      if (!formData.level) {
        newErrors.level = 'Level harus diisi untuk kegiatan Bimbel';
      }
      
      if (!formData.nama_kelompok) {
        newErrors.nama_kelompok = 'Nama kelompok harus diisi untuk kegiatan Bimbel';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Harap perbaiki kesalahan pada form');
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare data for API
    const aktivitasData = {
      ...formData,
      id_shelter: adminShelter?.id_shelter
    };
    
    if (isEditMode) {
      dispatch(updateAktivitas({ id, aktivitasData }));
    } else {
      dispatch(createAktivitas(aktivitasData));
    }
  };
  
// Handle navigation to photo management screen
const handleManagePhotos = () => {
    if (isEditMode) {
      navigation.navigate('FotoAktivitas', { id });
    } else {
      Alert.alert(
        'Info',
        'Anda perlu menyimpan aktivitas terlebih dahulu sebelum mengelola foto',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Show loading overlay while fetching data
  if (isEditMode && isLoadingDetail) {
    return <LoadingOverlay />;
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          {/* Jenis Kegiatan */}
          <DropdownSelect
            label="Jenis Kegiatan*"
            value={formData.jenis_kegiatan}
            options={jenisKegiatanOptions}
            onValueChange={(value) => handleChange('jenis_kegiatan', value)}
            placeholder="Pilih jenis kegiatan"
            error={errors.jenis_kegiatan}
          />
          
          {/* Tanggal */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tanggal*</Text>
            <TouchableOpacity 
              style={[styles.dateInput, errors.tanggal && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.tanggal ? formatDate(formData.tanggal) : 'Pilih tanggal'}
              </Text>
            </TouchableOpacity>
            {errors.tanggal && <Text style={styles.errorText}>{errors.tanggal}</Text>}
            
            {showDatePicker && (
              <DatePicker
                value={formData.tanggal ? new Date(formData.tanggal) : new Date()}
                onChange={handleDateChange}
                onCancel={() => setShowDatePicker(false)}
              />
            )}
          </View>
          
          {/* Materi */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Materi*</Text>
            <TextInput
              style={[styles.input, errors.materi && styles.inputError]}
              value={formData.materi}
              onChangeText={(text) => handleChange('materi', text)}
              placeholder="Masukkan materi aktivitas"
              multiline
            />
            {errors.materi && <Text style={styles.errorText}>{errors.materi}</Text>}
          </View>
          
          {/* Conditional fields for Bimbel */}
          {formData.jenis_kegiatan === 'Bimbel' && (
            <>
              {/* Level */}
              <DropdownSelect
                label="Level*"
                value={formData.level}
                options={levelOptions}
                onValueChange={(value) => handleChange('level', value)}
                placeholder="Pilih level"
                error={errors.level}
              />
              
              {/* Nama Kelompok */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nama Kelompok*</Text>
                <TextInput
                  style={[styles.input, errors.nama_kelompok && styles.inputError]}
                  value={formData.nama_kelompok}
                  onChangeText={(text) => handleChange('nama_kelompok', text)}
                  placeholder="Masukkan nama kelompok"
                />
                {errors.nama_kelompok && <Text style={styles.errorText}>{errors.nama_kelompok}</Text>}
              </View>
            </>
          )}
          
          {/* Photos Section */}
<View style={styles.photoSection}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Foto Aktivitas</Text>
    
    {isEditMode && (
      <TouchableOpacity 
        style={styles.managePhotosButton}
        onPress={handleManagePhotos}
      >
        <Text style={styles.managePhotosText}>Kelola Foto</Text>
      </TouchableOpacity>
    )}
  </View>
  
  {isEditMode ? (
    /* For edit mode, show existing photos with option to manage */
    <View style={styles.existingPhotos}>
      {detail && (
        <View style={styles.photosGrid}>
          {[detail.foto_1_url, detail.foto_2_url, detail.foto_3_url]
            .filter(url => url && url !== 'https://berbagipendidikan.org/images/default.png')
            .map((url, index) => (
              <Image 
                key={`photo-${index}`}
                source={{ uri: url }}
                style={styles.photoThumbnail}
              />
            ))}
          
          {([detail.foto_1_url, detail.foto_2_url, detail.foto_3_url]
            .filter(url => url && url !== 'https://berbagipendidikan.org/images/default.png').length === 0) && (
            <Text style={styles.noPhotosText}>
              Belum ada foto untuk aktivitas ini. Klik "Kelola Foto" untuk menambahkan.
            </Text>
          )}
        </View>
      )}
    </View>
  ) : (
              /* For create mode, show options to add initial photos */
              <View style={styles.newPhotos}>
                <Text style={styles.photoHelpText}>
                  Tambahkan foto untuk aktivitas ini (opsional). Anda juga dapat menambahkannya nanti.
                </Text>
                
                <View style={styles.photoButtonsContainer}>
                  {/* Foto 1 */}
                  <View style={styles.photoItem}>
                    <Text style={styles.photoLabel}>Foto 1</Text>
                    
                    {formData.foto_1 ? (
                      <View style={styles.selectedPhotoContainer}>
                        <Image 
                          source={{ uri: formData.foto_1.uri }}
                          style={styles.selectedPhoto}
                        />
                        <TouchableOpacity 
                          style={styles.removePhotoButton}
                          onPress={() => handleChange('foto_1', null)}
                        >
                          <Text style={styles.removePhotoText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addPhotoButton}
                        onPress={() => showPhotoOptions('foto_1')}
                      >
                        <Text style={styles.addPhotoText}>+ Tambah</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Foto 2 */}
                  <View style={styles.photoItem}>
                    <Text style={styles.photoLabel}>Foto 2</Text>
                    
                    {formData.foto_2 ? (
                      <View style={styles.selectedPhotoContainer}>
                        <Image 
                          source={{ uri: formData.foto_2.uri }}
                          style={styles.selectedPhoto}
                        />
                        <TouchableOpacity 
                          style={styles.removePhotoButton}
                          onPress={() => handleChange('foto_2', null)}
                        >
                          <Text style={styles.removePhotoText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addPhotoButton}
                        onPress={() => showPhotoOptions('foto_2')}
                      >
                        <Text style={styles.addPhotoText}>+ Tambah</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Foto 3 */}
                  <View style={styles.photoItem}>
                    <Text style={styles.photoLabel}>Foto 3</Text>
                    
                    {formData.foto_3 ? (
                      <View style={styles.selectedPhotoContainer}>
                        <Image 
                          source={{ uri: formData.foto_3.uri }}
                          style={styles.selectedPhoto}
                        />
                        <TouchableOpacity 
                          style={styles.removePhotoButton}
                          onPress={() => handleChange('foto_3', null)}
                        >
                          <Text style={styles.removePhotoText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addPhotoButton}
                        onPress={() => showPhotoOptions('foto_3')}
                      >
                        <Text style={styles.addPhotoText}>+ Tambah</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.submitButtonContainer}>
            <Button
              title={isEditMode ? 'Perbarui Aktivitas' : 'Tambah Aktivitas'}
              onPress={handleSubmit}
              isLoading={isSubmitting}
              style={styles.submitButton}
            />
            
            <Button
              title="Batal"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  photoSection: {
    marginTop: 24,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  managePhotosButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  managePhotosText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  existingPhotos: {
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  noPhotosText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  newPhotos: {
    marginBottom: 16,
  },
  photoHelpText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: '31%',
    marginBottom: 16,
  },
  photoLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  addPhotoButton: {
    backgroundColor: '#f0f0f0',
    height: 80,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    color: '#2E86DE',
    fontWeight: '500',
  },
  selectedPhotoContainer: {
    position: 'relative',
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
  },
  selectedPhoto: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonContainer: {
    marginTop: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
  },
  cancelButtonText: {
    color: '#2E86DE',
  },
});

export default AktivitasFormScreen;