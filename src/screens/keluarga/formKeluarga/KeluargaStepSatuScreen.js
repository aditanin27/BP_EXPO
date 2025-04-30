import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
  ActivityIndicator
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  updateFormData, 
  nextStep,
  fetchDropdownData,
  fetchWilbinByKacab,
  fetchShelterByWilbin
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';

const KeluargaStepSatuScreen = () => {
  const dispatch = useAppDispatch();
  const { 
    formData, 
    dropdowns, 
    wilbinOptions, 
    shelterOptions,
    isLoadingDropdowns 
  } = useAppSelector((state) => state.keluarga);
  
  // Local state for form errors
  const [errors, setErrors] = useState({});
  
  // Fetch dropdown data on component mount
  useEffect(() => {
    dispatch(fetchDropdownData());
  }, [dispatch]);
  
  // Effect for fetching wilbin options when kacab changes
  useEffect(() => {
    if (formData.keluarga.id_kacab) {
      dispatch(fetchWilbinByKacab(formData.keluarga.id_kacab));
    }
  }, [dispatch, formData.keluarga.id_kacab]);
  
  // Effect for fetching shelter options when wilbin changes
  useEffect(() => {
    if (formData.keluarga.id_wilbin) {
      dispatch(fetchShelterByWilbin(formData.keluarga.id_wilbin));
    }
  }, [dispatch, formData.keluarga.id_wilbin]);
  
  // Handler for updating form data
  const handleInputChange = (name, value) => {
    // Reset dependant fields when parent field changes
    if (name === 'id_kacab') {
      dispatch(updateFormData({
        section: 'keluarga',
        data: { 
          [name]: value,
          id_wilbin: '',
          id_shelter: ''
        }
      }));
    } else if (name === 'id_wilbin') {
      dispatch(updateFormData({
        section: 'keluarga',
        data: { 
          [name]: value,
          id_shelter: ''
        }
      }));
    } else {
      dispatch(updateFormData({
        section: 'keluarga',
        data: { [name]: value }
      }));
    }
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Toggle bank account section
  const toggleBankAccount = (value) => {
    const bankChoice = value ? 'yes' : 'no';
    dispatch(updateFormData({
      section: 'keluarga',
      data: { 
        bank_choice: bankChoice,
        id_bank: value ? formData.keluarga.id_bank : '',
        no_rek: value ? formData.keluarga.no_rek : '',
        an_rek: value ? formData.keluarga.an_rek : '',
      }
    }));
  };
  
  // Toggle phone section
  const togglePhone = (value) => {
    const telpChoice = value ? 'yes' : 'no';
    dispatch(updateFormData({
      section: 'keluarga',
      data: { 
        telp_choice: telpChoice,
        no_tlp: value ? formData.keluarga.no_tlp : '',
        an_tlp: value ? formData.keluarga.an_tlp : '',
      }
    }));
  };
  
  // Validate form before proceeding to next step
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.keluarga.no_kk.trim()) {
      newErrors.no_kk = 'Nomor KK wajib diisi';
    } else if (!/^\d+$/.test(formData.keluarga.no_kk)) {
      newErrors.no_kk = 'Nomor KK harus berupa angka';
    }
    
    if (!formData.keluarga.kepala_keluarga.trim()) {
      newErrors.kepala_keluarga = 'Nama Kepala Keluarga wajib diisi';
    }
    
    if (!formData.keluarga.status_ortu) {
      newErrors.status_ortu = 'Status Orangtua wajib dipilih';
    }
    
    if (!formData.keluarga.id_kacab) {
      newErrors.id_kacab = 'Kantor Cabang wajib dipilih';
    }
    
    if (!formData.keluarga.id_wilbin) {
      newErrors.id_wilbin = 'Wilayah Binaan wajib dipilih';
    }
    
    if (!formData.keluarga.id_shelter) {
      newErrors.id_shelter = 'Shelter wajib dipilih';
    }
    
    // Bank account validation (if enabled)
    if (formData.keluarga.bank_choice === 'yes') {
      if (!formData.keluarga.id_bank) {
        newErrors.id_bank = 'Bank wajib dipilih';
      }
      
      if (!formData.keluarga.no_rek.trim()) {
        newErrors.no_rek = 'Nomor Rekening wajib diisi';
      }
      
      if (!formData.keluarga.an_rek.trim()) {
        newErrors.an_rek = 'Nama Pemilik Rekening wajib diisi';
      }
    }
    
    // Phone validation (if enabled)
    if (formData.keluarga.telp_choice === 'yes') {
      if (!formData.keluarga.no_tlp.trim()) {
        newErrors.no_tlp = 'Nomor Telepon wajib diisi';
      }
      
      if (!formData.keluarga.an_tlp.trim()) {
        newErrors.an_tlp = 'Nama Pemilik Telepon wajib diisi';
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
  
  // Get status options
  const statusOptions = [
    { label: 'Yatim', value: 'yatim' },
    { label: 'Piatu', value: 'piatu' },
    { label: 'Yatim Piatu', value: 'yatim piatu' },
    { label: 'Dhuafa', value: 'dhuafa' },
    { label: 'Non Dhuafa', value: 'non dhuafa' },
  ];
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Keluarga</Text>
      
      {isLoadingDropdowns && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E86DE" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      )}
      
      <View style={styles.formContainer}>
        {/* Basic Family Information */}
        <Text style={styles.sectionTitle}>Data Keluarga</Text>
        
        <Input
          label="Nomor Kartu Keluarga *"
          value={formData.keluarga.no_kk}
          onChangeText={(value) => handleInputChange('no_kk', value)}
          placeholder="Masukkan nomor KK"
          keyboardType="number-pad"
          error={errors.no_kk}
        />
        
        <Input
          label="Nama Kepala Keluarga *"
          value={formData.keluarga.kepala_keluarga}
          onChangeText={(value) => handleInputChange('kepala_keluarga', value)}
          placeholder="Masukkan nama kepala keluarga"
          error={errors.kepala_keluarga}
        />
        
        <DropdownSelect
          label="Status Orangtua *"
          value={formData.keluarga.status_ortu}
          options={statusOptions}
          onValueChange={(value) => handleInputChange('status_ortu', value)}
          placeholder="Pilih status orangtua"
          error={errors.status_ortu}
        />
        
        {/* Location Information */}
        <Text style={styles.sectionTitle}>Informasi Lokasi</Text>
        
        <DropdownSelect
          label="Kantor Cabang *"
          value={formData.keluarga.id_kacab}
          options={dropdowns.kacab?.map(item => ({
            label: item.nama_kacab,
            value: item.id_kacab
          })) || []}
          onValueChange={(value) => handleInputChange('id_kacab', value)}
          placeholder="Pilih kantor cabang"
          error={errors.id_kacab}
          isLoading={isLoadingDropdowns}
          disabled={isLoadingDropdowns || !dropdowns.kacab?.length}
        />
        
        <DropdownSelect
          label="Wilayah Binaan *"
          value={formData.keluarga.id_wilbin}
          options={wilbinOptions?.map(item => ({
            label: item.nama_wilbin,
            value: item.id_wilbin
          })) || []}
          onValueChange={(value) => handleInputChange('id_wilbin', value)}
          placeholder="Pilih wilayah binaan"
          error={errors.id_wilbin}
          isLoading={isLoadingDropdowns}
          disabled={isLoadingDropdowns || !formData.keluarga.id_kacab || !wilbinOptions?.length}
        />
        
        <DropdownSelect
          label="Shelter *"
          value={formData.keluarga.id_shelter}
          options={shelterOptions?.map(item => ({
            label: item.nama_shelter,
            value: item.id_shelter
          })) || []}
          onValueChange={(value) => handleInputChange('id_shelter', value)}
          placeholder="Pilih shelter"
          error={errors.id_shelter}
          isLoading={isLoadingDropdowns}
          disabled={isLoadingDropdowns || !formData.keluarga.id_wilbin || !shelterOptions?.length}
        />
        
        {/* Bank Account Information */}
        <View style={styles.toggleSection}>
          <Text style={styles.toggleLabel}>Memiliki Rekening Bank?</Text>
          <Switch
            value={formData.keluarga.bank_choice === 'yes'}
            onValueChange={toggleBankAccount}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={formData.keluarga.bank_choice === 'yes' ? '#2E86DE' : '#f4f3f4'}
          />
        </View>
        
        {formData.keluarga.bank_choice === 'yes' && (
          <View style={styles.conditionalSection}>
            <DropdownSelect
              label="Bank *"
              value={formData.keluarga.id_bank}
              options={dropdowns.bank?.map(item => ({
                label: item.nama_bank,
                value: item.id_bank
              })) || []}
              onValueChange={(value) => handleInputChange('id_bank', value)}
              placeholder="Pilih bank"
              error={errors.id_bank}
              isLoading={isLoadingDropdowns}
              disabled={isLoadingDropdowns || !dropdowns.bank?.length}
            />
            
            <Input
              label="Nomor Rekening *"
              value={formData.keluarga.no_rek}
              onChangeText={(value) => handleInputChange('no_rek', value)}
              placeholder="Masukkan nomor rekening"
              keyboardType="number-pad"
              error={errors.no_rek}
            />
            
            <Input
              label="Atas Nama *"
              value={formData.keluarga.an_rek}
              onChangeText={(value) => handleInputChange('an_rek', value)}
              placeholder="Masukkan nama pemilik rekening"
              error={errors.an_rek}
            />
          </View>
        )}
        
        {/* Phone Information */}
        <View style={styles.toggleSection}>
          <Text style={styles.toggleLabel}>Memiliki Nomor Telepon?</Text>
          <Switch
            value={formData.keluarga.telp_choice === 'yes'}
            onValueChange={togglePhone}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={formData.keluarga.telp_choice === 'yes' ? '#2E86DE' : '#f4f3f4'}
          />
        </View>
        
        {formData.keluarga.telp_choice === 'yes' && (
          <View style={styles.conditionalSection}>
            <Input
              label="Nomor Telepon *"
              value={formData.keluarga.no_tlp}
              onChangeText={(value) => handleInputChange('no_tlp', value)}
              placeholder="Masukkan nomor telepon"
              keyboardType="phone-pad"
              error={errors.no_tlp}
            />
            
            <Input
              label="Atas Nama *"
              value={formData.keluarga.an_tlp}
              onChangeText={(value) => handleInputChange('an_tlp', value)}
              placeholder="Masukkan nama pemilik telepon"
              error={errors.an_tlp}
            />
          </View>
        )}
      </View>
      
      {/* Navigation Buttons */}
      <FormButtons
        onNext={handleNext}
        showBack={false}
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
});

export default KeluargaStepSatuScreen;