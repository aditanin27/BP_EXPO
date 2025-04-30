import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  updateFormData, 
  nextStep,
  prevStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';

const KeluargaStepEmpatScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  // Local state for form errors
  const [errors, setErrors] = useState({});
  
  // Local state for whether the father is deceased
  const [isDeceased, setIsDeceased] = useState(false);
  
  // Check if father is deceased based on form data
  useEffect(() => {
    setIsDeceased(!!formData.ayah.tanggal_kematian);
  }, [formData.ayah.tanggal_kematian]);
  
  // Handler for updating form data
  const handleInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'ayah',
      data: { [name]: value }
    }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Toggle deceased status
  const toggleDeceasedStatus = (value) => {
    setIsDeceased(value);
    
    // If toggled off, clear death-related fields
    if (!value) {
      dispatch(updateFormData({
        section: 'ayah',
        data: { 
          tanggal_kematian: '',
          penyebab_kematian: ''
        }
      }));
    }
  };
  
  // Validate form before proceeding to next step
  const validateForm = () => {
    const newErrors = {};
    const { ayah } = formData;
    
    // Basic validation - most fields are optional for father info
    // but we'll ensure proper format where applicable
    
    // NIK validation (if provided)
    if (ayah.nik_ayah && (!/^\d+$/.test(ayah.nik_ayah) || ayah.nik_ayah.length !== 16)) {
      newErrors.nik_ayah = 'NIK harus 16 digit angka';
    }
    
    // Death date validation (if deceased is selected)
    if (isDeceased) {
      if (!ayah.tanggal_kematian) {
        newErrors.tanggal_kematian = 'Tanggal kematian wajib diisi';
      }
      
      if (!ayah.penyebab_kematian) {
        newErrors.penyebab_kematian = 'Penyebab kematian wajib diisi';
      }
    }
    
    // Check status_ortu value from keluarga section to determine if father info is required
    const { status_ortu } = formData.keluarga;
    const fatherInfoRequired = status_ortu !== 'yatim' && status_ortu !== 'yatim piatu';
    
    // If father info is required based on status_ortu
    if (fatherInfoRequired) {
      if (!ayah.nama_ayah) {
        newErrors.nama_ayah = 'Nama ayah wajib diisi';
      }
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
  
  // Income range options
  const incomeOptions = [
    { label: 'Di bawah Rp 500.000', value: 'dibawah_500k' },
    { label: 'Rp 500.000 - Rp 1.500.000', value: '500k_1500k' },
    { label: 'Rp 1.500.000 - Rp 2.500.000', value: '1500k_2500k' },
    { label: 'Rp 2.500.000 - Rp 3.500.000', value: '2500k_3500k' },
    { label: 'Rp 3.500.000 - Rp 5.000.000', value: '3500k_5000k' },
    { label: 'Rp 5.000.000 - Rp 7.000.000', value: '5000k_7000k' },
    { label: 'Rp 7.000.000 - Rp 10.000.000', value: '7000k_10000k' },
    { label: 'Di atas Rp 10.000.000', value: 'diatas_10000k' },
  ];
  
  // Religion options
  const religionOptions = [
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Budha', value: 'Budha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  // Check if father info is needed based on status_ortu
  const { status_ortu } = formData.keluarga;
  const isFatherInfoNeeded = status_ortu !== 'yatim' && status_ortu !== 'yatim piatu';
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Ayah</Text>
      
      {!isFatherInfoNeeded ? (
        <View style={styles.notRequiredContainer}>
          <Text style={styles.notRequiredText}>
            Data ayah tidak diperlukan karena status orangtua {status_ortu}.
          </Text>
          <Text style={styles.notRequiredSubtext}>
            Anda dapat langsung melanjutkan ke langkah berikutnya.
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Data Diri</Text>
          
          <Input
            label="NIK"
            value={formData.ayah.nik_ayah}
            onChangeText={(value) => handleInputChange('nik_ayah', value)}
            placeholder="Masukkan NIK ayah"
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik_ayah}
          />
          
          <Input
            label="Nama Ayah *"
            value={formData.ayah.nama_ayah}
            onChangeText={(value) => handleInputChange('nama_ayah', value)}
            placeholder="Masukkan nama lengkap ayah"
            error={errors.nama_ayah}
          />
          
          <DropdownSelect
            label="Agama"
            value={formData.ayah.agama_ayah}
            options={religionOptions}
            onValueChange={(value) => handleInputChange('agama_ayah', value)}
            placeholder="Pilih agama"
            error={errors.agama_ayah}
          />
          
          <Input
            label="Tempat Lahir"
            value={formData.ayah.tempat_lahir_ayah}
            onChangeText={(value) => handleInputChange('tempat_lahir_ayah', value)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir_ayah}
          />
          
          <Input
            label="Tanggal Lahir"
            value={formData.ayah.tanggal_lahir_ayah}
            onChangeText={(value) => handleInputChange('tanggal_lahir_ayah', value)}
            placeholder="Format: YYYY-MM-DD"
            error={errors.tanggal_lahir_ayah}
          />
          
          {/* Address & Income */}
          <Text style={styles.sectionTitle}>Alamat & Penghasilan</Text>
          
          <Input
            label="Alamat"
            value={formData.ayah.alamat_ayah}
            onChangeText={(value) => handleInputChange('alamat_ayah', value)}
            placeholder="Masukkan alamat lengkap"
            multiline={true}
            numberOfLines={3}
            error={errors.alamat_ayah}
          />
          
          <DropdownSelect
            label="Penghasilan"
            value={formData.ayah.penghasilan_ayah}
            options={incomeOptions}
            onValueChange={(value) => handleInputChange('penghasilan_ayah', value)}
            placeholder="Pilih rentang penghasilan"
            error={errors.penghasilan_ayah}
          />
          
          {/* Death Information */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>Sudah Meninggal?</Text>
            <Switch
              value={isDeceased}
              onValueChange={toggleDeceasedStatus}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDeceased ? '#2E86DE' : '#f4f3f4'}
            />
          </View>
          
          {isDeceased && (
            <View style={styles.conditionalSection}>
              <Input
                label="Tanggal Kematian *"
                value={formData.ayah.tanggal_kematian_ayah}
                onChangeText={(value) => handleInputChange('tanggal_kematian_ayah', value)}
                placeholder="Format: YYYY-MM-DD"
                error={errors.tanggal_kematian_ayah}
              />
              
              <Input
                label="Penyebab Kematian *"
                value={formData.ayah.penyebab_kematian_ayah}
                onChangeText={(value) => handleInputChange('penyebab_kematian_ayah', value)}
                placeholder="Masukkan penyebab kematian"
                error={errors.penyebab_kematian_ayah}
              />
            </View>
          )}
        </View>
      )}
      
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
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  conditionalSection: {
    borderLeftWidth: 2,
    borderLeftColor: '#2E86DE',
    paddingLeft: 10,
    marginBottom: 15,
  },
  notRequiredContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cce5ff',
  },
  notRequiredText: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  notRequiredSubtext: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default KeluargaStepEmpatScreen;