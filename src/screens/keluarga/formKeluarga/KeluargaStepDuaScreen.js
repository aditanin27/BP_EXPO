import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
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

const KeluargaStepDuaScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  // Local state for form errors
  const [errors, setErrors] = useState({});
  
  // Local state for conditional fields
  const [showSchoolFields, setShowSchoolFields] = useState(false);
  const [showUniversityFields, setShowUniversityFields] = useState(false);
  
  // Effect to set visibility of conditional fields based on selected education level
  useEffect(() => {
    const jenjang = formData.anakPendidikan.jenjang;
    
    // Show school fields for elementary through high school
    setShowSchoolFields(
      jenjang === 'sd' || 
      jenjang === 'smp' || 
      jenjang === 'sma'
    );
    
    // Show university fields for higher education
    setShowUniversityFields(jenjang === 'perguruan_tinggi');
    
  }, [formData.anakPendidikan.jenjang]);
  
  // Handler for updating form data
  const handleInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'anakPendidikan',
      data: { [name]: value }
    }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form before proceeding to next step
  const validateForm = () => {
    const newErrors = {};
    const { jenjang } = formData.anakPendidikan;
    
    // Validate education level (required)
    if (!jenjang) {
      newErrors.jenjang = 'Jenjang pendidikan wajib dipilih';
    }
    
    // Validate school-related fields if applicable
    if (showSchoolFields) {
      if (!formData.anakPendidikan.kelas) {
        newErrors.kelas = 'Kelas wajib diisi';
      }
      
      if (!formData.anakPendidikan.nama_sekolah) {
        newErrors.nama_sekolah = 'Nama sekolah wajib diisi';
      }
    }
    
    // Validate university-related fields if applicable
    if (showUniversityFields) {
      if (!formData.anakPendidikan.nama_pt) {
        newErrors.nama_pt = 'Nama perguruan tinggi wajib diisi';
      }
      
      if (!formData.anakPendidikan.jurusan) {
        newErrors.jurusan = 'Jurusan wajib diisi';
      }
      
      if (!formData.anakPendidikan.semester || isNaN(formData.anakPendidikan.semester)) {
        newErrors.semester = 'Semester wajib diisi dengan angka';
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
  
  // Education level options
  const jenjangOptions = [
    { label: 'Belum Sekolah', value: 'belum_sd' },
    { label: 'SD / Sederajat', value: 'sd' },
    { label: 'SMP / Sederajat', value: 'smp' },
    { label: 'SMA / Sederajat', value: 'sma' },
    { label: 'Perguruan Tinggi', value: 'perguruan_tinggi' },
  ];
  
  // Class/grade options
  const getKelasOptions = () => {
    const { jenjang } = formData.anakPendidikan;
    
    switch(jenjang) {
      case 'sd':
        return Array(6).fill().map((_, i) => ({ 
          label: `Kelas ${i + 1}`, 
          value: `${i + 1}` 
        }));
      case 'smp':
        return Array(3).fill().map((_, i) => ({ 
          label: `Kelas ${i + 1}`, 
          value: `${i + 1}` 
        }));
      case 'sma':
        return Array(3).fill().map((_, i) => ({ 
          label: `Kelas ${i + 1}`, 
          value: `${i + 1}` 
        }));
      default:
        return [];
    }
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Pendidikan Anak</Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Data Pendidikan</Text>
        
        <DropdownSelect
          label="Jenjang Pendidikan *"
          value={formData.anakPendidikan.jenjang}
          options={jenjangOptions}
          onValueChange={(value) => handleInputChange('jenjang', value)}
          placeholder="Pilih jenjang pendidikan"
          error={errors.jenjang}
        />
        
        {/* School-related fields (for SD, SMP, SMA) */}
        {showSchoolFields && (
          <View style={styles.conditionalSection}>
            <DropdownSelect
              label="Kelas *"
              value={formData.anakPendidikan.kelas}
              options={getKelasOptions()}
              onValueChange={(value) => handleInputChange('kelas', value)}
              placeholder="Pilih kelas"
              error={errors.kelas}
            />
            
            <Input
              label="Nama Sekolah *"
              value={formData.anakPendidikan.nama_sekolah}
              onChangeText={(value) => handleInputChange('nama_sekolah', value)}
              placeholder="Masukkan nama sekolah"
              error={errors.nama_sekolah}
            />
            
            <Input
              label="Alamat Sekolah"
              value={formData.anakPendidikan.alamat_sekolah}
              onChangeText={(value) => handleInputChange('alamat_sekolah', value)}
              placeholder="Masukkan alamat sekolah"
              multiline={true}
              numberOfLines={3}
              error={errors.alamat_sekolah}
            />
          </View>
        )}
        
        {/* University-related fields */}
        {showUniversityFields && (
          <View style={styles.conditionalSection}>
            <Input
              label="Nama Perguruan Tinggi *"
              value={formData.anakPendidikan.nama_pt}
              onChangeText={(value) => handleInputChange('nama_pt', value)}
              placeholder="Masukkan nama perguruan tinggi"
              error={errors.nama_pt}
            />
            
            <Input
              label="Jurusan *"
              value={formData.anakPendidikan.jurusan}
              onChangeText={(value) => handleInputChange('jurusan', value)}
              placeholder="Masukkan jurusan"
              error={errors.jurusan}
            />
            
            <Input
              label="Semester *"
              value={formData.anakPendidikan.semester}
              onChangeText={(value) => handleInputChange('semester', value)}
              placeholder="Masukkan semester"
              keyboardType="number-pad"
              error={errors.semester}
            />
            
            <Input
              label="Alamat Perguruan Tinggi"
              value={formData.anakPendidikan.alamat_pt}
              onChangeText={(value) => handleInputChange('alamat_pt', value)}
              placeholder="Masukkan alamat perguruan tinggi"
              multiline={true}
              numberOfLines={3}
              error={errors.alamat_pt}
            />
          </View>
        )}
        
        {/* Note for users */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Catatan: Informasi pendidikan ini akan digunakan untuk data anak yang akan didaftarkan.
          </Text>
        </View>
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
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  conditionalSection: {
    borderLeftWidth: 2,
    borderLeftColor: '#2E86DE',
    paddingLeft: 10,
    marginBottom: 15,
  },
  noteContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default KeluargaStepDuaScreen;