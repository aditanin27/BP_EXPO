import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  setFormData, 
  nextFormStep,
  prevFormStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';
import DateTimePicker from '@react-native-community/datetimepicker';

const WaliStep4 = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  const [namaWaliError, setNamaWaliError] = useState('');
  const [nikWaliError, setNikWaliError] = useState('');
  const [hubKerabatError, setHubKerabatError] = useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  
  // Agama options
  const agamaOptions = [
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Buddha', value: 'Buddha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  // Penghasilan options
  const penghasilanOptions = [
    { label: 'Kurang dari Rp 1.000.000', value: 'Kurang dari Rp 1.000.000' },
    { label: 'Rp 1.000.000 - Rp 3.000.000', value: 'Rp 1.000.000 - Rp 3.000.000' },
    { label: 'Rp 3.000.000 - Rp 5.000.000', value: 'Rp 3.000.000 - Rp 5.000.000' },
    { label: 'Rp 5.000.000 - Rp 10.000.000', value: 'Rp 5.000.000 - Rp 10.000.000' },
    { label: 'Lebih dari Rp 10.000.000', value: 'Lebih dari Rp 10.000.000' },
  ];
  
  // Hubungan Kerabat options
  const hubKerabatOptions = [
    { label: 'Kakek', value: 'Kakek' },
    { label: 'Nenek', value: 'Nenek' },
    { label: 'Paman', value: 'Paman' },
    { label: 'Bibi', value: 'Bibi' },
    { label: 'Kakak', value: 'Kakak' },
    { label: 'Sepupu', value: 'Sepupu' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
  // Handle field changes
  const handleChange = (field, value) => {
    dispatch(setFormData({
      section: 'wali',
      data: { [field]: value }
    }));
    
    // Clear relevant errors
    switch (field) {
      case 'nama_wali':
        setNamaWaliError('');
        break;
      case 'nik_wali':
        setNikWaliError('');
        break;
      case 'hub_kerabat_wali':
        setHubKerabatError('');
        break;
      default:
        break;
    }
  };
  
  // Format date to string
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  // Format string to date
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Handle birth date change
  const handleBirthDateChange = (event, selectedDate) => {
    setShowBirthDatePicker(false);
    if (selectedDate) {
      handleChange('tanggal_lahir_wali', formatDate(selectedDate));
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Optional validation for wali data
    // NIK validation is optional but if provided must be valid
    if (formData.wali.nik_wali && formData.wali.nik_wali.length !== 16) {
      setNikWaliError('NIK harus 16 digit');
      isValid = false;
    }
    
    // If wali name is provided, the relation must also be provided
    if (formData.wali.nama_wali && !formData.wali.hub_kerabat_wali) {
      setHubKerabatError('Hubungan dengan anak wajib diisi jika ada wali');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      dispatch(nextFormStep());
    }
  };
  
  // Handle back step
  const handleBack = () => {
    dispatch(prevFormStep());
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Wali</Text>
        <Text style={styles.stepIndicator}>Langkah 4 dari 5</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Data wali dibutuhkan jika anak tinggal dengan wali. Isi data ini jika relevan.
          </Text>
        </View>
        
        <Input
          label="NIK Wali"
          value={formData.wali.nik_wali}
          onChangeText={(text) => handleChange('nik_wali', text)}
          placeholder="Masukkan NIK Wali (opsional)"
          error={nikWaliError}
          keyboardType="numeric"
        />
        
        <Input
          label="Nama Wali"
          value={formData.wali.nama_wali}
          onChangeText={(text) => handleChange('nama_wali', text)}
          placeholder="Masukkan nama wali (opsional)"
          error={namaWaliError}
        />
        
        <DropdownSelect
          label="Hubungan dengan Anak"
          value={formData.wali.hub_kerabat_wali}
          options={hubKerabatOptions}
          onValueChange={(value) => handleChange('hub_kerabat_wali', value)}
          placeholder="Pilih hubungan kerabat (opsional)"
          error={hubKerabatError}
        />
        
        <DropdownSelect
          label="Agama"
          value={formData.wali.agama_wali}
          options={agamaOptions}
          onValueChange={(value) => handleChange('agama_wali', value)}
          placeholder="Pilih agama (opsional)"
        />
        
        <Input
          label="Tempat Lahir"
          value={formData.wali.tempat_lahir_wali}
          onChangeText={(text) => handleChange('tempat_lahir_wali', text)}
          placeholder="Masukkan tempat lahir (opsional)"
        />
        
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowBirthDatePicker(true)}
        >
          <Text style={styles.dateInputLabel}>Tanggal Lahir</Text>
          <Text style={styles.dateInputValue}>
            {formData.wali.tanggal_lahir_wali || 'Pilih tanggal lahir (opsional)'}
          </Text>
        </TouchableOpacity>
        
        {showBirthDatePicker && (
          <DateTimePicker
            value={parseDate(formData.wali.tanggal_lahir_wali)}
            mode="date"
            display="default"
            onChange={handleBirthDateChange}
            maximumDate={new Date()}
          />
        )}
        
        <Input
          label="Alamat"
          value={formData.wali.alamat_wali}
          onChangeText={(text) => handleChange('alamat_wali', text)}
          placeholder="Masukkan alamat (opsional)"
          multiline
          numberOfLines={3}
        />
        
        <DropdownSelect
          label="Penghasilan"
          value={formData.wali.penghasilan_wali}
          options={penghasilanOptions}
          onValueChange={(value) => handleChange('penghasilan_wali', value)}
          placeholder="Pilih penghasilan (opsional)"
        />
      </ScrollView>
      
      <FormButtons
        onNext={handleNext}
        onBack={handleBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E86DE',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stepIndicator: {
    fontSize: 14,
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 100, // Space for the buttons
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86DE',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  dateInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  dateInputValue: {
    fontSize: 16,
    color: '#666',
  },
});

export default WaliStep4;