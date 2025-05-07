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
  ActivityIndicator
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
import FotoUploader from '../../components/FotoUploader';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

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
    foto_3: null,
    hapus_foto_1: false,
    hapus_foto_2: false,
    hapus_foto_3: false,
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
        // Don't set foto fields here, they will be displayed separately
        hapus_foto_1: false,
        hapus_foto_2: false,
        hapus_foto_3: false,
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
  
  // Handle photo selection
  const handleSelectPhoto = (field, photo) => {
    handleChange(field, photo);
    
    // If user selects a new photo, don't delete it
    if (field === 'foto_1') handleChange('hapus_foto_1', false);
    if (field === 'foto_2') handleChange('hapus_foto_2', false);
    if (field === 'foto_3') handleChange('hapus_foto_3', false);
  };
  
  // Handle photo removal
  const handleRemovePhoto = (field) => {
    // For edit mode, mark for deletion on the server
    if (isEditMode) {
      if (field === 'foto_1') handleChange('hapus_foto_1', true);
      if (field === 'foto_2') handleChange('hapus_foto_2', true);
      if (field === 'foto_3') handleChange('hapus_foto_3', true);
    }
    
    // Always clear the local state
    handleChange(field, null);
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
          
          {/* Photos */}
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Foto Aktivitas</Text>
            
            <FotoUploader
              title="Foto 1"
              imageUri={isEditMode && detail ? detail.foto_1_url : formData.foto_1?.uri}
              onSelectImage={(photo) => handleSelectPhoto('foto_1', photo)}
              onRemoveImage={() => handleRemovePhoto('foto_1')}
              isUploading={isLoading}
            />
            
            <FotoUploader
              title="Foto 2"
              imageUri={isEditMode && detail ? detail.foto_2_url : formData.foto_2?.uri}
              onSelectImage={(photo) => handleSelectPhoto('foto_2', photo)}
              onRemoveImage={() => handleRemovePhoto('foto_2')}
              isUploading={isLoading}
            />
            
            <FotoUploader
              title="Foto 3"
              imageUri={isEditMode && detail ? detail.foto_3_url : formData.foto_3?.uri}
              onSelectImage={(photo) => handleSelectPhoto('foto_3', photo)}
              onRemoveImage={() => handleRemovePhoto('foto_3')}
              isUploading={isLoading}
            />
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
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  submitButtonContainer: {
    marginTop: 16,
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