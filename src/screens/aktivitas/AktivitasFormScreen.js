// src/screens/aktivitas/AktivitasFormScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  createAktivitas, 
  updateAktivitas, 
  fetchAktivitasById,
  resetAktivitasState,
  fetchKelompokList,
  clearSelectedAktivitas
} from '../../redux/slices/aktivitasSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import DropdownSelect from '../../components/DropdownSelect';
import LoadingOverlay from '../../components/LoadingOverlay';
import DateTimePicker from '@react-native-community/datetimepicker';

const AktivitasFormScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const isEditMode = !!id;
  
  const dispatch = useAppDispatch();
  const { 
    selectedAktivitas, 
    isLoading, 
    isLoadingDetail,
    error, 
    createSuccess,
    updateSuccess,
    kelompokList,
    isLoadingKelompok
  } = useAppSelector((state) => state.aktivitas);
  
  // Form state
  const [jenis, setJenis] = useState('Kegiatan');
  const [tanggal, setTanggal] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [materi, setMateri] = useState('');
  const [level, setLevel] = useState('');
  const [kelompok, setKelompok] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Format the date to display
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tanggal;
    setShowDatePicker(Platform.OS === 'ios');
    setTanggal(currentDate);
  };
  
  // Fetch data on initial load
  useEffect(() => {
    dispatch(fetchKelompokList());
    
    if (isEditMode) {
      dispatch(fetchAktivitasById(id));
    } else {
      dispatch(clearSelectedAktivitas());
    }
    
    return () => {
      dispatch(resetAktivitasState());
    };
  }, [dispatch, id, isEditMode]);
  
  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditMode && selectedAktivitas) {
      setJenis(selectedAktivitas.jenis_kegiatan || 'Kegiatan');
      
      if (selectedAktivitas.tanggal) {
        setTanggal(new Date(selectedAktivitas.tanggal));
      }
      
      setMateri(selectedAktivitas.materi || '');
      setLevel(selectedAktivitas.level || '');
      setKelompok(selectedAktivitas.nama_kelompok || '');
    }
  }, [isEditMode, selectedAktivitas]);
  
  // Handle success responses
  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Sukses', 'Aktivitas berhasil ditambahkan');
      navigation.goBack();
    }
    
    if (updateSuccess) {
      Alert.alert('Sukses', 'Aktivitas berhasil diperbarui');
      navigation.goBack();
    }
  }, [createSuccess, updateSuccess, navigation]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetAktivitasState());
    }
  }, [error, dispatch]);
  
  // Transform kelompok list for dropdown
  const kelompokOptions = kelompokList.map(item => ({
    label: item.nama,
    value: item.nama
  }));
  
  // Level options
  const levelOptions = [
    { label: 'SD', value: 'SD' },
    { label: 'SMP', value: 'SMP' },
    { label: 'SMA', value: 'SMA' }
  ];
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }
    
    if (!materi.trim()) {
      newErrors.materi = 'Materi/Nama aktivitas wajib diisi';
    }
    
    if (jenis === 'Bimbel') {
      if (!level) {
        newErrors.level = 'Level wajib diisi';
      }
      
      if (!kelompok) {
        newErrors.kelompok = 'Kelompok wajib diisi';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    const aktivitasData = {
      jenis_kegiatan: jenis,
      tanggal: tanggal.toISOString().split('T')[0], // Format as YYYY-MM-DD
      materi
    };
    
    if (jenis === 'Bimbel') {
      aktivitasData.level = level;
      aktivitasData.nama_kelompok = kelompok;
    }
    
    if (isEditMode) {
      dispatch(updateAktivitas({ id, aktivitasData }));
    } else {
      dispatch(createAktivitas(aktivitasData));
    }
  };
  
  if (isLoadingDetail) {
    return <LoadingOverlay />;
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        {isLoading && <LoadingOverlay />}
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Jenis Kegiatan */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Jenis Kegiatan</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  jenis === 'Kegiatan' && styles.toggleButtonActive
                ]}
                onPress={() => setJenis('Kegiatan')}
              >
                <Text style={[
                  styles.toggleButtonText,
                  jenis === 'Kegiatan' && styles.toggleButtonTextActive
                ]}>
                  Kegiatan Umum
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  jenis === 'Bimbel' && styles.toggleButtonActive
                ]}
                onPress={() => setJenis('Bimbel')}
              >
                <Text style={[
                  styles.toggleButtonText,
                  jenis === 'Bimbel' && styles.toggleButtonTextActive
                ]}>
                  Bimbel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Tanggal */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tanggal</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(tanggal)}</Text>
            </TouchableOpacity>
            {errors.tanggal && (
              <Text style={styles.errorText}>{errors.tanggal}</Text>
            )}
            
            {showDatePicker && (
              <DateTimePicker
                value={tanggal}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
          
          {/* Materi/Nama Aktivitas */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {jenis === 'Bimbel' ? 'Materi' : 'Nama Aktivitas'}
            </Text>
            <Input
              value={materi}
              onChangeText={setMateri}
              placeholder={jenis === 'Bimbel' ? 'Masukkan materi' : 'Masukkan nama aktivitas'}
              error={errors.materi}
            />
          </View>
          
          {/* Bimbel-specific fields */}
          {jenis === 'Bimbel' && (
            <>
              {/* Level */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Level</Text>
                <DropdownSelect
                  value={level}
                  onValueChange={setLevel}
                  options={levelOptions}
                  placeholder="Pilih level"
                  error={errors.level}
                />
              </View>
              
              {/* Kelompok */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Kelompok</Text>
                <DropdownSelect
                  value={kelompok}
                  onValueChange={setKelompok}
                  options={kelompokOptions}
                  placeholder="Pilih kelompok"
                  error={errors.kelompok}
                  isLoading={isLoadingKelompok}
                />
              </View>
            </>
          )}
          
          {/* Submit Button */}
          <Button
            title={isEditMode ? 'Perbarui' : 'Simpan'}
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
          
          {/* Cancel Button */}
          <Button
            title="Batal"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  formContainer: {
    padding: 15,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  toggleButtonActive: {
    backgroundColor: '#2E86DE',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#555',
  },
  toggleButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999',
  },
  cancelButtonText: {
    color: '#555',
  },
});

export default AktivitasFormScreen;