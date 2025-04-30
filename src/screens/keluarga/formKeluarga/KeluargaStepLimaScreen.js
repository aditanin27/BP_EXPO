import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
  TouchableOpacity
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

const KeluargaStepLimaScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  // Local state for form errors
  const [errors, setErrors] = useState({});
  
  // Local states for whether the mother is deceased and guardian is needed
  const [isMotherDeceased, setIsMotherDeceased] = useState(false);
  const [showGuardianSection, setShowGuardianSection] = useState(false);
  
  // Check initial states based on form data
  useEffect(() => {
    // Set mother deceased status
    setIsMotherDeceased(!!formData.ibu.tanggal_kematian_ibu);
    
    // Determine if guardian section should be shown
    const { status_ortu } = formData.keluarga;
    const { tinggal_bersama } = formData.anak;
    
    // Show guardian section if:
    // 1. Child lives with guardian (not parents)
    // 2. Status is yatim piatu (both parents deceased)
    // 3. Status is yatim and child lives with mother but mother is also deceased
    const needsGuardian = tinggal_bersama === 'Wali' || 
                         status_ortu === 'yatim piatu' ||
                         (status_ortu === 'yatim' && 
                          tinggal_bersama === 'Ibu' && 
                          !!formData.ibu.tanggal_kematian_ibu);
    
    setShowGuardianSection(needsGuardian);
  }, [
    formData.ibu.tanggal_kematian_ibu, 
    formData.keluarga.status_ortu, 
    formData.anak.tinggal_bersama
  ]);
  
  // Handler for updating mother data
  const handleMotherInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'ibu',
      data: { [name]: value }
    }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handler for updating guardian data
  const handleGuardianInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'wali',
      data: { [name]: value }
    }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Toggle mother deceased status
  const toggleMotherDeceasedStatus = (value) => {
    setIsMotherDeceased(value);
    
    // If toggled off, clear death-related fields
    if (!value) {
      dispatch(updateFormData({
        section: 'ibu',
        data: { 
          tanggal_kematian_ibu: '',
          penyebab_kematian_ibu: ''
        }
      }));
    }
    
    // Check if we need to show guardian section
    const { status_ortu } = formData.keluarga;
    const { tinggal_bersama } = formData.anak;
    
    if (value && (status_ortu === 'piatu' || tinggal_bersama === 'Ibu')) {
      setShowGuardianSection(true);
    }
  };
  
  // Toggle guardian section
  const toggleGuardianSection = () => {
    setShowGuardianSection(prev => !prev);
    
    // If toggled off, clear guardian fields
    if (showGuardianSection) {
      dispatch(updateFormData({
        section: 'wali',
        data: {
          nik_wali: '',
          nama_wali: '',
          agama_wali: 'Islam',
          tempat_lahir_wali: '',
          tanggal_lahir_wali: '',
          alamat_wali: '',
          penghasilan_wali: '',
          hub_kerabat_wali: ''
        }
      }));
    }
  };
  
  // Validate form before proceeding to next step
  const validateForm = () => {
    const newErrors = {};
    const { ibu, wali } = formData;
    
    // Check status_ortu value from keluarga section to determine what's required
    const { status_ortu } = formData.keluarga;
    const { tinggal_bersama } = formData.anak;
    
    // Determine if mother info is required
    const motherInfoRequired = status_ortu !== 'piatu' && status_ortu !== 'yatim piatu';
    
    // Mother validation if required
    if (motherInfoRequired) {
      if (!ibu.nama_ibu) {
        newErrors.nama_ibu = 'Nama ibu wajib diisi';
      }
      
      // NIK validation (if provided)
      if (ibu.nik_ibu && (!/^\d+$/.test(ibu.nik_ibu) || ibu.nik_ibu.length !== 16)) {
        newErrors.nik_ibu = 'NIK harus 16 digit angka';
      }
      
      // Death date validation (if deceased is selected)
      if (isMotherDeceased) {
        if (!ibu.tanggal_kematian_ibu) {
          newErrors.tanggal_kematian_ibu = 'Tanggal kematian wajib diisi';
        }
        
        if (!ibu.penyebab_kematian_ibu) {
          newErrors.penyebab_kematian_ibu = 'Penyebab kematian wajib diisi';
        }
      }
    }
    
    // Guardian validation if shown
    if (showGuardianSection) {
      if (!wali.nama_wali) {
        newErrors.nama_wali = 'Nama wali wajib diisi';
      }
      
      if (!wali.hub_kerabat_wali) {
        newErrors.hub_kerabat_wali = 'Hubungan kerabat wajib dipilih';
      }
      
      // NIK validation (if provided)
      if (wali.nik_wali && (!/^\d+$/.test(wali.nik_wali) || wali.nik_wali.length !== 16)) {
        newErrors.nik_wali = 'NIK harus 16 digit angka';
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
  
  // Guardian relationship options
  const relationshipOptions = [
    { label: 'Kakak', value: 'Kakak' },
    { label: 'Saudara dari Ayah', value: 'Saudara dari Ayah' },
    { label: 'Saudara dari Ibu', value: 'Saudara dari Ibu' },
    { label: 'Tidak Ada Hubungan Keluarga', value: 'Tidak Ada Hubungan Keluarga' },
  ];
  
  // Check if mother info is needed based on status_ortu
  const { status_ortu } = formData.keluarga;
  const isMotherInfoNeeded = status_ortu !== 'piatu' && status_ortu !== 'yatim piatu';
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Ibu & Wali</Text>
      
      {/* Mother Section */}
      {!isMotherInfoNeeded ? (
        <View style={styles.notRequiredContainer}>
          <Text style={styles.notRequiredText}>
            Data ibu tidak diperlukan karena status orangtua {status_ortu}.
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Data Ibu</Text>
          
          {/* Basic Information */}
          <Input
            label="NIK"
            value={formData.ibu.nik_ibu}
            onChangeText={(value) => handleMotherInputChange('nik_ibu', value)}
            placeholder="Masukkan NIK ibu"
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik_ibu}
          />
          
          <Input
            label="Nama Ibu *"
            value={formData.ibu.nama_ibu}
            onChangeText={(value) => handleMotherInputChange('nama_ibu', value)}
            placeholder="Masukkan nama lengkap ibu"
            error={errors.nama_ibu}
          />
          
          <DropdownSelect
            label="Agama"
            value={formData.ibu.agama_ibu}
            options={religionOptions}
            onValueChange={(value) => handleMotherInputChange('agama_ibu', value)}
            placeholder="Pilih agama"
            error={errors.agama_ibu}
          />
          
          <Input
            label="Tempat Lahir"
            value={formData.ibu.tempat_lahir_ibu}
            onChangeText={(value) => handleMotherInputChange('tempat_lahir_ibu', value)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir_ibu}
          />
          
          <Input
            label="Tanggal Lahir"
            value={formData.ibu.tanggal_lahir_ibu}
            onChangeText={(value) => handleMotherInputChange('tanggal_lahir_ibu', value)}
            placeholder="Format: YYYY-MM-DD"
            error={errors.tanggal_lahir_ibu}
          />
          
          {/* Address & Income */}
          <Input
            label="Alamat"
            value={formData.ibu.alamat_ibu}
            onChangeText={(value) => handleMotherInputChange('alamat_ibu', value)}
            placeholder="Masukkan alamat lengkap"
            multiline={true}
            numberOfLines={3}
            error={errors.alamat_ibu}
          />
          
          <DropdownSelect
            label="Penghasilan"
            value={formData.ibu.penghasilan_ibu}
            options={incomeOptions}
            onValueChange={(value) => handleMotherInputChange('penghasilan_ibu', value)}
            placeholder="Pilih rentang penghasilan"
            error={errors.penghasilan_ibu}
          />
          
          {/* Death Information */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>Sudah Meninggal?</Text>
            <Switch
              value={isMotherDeceased}
              onValueChange={toggleMotherDeceasedStatus}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isMotherDeceased ? '#2E86DE' : '#f4f3f4'}
            />
          </View>
          
          {isMotherDeceased && (
            <View style={styles.conditionalSection}>
              <Input
                label="Tanggal Kematian *"
                value={formData.ibu.tanggal_kematian_ibu}
                onChangeText={(value) => handleMotherInputChange('tanggal_kematian_ibu', value)}
                placeholder="Format: YYYY-MM-DD"
                error={errors.tanggal_kematian_ibu}
              />
              
              <Input
                label="Penyebab Kematian *"
                value={formData.ibu.penyebab_kematian_ibu}
                onChangeText={(value) => handleMotherInputChange('penyebab_kematian_ibu', value)}
                placeholder="Masukkan penyebab kematian"
                error={errors.penyebab_kematian_ibu}
              />
            </View>
          )}
        </View>
      )}
      
      {/* Guardian Section */}
      {showGuardianSection ? (
        <View style={styles.formContainer}>
          <View style={styles.guardianHeaderContainer}>
            <Text style={styles.sectionTitle}>Data Wali</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={toggleGuardianSection}
            >
              <Text style={styles.removeButtonText}>Hapus Data Wali</Text>
            </TouchableOpacity>
          </View>
          
          {/* Basic Information */}
          <Input
            label="NIK"
            value={formData.wali.nik_wali}
            onChangeText={(value) => handleGuardianInputChange('nik_wali', value)}
            placeholder="Masukkan NIK wali"
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik_wali}
          />
          
          <Input
            label="Nama Wali *"
            value={formData.wali.nama_wali}
            onChangeText={(value) => handleGuardianInputChange('nama_wali', value)}
            placeholder="Masukkan nama lengkap wali"
            error={errors.nama_wali}
          />
          
          <DropdownSelect
            label="Hubungan Kerabat *"
            value={formData.wali.hub_kerabat_wali}
            options={relationshipOptions}
            onValueChange={(value) => handleGuardianInputChange('hub_kerabat_wali', value)}
            placeholder="Pilih hubungan kerabat"
            error={errors.hub_kerabat_wali}
          />
          
          <DropdownSelect
            label="Agama"
            value={formData.wali.agama_wali}
            options={religionOptions}
            onValueChange={(value) => handleGuardianInputChange('agama_wali', value)}
            placeholder="Pilih agama"
            error={errors.agama_wali}
          />
          
          <Input
            label="Tempat Lahir"
            value={formData.wali.tempat_lahir_wali}
            onChangeText={(value) => handleGuardianInputChange('tempat_lahir_wali', value)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir_wali}
          />
          
          <Input
            label="Tanggal Lahir"
            value={formData.wali.tanggal_lahir_wali}
            onChangeText={(value) => handleGuardianInputChange('tanggal_lahir_wali', value)}
            placeholder="Format: YYYY-MM-DD"
            error={errors.tanggal_lahir_wali}
          />
          
          {/* Address & Income */}
          <Input
            label="Alamat"
            value={formData.wali.alamat_wali}
            onChangeText={(value) => handleGuardianInputChange('alamat_wali', value)}
            placeholder="Masukkan alamat lengkap"
            multiline={true}
            numberOfLines={3}
            error={errors.alamat_wali}
          />
          
          <DropdownSelect
            label="Penghasilan"
            value={formData.wali.penghasilan_wali}
            options={incomeOptions}
            onValueChange={(value) => handleGuardianInputChange('penghasilan_wali', value)}
            placeholder="Pilih rentang penghasilan"
            error={errors.penghasilan_wali}
          />
        </View>
      ) : (
        // Button to add guardian info when not shown initially
        <TouchableOpacity 
          style={styles.addGuardianButton}
          onPress={toggleGuardianSection}
        >
          <Text style={styles.addGuardianText}>+ Tambahkan Data Wali</Text>
        </TouchableOpacity>
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
  addGuardianButton: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2E86DE',
  },
  addGuardianText: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: '600',
  },
  guardianHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#ffeeee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default KeluargaStepLimaScreen;