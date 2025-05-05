import React, { useEffect, useState } from 'react';
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
  fetchDropdownData,
  fetchWilbinByKacab,
  fetchShelterByWilbin
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';

const KeluargaStep1 = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    formData, 
    dropdownData,
    wilbinOptions,
    shelterOptions,
    isLoadingDropdowns,
    isLoadingWilbin,
    isLoadingShelter
  } = useAppSelector((state) => state.keluarga);
  
  const [noKkError, setNoKkError] = useState('');
  const [kepalaKeluargaError, setKepalaKeluargaError] = useState('');
  const [kacabError, setKacabError] = useState('');
  const [wilbinError, setWilbinError] = useState('');
  const [shelterError, setShelterError] = useState('');
  
  // Fetch dropdown data on component mount
  useEffect(() => {
    dispatch(fetchDropdownData());
  }, [dispatch]);
  
  // Fetch wilbin options when kacab is selected
  useEffect(() => {
    if (formData.keluarga.id_kacab) {
      dispatch(fetchWilbinByKacab(formData.keluarga.id_kacab));
    }
  }, [dispatch, formData.keluarga.id_kacab]);
  
  // Fetch shelter options when wilbin is selected
  useEffect(() => {
    if (formData.keluarga.id_wilbin) {
      dispatch(fetchShelterByWilbin(formData.keluarga.id_wilbin));
    }
  }, [dispatch, formData.keluarga.id_wilbin]);
  
  // Handle field changes
  const handleChange = (field, value) => {
    dispatch(setFormData({
      section: 'keluarga',
      data: { [field]: value }
    }));
    
    // Clear relevant errors
    switch (field) {
      case 'no_kk':
        setNoKkError('');
        break;
      case 'kepala_keluarga':
        setKepalaKeluargaError('');
        break;
      case 'id_kacab':
        setKacabError('');
        // Reset wilbin and shelter when kacab changes
        dispatch(setFormData({
          section: 'keluarga',
          data: { 
            id_wilbin: null,
            id_shelter: null 
          }
        }));
        break;
      case 'id_wilbin':
        setWilbinError('');
        // Reset shelter when wilbin changes
        dispatch(setFormData({
          section: 'keluarga',
          data: { id_shelter: null }
        }));
        break;
      case 'id_shelter':
        setShelterError('');
        break;
      default:
        break;
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Validate No. KK
    if (!formData.keluarga.no_kk) {
      setNoKkError('Nomor KK wajib diisi');
      isValid = false;
    } else if (formData.keluarga.no_kk.length < 10) {
      setNoKkError('Nomor KK minimal 10 digit');
      isValid = false;
    }
    
    // Validate Kepala Keluarga
    if (!formData.keluarga.kepala_keluarga) {
      setKepalaKeluargaError('Nama kepala keluarga wajib diisi');
      isValid = false;
    }
    
    // Validate Kantor Cabang
    if (!formData.keluarga.id_kacab) {
      setKacabError('Kantor cabang wajib dipilih');
      isValid = false;
    }
    
    // Validate Wilayah Binaan
    if (!formData.keluarga.id_wilbin) {
      setWilbinError('Wilayah binaan wajib dipilih');
      isValid = false;
    }
    
    // Validate Shelter
    if (!formData.keluarga.id_shelter) {
      setShelterError('Shelter wajib dipilih');
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
  
  // Handle back
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Convert dropdownData to options format for dropdowns
  const kacabOptions = dropdownData.kacab?.map(item => ({
    label: item.nama_kacab,
    value: item.id_kacab
  })) || [];
  
  const bankOptions = dropdownData.bank?.map(item => ({
    label: item.nama_bank,
    value: item.id_bank
  })) || [];
  
  const wilbinOptionsMapped = wilbinOptions?.map(item => ({
    label: item.nama_wilbin,
    value: item.id_wilbin
  })) || [];
  
  const shelterOptionsMapped = shelterOptions?.map(item => ({
    label: item.nama_shelter,
    value: item.id_shelter
  })) || [];
  
  // Options for status ortu
  const statusOrtuOptions = [
    { label: 'Yatim', value: 'yatim' },
    { label: 'Piatu', value: 'piatu' },
    { label: 'Yatim Piatu', value: 'yatim piatu' },
    { label: 'Dhuafa', value: 'dhuafa' },
    { label: 'Non Dhuafa', value: 'non dhuafa' }
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Keluarga</Text>
        <Text style={styles.stepIndicator}>Langkah 1 dari 5</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <Input
          label="Nomor Kartu Keluarga"
          value={formData.keluarga.no_kk}
          onChangeText={(text) => handleChange('no_kk', text)}
          placeholder="Masukkan nomor KK"
          error={noKkError}
          keyboardType="numeric"
        />
        
        <Input
          label="Nama Kepala Keluarga"
          value={formData.keluarga.kepala_keluarga}
          onChangeText={(text) => handleChange('kepala_keluarga', text)}
          placeholder="Masukkan nama kepala keluarga"
          error={kepalaKeluargaError}
        />
        
        <DropdownSelect
          label="Status Orang Tua"
          value={formData.keluarga.status_ortu}
          options={statusOrtuOptions}
          onValueChange={(value) => handleChange('status_ortu', value)}
          placeholder="Pilih status orang tua"
          isLoading={false}
        />
        
        <DropdownSelect
          label="Kantor Cabang"
          value={formData.keluarga.id_kacab}
          options={kacabOptions}
          onValueChange={(value) => handleChange('id_kacab', value)}
          placeholder="Pilih kantor cabang"
          error={kacabError}
          isLoading={isLoadingDropdowns}
        />
        
        <DropdownSelect
          label="Wilayah Binaan"
          value={formData.keluarga.id_wilbin}
          options={wilbinOptionsMapped}
          onValueChange={(value) => handleChange('id_wilbin', value)}
          placeholder="Pilih wilayah binaan"
          error={wilbinError}
          isLoading={isLoadingWilbin}
          disabled={!formData.keluarga.id_kacab}
        />
        
        <DropdownSelect
          label="Shelter"
          value={formData.keluarga.id_shelter}
          options={shelterOptionsMapped}
          onValueChange={(value) => handleChange('id_shelter', value)}
          placeholder="Pilih shelter"
          error={shelterError}
          isLoading={isLoadingShelter}
          disabled={!formData.keluarga.id_wilbin}
        />
        
        {/* Bank Account Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informasi Rekening Bank</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {formData.keluarga.bank_choice === 'yes' ? 'Ada' : 'Tidak Ada'}
              </Text>
              <Switch
                value={formData.keluarga.bank_choice === 'yes'}
                onValueChange={(value) => 
                  handleChange('bank_choice', value ? 'yes' : 'no')
                }
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={formData.keluarga.bank_choice === 'yes' ? '#2E86DE' : '#f4f3f4'}
              />
            </View>
          </View>
          
          {formData.keluarga.bank_choice === 'yes' && (
            <>
              <DropdownSelect
                label="Bank"
                value={formData.keluarga.id_bank}
                options={bankOptions}
                onValueChange={(value) => handleChange('id_bank', value)}
                placeholder="Pilih bank"
                isLoading={isLoadingDropdowns}
              />
              
              <Input
                label="Nomor Rekening"
                value={formData.keluarga.no_rek}
                onChangeText={(text) => handleChange('no_rek', text)}
                placeholder="Masukkan nomor rekening"
                keyboardType="numeric"
              />
              
              <Input
                label="Atas Nama"
                value={formData.keluarga.an_rek}
                onChangeText={(text) => handleChange('an_rek', text)}
                placeholder="Masukkan nama pemilik rekening"
              />
            </>
          )}
        </View>
        
        {/* Phone Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informasi Telepon</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {formData.keluarga.telp_choice === 'yes' ? 'Ada' : 'Tidak Ada'}
              </Text>
              <Switch
                value={formData.keluarga.telp_choice === 'yes'}
                onValueChange={(value) => 
                  handleChange('telp_choice', value ? 'yes' : 'no')
                }
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={formData.keluarga.telp_choice === 'yes' ? '#2E86DE' : '#f4f3f4'}
              />
            </View>
          </View>
          
          {formData.keluarga.telp_choice === 'yes' && (
            <>
              <Input
                label="Nomor Telepon"
                value={formData.keluarga.no_tlp}
                onChangeText={(text) => handleChange('no_tlp', text)}
                placeholder="Masukkan nomor telepon"
                keyboardType="phone-pad"
              />
              
              <Input
                label="Atas Nama"
                value={formData.keluarga.an_tlp}
                onChangeText={(text) => handleChange('an_tlp', text)}
                placeholder="Masukkan nama pemilik telepon"
              />
            </>
          )}
        </View>
      </ScrollView>
      
      <FormButtons
        onNext={handleNext}
        onBack={handleBack}
        nextLabel="Lanjut"
        backLabel="Batal"
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

export default KeluargaStep1;