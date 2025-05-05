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

const AyahStep2 = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  const [namaAyahError, setNamaAyahError] = useState('');
  const [nikAyahError, setNikAyahError] = useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showDeathDatePicker, setShowDeathDatePicker] = useState(false);
  const [isAyahDead, setIsAyahDead] = useState(!!formData.ayah.tanggal_kematian);
  
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
      section: 'ayah',
      data: { [field]: value }
    }));
    
    // Clear relevant errors
    switch (field) {
      case 'nama_ayah':
        setNamaAyahError('');
        break;
      case 'nik_ayah':
        setNikAyahError('');
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
      handleChange('tanggal_lahir_ayah', formatDate(selectedDate));
    }
  };
  
  // Handle death date change
  const handleDeathDateChange = (event, selectedDate) => {
    setShowDeathDatePicker(false);
    if (selectedDate) {
      handleChange('tanggal_kematian_ayah', formatDate(selectedDate));
    }
  };
  
  // Toggle ayah death status
  const toggleAyahDeath = (value) => {
    setIsAyahDead(value);
    if (!value) {
      // If ayah is not dead, clear death related fields
      handleChange('tanggal_kematian_ayah', '');
      handleChange('penyebab_kematian_ayah', '');
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // NIK validation is optional but if provided must be valid
    if (formData.ayah.nik_ayah && formData.ayah.nik_ayah.length !== 16) {
      setNikAyahError('NIK harus 16 digit');
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
        <Text style={styles.headerTitle}>Data Ayah</Text>
        <Text style={styles.stepIndicator}>Langkah 2 dari 5</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <Input
          label="NIK Ayah"
          value={formData.ayah.nik_ayah}
          onChangeText={(text) => handleChange('nik_ayah', text)}
          placeholder="Masukkan NIK Ayah (opsional)"
          error={nikAyahError}
          keyboardType="numeric"
        />
        
        <Input
          label="Nama Ayah"
          value={formData.ayah.nama_ayah}
          onChangeText={(text) => handleChange('nama_ayah', text)}
          placeholder="Masukkan nama ayah (opsional)"
          error={namaAyahError}
        />
        
        <DropdownSelect
          label="Agama"
          value={formData.ayah.agama_ayah}
          options={agamaOptions}
          onValueChange={(value) => handleChange('agama_ayah', value)}
          placeholder="Pilih agama (opsional)"
        />
        
        <Input
          label="Tempat Lahir"
          value={formData.ayah.tempat_lahir_ayah}
          onChangeText={(text) => handleChange('tempat_lahir_ayah', text)}
          placeholder="Masukkan tempat lahir (opsional)"
        />
        
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowBirthDatePicker(true)}
        >
          <Text style={styles.dateInputLabel}>Tanggal Lahir</Text>
          <Text style={styles.dateInputValue}>
            {formData.ayah.tanggal_lahir_ayah || 'Pilih tanggal lahir (opsional)'}
          </Text>
        </TouchableOpacity>
        
        {showBirthDatePicker && (
          <DateTimePicker
            value={parseDate(formData.ayah.tanggal_lahir_ayah)}
            mode="date"
            display="default"
            onChange={handleBirthDateChange}
            maximumDate={new Date()}
          />
        )}
        
        <Input
          label="Alamat"
          value={formData.ayah.alamat_ayah}
          onChangeText={(text) => handleChange('alamat_ayah', text)}
          placeholder="Masukkan alamat (opsional)"
          multiline
          numberOfLines={3}
        />
        
        <DropdownSelect
          label="Penghasilan"
          value={formData.ayah.penghasilan_ayah}
          options={penghasilanOptions}
          onValueChange={(value) => handleChange('penghasilan_ayah', value)}
          placeholder="Pilih penghasilan (opsional)"
        />
        
        {/* Death Status Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Status Kematian</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {isAyahDead ? 'Sudah Meninggal' : 'Masih Hidup'}
              </Text>
              <Switch
                value={isAyahDead}
                onValueChange={toggleAyahDeath}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isAyahDead ? '#2E86DE' : '#f4f3f4'}
              />
            </View>
          </View>
          
          {isAyahDead && (
            <>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDeathDatePicker(true)}
              >
                <Text style={styles.dateInputLabel}>Tanggal Kematian</Text>
                <Text style={styles.dateInputValue}>
                  {formData.ayah.tanggal_kematian_ayah || 'Pilih tanggal kematian'}
                </Text>
              </TouchableOpacity>
              
              {showDeathDatePicker && (
                <DateTimePicker
                  value={parseDate(formData.ayah.tanggal_kematian_ayah) || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDeathDateChange}
                  maximumDate={new Date()}
                />
              )}
              
              <Input
                label="Penyebab Kematian"
                value={formData.ayah.penyebab_kematian_ayah}
                onChangeText={(text) => handleChange('penyebab_kematian_ayah', text)}
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

export default AyahStep2;