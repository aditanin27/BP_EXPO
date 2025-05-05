import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchTutorById, 
  createTutor, 
  updateTutor, 
  resetTutorState 
} from '../../redux/slices/tutorSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import LoadingOverlay from '../../components/LoadingOverlay';

const FormTutorScreen = ({ route, navigation }) => {
  const { id_tutor } = route.params || {};
  const isEditing = !!id_tutor;
  
  const dispatch = useAppDispatch();
  const { 
    selectedTutor, 
    isLoading, 
    error, 
    createSuccess, 
    updateSuccess 
  } = useAppSelector(state => state.tutor);
  
  const [formData, setFormData] = useState({
    nama: '',
    pendidikan: '',
    alamat: '',
    email: '',
    no_hp: '',
    maple: '',
    foto: null
  });
  
  const [errors, setErrors] = useState({});
  const [imageUri, setImageUri] = useState(null);
  
  // Fetch tutor data if editing
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchTutorById(id_tutor));
    }
    
    return () => {
      dispatch(resetTutorState());
    };
  }, [dispatch, isEditing, id_tutor]);
  
  // Populate form when tutor data is loaded
  useEffect(() => {
    if (isEditing && selectedTutor) {
      setFormData({
        nama: selectedTutor.nama || '',
        pendidikan: selectedTutor.pendidikan || '',
        alamat: selectedTutor.alamat || '',
        email: selectedTutor.email || '',
        no_hp: selectedTutor.no_hp || '',
        maple: selectedTutor.maple || '',
        foto: null
      });
      
      if (selectedTutor.foto_url) {
        setImageUri(selectedTutor.foto_url);
      }
    }
  }, [selectedTutor, isEditing]);
  
  // Handle success responses
  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Sukses', 'Tutor berhasil ditambahkan');
      navigation.goBack();
    }
    
    if (updateSuccess) {
      Alert.alert('Sukses', 'Tutor berhasil diperbarui');
      navigation.goBack();
    }
  }, [createSuccess, updateSuccess, navigation]);
  
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleImageSelected = (image) => {
    setFormData(prev => ({
      ...prev,
      foto: image
    }));
    setImageUri(image.uri);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }
    
    if (!formData.pendidikan.trim()) {
      newErrors.pendidikan = 'Pendidikan wajib diisi';
    }
    
    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.no_hp.trim()) {
      newErrors.no_hp = 'Nomor HP wajib diisi';
    }
    
    if (!formData.maple.trim()) {
      newErrors.maple = 'Mata pelajaran wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Create a copy of the form data that doesn't include foto if not changed
      const dataToSubmit = { ...formData };
      
      // If we're editing and no new photo was selected, don't send foto field at all
      if (isEditing && !dataToSubmit.foto) {
        delete dataToSubmit.foto;
      }
      
      if (isEditing) {
        dispatch(updateTutor({ id: id_tutor, tutorData: dataToSubmit }));
      } else {
        dispatch(createTutor(dataToSubmit));
      }
    }
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  if (isLoading && isEditing && !selectedTutor) {
    return <LoadingOverlay />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Tutor' : 'Tambah Tutor Baru'}
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <ImagePickerComponent
            imageUri={imageUri}
            onImageSelected={handleImageSelected}
            label="Foto Tutor"
            size="large"
            isLoading={isLoading}
          />
          
          <Input
            label="Nama Lengkap *"
            value={formData.nama}
            onChangeText={(value) => handleInputChange('nama', value)}
            placeholder="Masukkan nama lengkap"
            error={errors.nama}
          />
          
          <Input
            label="Pendidikan *"
            value={formData.pendidikan}
            onChangeText={(value) => handleInputChange('pendidikan', value)}
            placeholder="Contoh: S1 Pendidikan Matematika"
            error={errors.pendidikan}
          />
          
          <Input
            label="Mata Pelajaran *"
            value={formData.maple}
            onChangeText={(value) => handleInputChange('maple', value)}
            placeholder="Contoh: Matematika"
            error={errors.maple}
          />
          
          <Input
            label="Email *"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Masukkan email"
            keyboardType="email-address"
            error={errors.email}
          />
          
          <Input
            label="Nomor HP *"
            value={formData.no_hp}
            onChangeText={(value) => handleInputChange('no_hp', value)}
            placeholder="Masukkan nomor HP"
            keyboardType="phone-pad"
            error={errors.no_hp}
          />
          
          <Input
            label="Alamat *"
            value={formData.alamat}
            onChangeText={(value) => handleInputChange('alamat', value)}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={3}
            style={styles.textArea}
            error={errors.alamat}
          />
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={isEditing ? "Simpan Perubahan" : "Tambah Tutor"}
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
          
          <Button
            title="Batal"
            onPress={handleBack}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorContainer: {
    backgroundColor: '#fff8f8',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E86DE',
  },
  cancelButtonText: {
    color: '#2E86DE',
  },
});

export default FormTutorScreen;