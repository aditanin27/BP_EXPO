import React, { useState } from 'react';
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
  setFormData, 
  nextFormStep,
  prevFormStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';
import DateTimePicker from '@react-native-community/datetimepicker';

const IbuStep3 = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  const [namaIbuError, setNamaIbuError] = useState('');
  const [nikIbuError, setNikIbuError] = useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showDeathDatePicker, setShowDeathDatePicker] = useState(false);
  const [isIbuDead, setIsIbuDead] = useState(!!formData.ibu.tanggal_kematian_ibu);
  
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
  
  // Handle field changes
  const handleChange = (field, value) => {
    dispatch(setFormData({
      section: 'ibu',
      data: { [field]: value }
    }));
    
    // Clear relevant errors
    switch (field) {
      case 'nama_ibu':
        setNamaIbuError('');
        break;
      case 'nik_ibu':
        setNikIbuError('');
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
      handleChange('tanggal_lahir_ibu', formatDate(selectedDate));
    }
  };
  
  // Handle death date change
  const handleDeathDateChange = (event, selectedDate) => {
    setShowDeathDatePicker(false);
    if (selectedDate) {
      handleChange('tanggal_kematian_ibu', formatDate(selectedDate));
    }
  };
  
  // Toggle ibu death status
  const toggleIbuDeath = (value) => {
    setIsIbuDead(value);
    if (!value) {
      // If ibu is not dead, clear death related fields
      handleChange('tanggal_kematian_ibu', '');
      handleChange('penyebab_kematian_ibu', '');
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // NIK validation is optional but if provided must be valid
    if (formData.ibu.nik_ibu && formData.ibu.nik_ibu.length !== 16) {
      setNikIbuError('NIK harus 16 digit');
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
        <Text style={styles.headerTitle}>Data Ibu</Text>
        <Text style={styles.stepIndicator}>Langkah 3 dari 5</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <Input
          label="NIK Ibu"
          value={formData.ibu.nik_ibu}
          onChangeText={(text) => handleChange('nik_ibu', text)}
          placeholder="Masukkan NIK Ibu (opsional)"
          error={nikIbuError}
          keyboardType="numeric"
        />
        
        <Input
          label="Nama Ibu"
          value={formData.ibu.nama_ibu}
          onChangeText={(text) => handleChange('nama_ibu', text)}
          placeholder="Masukkan nama ibu (opsional)"
          error={namaIbuError}
        />
        
        <DropdownSelect
          label="Agama"
          value={formData.ibu.agama_ibu}
          options={agamaOptions}
          onValueChange={(value) => handleChange('agama_ibu', value)}
          placeholder="Pilih agama (opsional)"
        />
        
        <Input
          label="Tempat Lahir"
          value={formData.ibu.tempat_lahir_ibu}
          onChangeText={(text) => handleChange('tempat_lahir_ibu', text)}
          placeholder="Masukkan tempat lahir (opsional)"
        />
        
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowBirthDatePicker(true)}
        >
          <Text style={styles.dateInputLabel}>Tanggal Lahir</Text>
          <Text style={styles.dateInputValue}>
            {formData.ibu.tanggal_lahir_ibu || 'Pilih tanggal lahir (opsional)'}
          </Text>
        </TouchableOpacity>
        
        {showBirthDatePicker && (
          <DateTimePicker
            value={parseDate(formData.ibu.tanggal_lahir_ibu)}
            mode="date"
            display="default"
            onChange={handleBirthDateChange}
            maximumDate={new Date()}
          />
        )}
        
        <Input
          label="Alamat"
          value={formData.ibu.alamat_ibu}
          onChangeText={(text) => handleChange('alamat_ibu', text)}
          placeholder="Masukkan alamat (opsional)"
          multiline
          numberOfLines={3}
        />
        
        <DropdownSelect
          label="Penghasilan"
          value={formData.ibu.penghasilan_ibu}
          options={penghasilanOptions}
          onValueChange={(value) => handleChange('penghasilan_ibu', value)}
          placeholder="Pilih penghasilan (opsional)"
        />
        
        {/* Death Status Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Status Kematian</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {isIbuDead ? 'Sudah Meninggal' : 'Masih Hidup'}
              </Text>
              <Switch
                value={isIbuDead}
                onValueChange={toggleIbuDeath}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isIbuDead ? '#2E86DE' : '#f4f3f4'}
              />
            </View>
          </View>
          
          {isIbuDead && (
            <>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDeathDatePicker(true)}
              >
                <Text style={styles.dateInputLabel}>Tanggal Kematian</Text>
                <Text style={styles.dateInputValue}>
                  {formData.ibu.tanggal_kematian_ibu || 'Pilih tanggal kematian'}
                </Text>
              </TouchableOpacity>
              
              {showDeathDatePicker && (
                <DateTimePicker
                  value={parseDate(formData.ibu.tanggal_kematian_ibu) || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDeathDateChange}
                  maximumDate={new Date()}
                />
              )}
              
              <Input
                label="Penyebab Kematian"
                value={formData.ibu.penyebab_kematian_ibu}
                onChangeText={(text) => handleChange('penyebab_kematian_ibu', text)}
                placeholder="Masukkan penyebab kematian"
                multiline
                numberOfLines={2}
              />
            </>
          )}
        </View>
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
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
});

export default IbuStep3;