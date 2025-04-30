import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  updateFormData, 
  nextStep,
  prevStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FormButtons from '../../../components/FormButtons';
import * as ImagePicker from 'expo-image-picker';

const KeluargaStepTigaScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  // Local state for form errors
  const [errors, setErrors] = useState({});
  
  // Handler for updating form data
  const handleInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'anak',
      data: { [name]: value }
    }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handler for image selection
  const handleImageSelected = async (imageData) => {
    dispatch(updateFormData({
      section: 'anak',
      data: { foto: imageData }
    }));
  };
  
  // Validate form before proceeding to next step
  const validateForm = () => {
    const newErrors = {};
    const { anak } = formData;
    
    // Required fields validation
    if (!anak.nik_anak.trim()) {
      newErrors.nik_anak = 'NIK anak wajib diisi';
    } else if (!/^\d+$/.test(anak.nik_anak)) {
      newErrors.nik_anak = 'NIK anak harus berupa angka';
    } else if (anak.nik_anak.length !== 16) {
      newErrors.nik_anak = 'NIK anak harus 16 digit';
    }
    
    if (!anak.anak_ke.trim()) {
      newErrors.anak_ke = 'Anak ke wajib diisi';
    } else if (isNaN(Number(anak.anak_ke)) || Number(anak.anak_ke) < 1) {
      newErrors.anak_ke = 'Anak ke harus berupa angka positif';
    }
    
    if (!anak.dari_bersaudara.trim()) {
      newErrors.dari_bersaudara = 'Jumlah saudara wajib diisi';
    } else if (isNaN(Number(anak.dari_bersaudara)) || Number(anak.dari_bersaudara) < 1) {
      newErrors.dari_bersaudara = 'Jumlah saudara harus berupa angka positif';
    }
    
    if (!anak.nick_name.trim()) {
      newErrors.nick_name = 'Nama panggilan wajib diisi';
    }
    
    if (!anak.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    }
    
    if (!anak.tempat_lahir.trim()) {
      newErrors.tempat_lahir = 'Tempat lahir wajib diisi';
    }
    
    if (!anak.tanggal_lahir.trim()) {
      newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    }
    
    if (!anak.tinggal_bersama) {
      newErrors.tinggal_bersama = 'Tinggal bersama wajib dipilih';
    }
    
    if (!anak.transportasi.trim()) {
      newErrors.transportasi = 'Transportasi wajib diisi';
    }
    
    // Optional fields with format validation
    if (anak.jarak_rumah && isNaN(Number(anak.jarak_rumah))) {
      newErrors.jarak_rumah = 'Jarak rumah harus berupa angka';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handler for next button
  const handleNext = () => {
    if (validateForm()) {
      dispatch(nextStep());
    }
  };
  
  // Handler for back button
  const handleBack = () => {
    dispatch(prevStep());
  };
  
  // Options for dropdowns
  const genderOptions = [
    { label: 'Laki-laki', value: 'L' },
    { label: 'Perempuan', value: 'P' },
  ];
  
  const religionOptions = [
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Budha', value: 'Budha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  const livingWithOptions = [
    { label: 'Ayah', value: 'Ayah' },
    { label: 'Ibu', value: 'Ibu' },
    { label: 'Wali', value: 'Wali' },
  ];
  
  const childTypeOptions = [
    { label: 'BPCB', value: 'BPCB' },
    { label: 'NPB', value: 'NPB' },
  ];
  
  const hafalanOptions = [
    { label: 'Tahfidz', value: 'Tahfidz' },
    { label: 'Non-Tahfidz', value: 'Non-Tahfidz' },
  ];
  
  const transportOptions = [
    { label: 'Jalan Kaki', value: 'Jalan Kaki' },
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Sepeda Motor', value: 'Sepeda Motor' },
    { label: 'Angkutan Umum', value: 'Angkutan Umum' },
    { label: 'Diantar Orang Tua/Wali', value: 'Diantar Orang Tua/Wali' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Anak</Text>
      
      <View style={styles.formContainer}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Foto Anak</Text>
          <ImagePickerComponent
            imageUri={formData.anak.foto ? formData.anak.foto.uri : null}
            onImageSelected={handleImageSelected}
          />
        </View>
        
        {/* Basic Identity */}
        <Text style={styles.sectionTitle}>Identitas Dasar</Text>
        <Input
          label="NIK *"
          value={formData.anak.nik_anak}
          onChangeText={(value) => handleInputChange('nik_anak', value)}
          placeholder="Masukkan NIK anak"
          keyboardType="number-pad"
          maxLength={16}
          error={errors.nik_anak}
        />
        
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Input
              label="Anak ke *"
              value={formData.anak.anak_ke}
              onChangeText={(value) => handleInputChange('anak_ke', value)}
              placeholder="Contoh: 2"
              keyboardType="number-pad"
              error={errors.anak_ke}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Dari Bersaudara *"
              value={formData.anak.dari_bersaudara}
              onChangeText={(value) => handleInputChange('dari_bersaudara', value)}
              placeholder="Contoh: 3"
              keyboardType="number-pad"
              error={errors.dari_bersaudara}
            />
          </View>
        </View>
        
        <Input
          label="Nama Panggilan *"
          value={formData.anak.nick_name}
          onChangeText={(value) => handleInputChange('nick_name', value)}
          placeholder="Masukkan nama panggilan"
          error={errors.nick_name}
        />
        
        <Input
          label="Nama Lengkap *"
          value={formData.anak.full_name}
          onChangeText={(value) => handleInputChange('full_name', value)}
          placeholder="Masukkan nama lengkap"
          error={errors.full_name}
        />
        
        <DropdownSelect
          label="Agama *"
          value={formData.anak.agama}
          options={religionOptions}
          onValueChange={(value) => handleInputChange('agama', value)}
          placeholder="Pilih agama"
          error={errors.agama}
        />
        
        <Input
          label="Tempat Lahir *"
          value={formData.anak.tempat_lahir}
          onChangeText={(value) => handleInputChange('tempat_lahir', value)}
          placeholder="Masukkan tempat lahir"
          error={errors.tempat_lahir}
        />
        
        <Input
          label="Tanggal Lahir *"
          value={formData.anak.tanggal_lahir}
          onChangeText={(value) => handleInputChange('tanggal_lahir', value)}
          placeholder="Format: YYYY-MM-DD"
          error={errors.tanggal_lahir}
        />
        
        <DropdownSelect
          label="Jenis Kelamin *"
          value={formData.anak.jenis_kelamin}
          options={genderOptions}
          onValueChange={(value) => handleInputChange('jenis_kelamin', value)}
          placeholder="Pilih jenis kelamin"
          error={errors.jenis_kelamin}
        />
        
        <DropdownSelect
          label="Tinggal Bersama *"
          value={formData.anak.tinggal_bersama}
          options={livingWithOptions}
          onValueChange={(value) => handleInputChange('tinggal_bersama', value)}
          placeholder="Pilih tinggal bersama"
          error={errors.tinggal_bersama}
        />
        
        {/* Additional Information */}
        <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
        
        <DropdownSelect
          label="Jenis Anak Binaan *"
          value={formData.anak.jenis_anak_binaan}
          options={childTypeOptions}
          onValueChange={(value) => handleInputChange('jenis_anak_binaan', value)}
          placeholder="Pilih jenis anak binaan"
          error={errors.jenis_anak_binaan}
        />
        
        <DropdownSelect
          label="Hafalan *"
          value={formData.anak.hafalan}
          options={hafalanOptions}
          onValueChange={(value) => handleInputChange('hafalan', value)}
          placeholder="Pilih jenis hafalan"
          error={errors.hafalan}
        />
        
        <Input
          label="Pelajaran Favorit"
          value={formData.anak.pelajaran_favorit}
          onChangeText={(value) => handleInputChange('pelajaran_favorit', value)}
          placeholder="Masukkan pelajaran favorit"
          error={errors.pelajaran_favorit}
        />
        
        <Input
          label="Hobi"
          value={formData.anak.hobi}
          onChangeText={(value) => handleInputChange('hobi', value)}
          placeholder="Masukkan hobi"
          error={errors.hobi}
        />
        
        <Input
          label="Prestasi"
          value={formData.anak.prestasi}
          onChangeText={(value) => handleInputChange('prestasi', value)}
          placeholder="Masukkan prestasi"
          error={errors.prestasi}
        />
        
        <Input
          label="Jarak Rumah (km)"
          value={formData.anak.jarak_rumah}
          onChangeText={(value) => handleInputChange('jarak_rumah', value)}
          placeholder="Contoh: 2.5"
          keyboardType="numeric"
          error={errors.jarak_rumah}
        />
        
        <DropdownSelect
          label="Transportasi *"
          value={formData.anak.transportasi}
          options={transportOptions}
          onValueChange={(value) => handleInputChange('transportasi', value)}
          placeholder="Pilih transportasi"
          error={errors.transportasi}
        />
      </View>
      
      {/* Navigation Buttons */}
      <FormButtons
        onNext={handleNext}
        onBack={handleBack}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
    textAlign: 'center',
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
});

export default KeluargaStepTigaScreen;