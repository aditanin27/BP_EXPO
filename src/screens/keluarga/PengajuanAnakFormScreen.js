import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchWithAuth } from '../../api/utils';
import Input from '../../components/Input';
import Button from '../../components/Button';
import DropdownSelect from '../../components/DropdownSelect';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import LoadingOverlay from '../../components/LoadingOverlay';

const PengajuanAnakFormScreen = ({ route, navigation }) => {
  const { keluarga, no_kk } = route.params;
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize form data
  const [formData, setFormData] = useState({
    no_kk: no_kk,
    jenjang: 'belum_sd',
    kelas: '',
    nama_sekolah: '',
    alamat_sekolah: '',
    jurusan: '',
    semester: '',
    nama_pt: '',
    alamat_pt: '',
    nik_anak: '',
    anak_ke: '',
    dari_bersaudara: '',
    nick_name: '',
    full_name: '',
    agama: 'Islam',
    tempat_lahir: '',
    tanggal_lahir: formatDMY(new Date()),
    jenis_kelamin: 'Laki-laki',
    tinggal_bersama: 'Ayah',
    jenis_anak_binaan: 'BPCB',
    hafalan: 'Non-Tahfidz',
    pelajaran_favorit: '',
    hobi: '',
    prestasi: '',
    jarak_rumah: '',
    transportasi: 'Jalan Kaki',
    foto: null
  });
  
  // State for date picker
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Helper to format Date object as DD-MM-YYYY
  function formatDMY(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Parse string "DD-MM-YYYY" into Date
  function parseDMY(str) {
    if (!str || str.length !== 10) return new Date();
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
      handleInputChange('tanggal_lahir', formatDMY(selectedDate));
    }
  };
  
  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.nik_anak.trim()) newErrors.nik_anak = 'NIK anak wajib diisi';
    else if (!/^\d+$/.test(formData.nik_anak)) newErrors.nik_anak = 'NIK anak harus berupa angka';
    else if (formData.nik_anak.length !== 16) newErrors.nik_anak = 'NIK anak harus 16 digit';
    
    if (!formData.anak_ke.trim()) newErrors.anak_ke = 'Anak ke wajib diisi';
    else if (isNaN(Number(formData.anak_ke)) || Number(formData.anak_ke) < 1) 
      newErrors.anak_ke = 'Anak ke harus berupa angka positif';
    
    if (!formData.dari_bersaudara.trim()) newErrors.dari_bersaudara = 'Jumlah saudara wajib diisi';
    else if (isNaN(Number(formData.dari_bersaudara)) || Number(formData.dari_bersaudara) < 1) 
      newErrors.dari_bersaudara = 'Jumlah saudara harus berupa angka positif';
    
    if (!formData.nick_name.trim()) newErrors.nick_name = 'Nama panggilan wajib diisi';
    if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!formData.tempat_lahir.trim()) newErrors.tempat_lahir = 'Tempat lahir wajib diisi';
    if (!formData.tanggal_lahir.trim()) newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    
    // Conditionally check education fields
    if (formData.jenjang === 'sd' || formData.jenjang === 'smp' || formData.jenjang === 'sma') {
      if (!formData.kelas.trim()) newErrors.kelas = 'Kelas wajib diisi';
      if (!formData.nama_sekolah.trim()) newErrors.nama_sekolah = 'Nama sekolah wajib diisi';
    }
    
    if (formData.jenjang === 'perguruan_tinggi') {
      if (!formData.nama_pt.trim()) newErrors.nama_pt = 'Nama perguruan tinggi wajib diisi';
      if (!formData.jurusan.trim()) newErrors.jurusan = 'Jurusan wajib diisi';
      if (!formData.semester.trim()) newErrors.semester = 'Semester wajib diisi';
    }
    
    // Optional numeric fields
    if (formData.jarak_rumah && isNaN(Number(formData.jarak_rumah))) 
      newErrors.jarak_rumah = 'Jarak rumah harus berupa angka';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Create form data if there's a photo
      let requestData = formData;
      
      if (formData.foto) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'foto') {
            // Add photo only if it exists and is a file object
            if (formData.foto && formData.foto.uri) {
              const fileUri = formData.foto.uri;
              const filename = fileUri.split('/').pop();
              const match = /\.(\w+)$/.exec(filename);
              const type = match ? `image/${match[1]}` : 'image';
              
              formDataObj.append('foto', {
                uri: fileUri,
                name: filename,
                type,
              });
            }
          } else {
            formDataObj.append(key, formData[key]);
          }
        });
        
        requestData = formDataObj;
      }
      
      const response = await fetchWithAuth('/pengajuan-anak/submit', {
        method: 'POST',
        headers: formData.foto ? {
          'Content-Type': 'multipart/form-data',
        } : undefined,
        body: formData.foto ? requestData : JSON.stringify(requestData),
      });
      
      if (response.success) {
        Alert.alert(
          'Sukses',
          'Data anak berhasil disimpan',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('KeluargaList')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Options for dropdowns
  const jenjangOptions = [
    { label: 'Belum Sekolah', value: 'belum_sd' },
    { label: 'SD / Sederajat', value: 'sd' },
    { label: 'SMP / Sederajat', value: 'smp' },
    { label: 'SMA / Sederajat', value: 'sma' },
    { label: 'Perguruan Tinggi', value: 'perguruan_tinggi' },
  ];
  
  const genderOptions = [
    { label: 'Laki-laki', value: 'Laki-laki' },
    { label: 'Perempuan', value: 'Perempuan' },
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
  
  // Conditional rendering of education fields
  const showSchoolFields = formData.jenjang === 'sd' || formData.jenjang === 'smp' || formData.jenjang === 'sma';
  const showUniversityFields = formData.jenjang === 'perguruan_tinggi';
  
  // Function to get class options based on school level
  const getKelasOptions = () => {
    switch(formData.jenjang) {
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
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pengajuan Anak Baru</Text>
          <Text style={styles.headerSubtitle}>Keluarga: {keluarga.kepala_keluarga}</Text>
          <Text style={styles.headerSubtitle}>No. KK: {no_kk}</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Data Pendidikan</Text>
          
          <DropdownSelect
            label="Jenjang Pendidikan *"
            value={formData.jenjang}
            options={jenjangOptions}
            onValueChange={(value) => handleInputChange('jenjang', value)}
            placeholder="Pilih jenjang pendidikan"
            error={errors.jenjang}
          />
          
          {showSchoolFields && (
            <View style={styles.conditionalSection}>
              <DropdownSelect
                label="Kelas *"
                value={formData.kelas}
                options={getKelasOptions()}
                onValueChange={(value) => handleInputChange('kelas', value)}
                placeholder="Pilih kelas"
                error={errors.kelas}
              />
              
              <Input
                label="Nama Sekolah *"
                value={formData.nama_sekolah}
                onChangeText={(value) => handleInputChange('nama_sekolah', value)}
                placeholder="Masukkan nama sekolah"
                error={errors.nama_sekolah}
              />
              
              <Input
                label="Alamat Sekolah"
                value={formData.alamat_sekolah}
                onChangeText={(value) => handleInputChange('alamat_sekolah', value)}
                placeholder="Masukkan alamat sekolah"
                multiline={true}
                numberOfLines={3}
                error={errors.alamat_sekolah}
              />
            </View>
          )}
          
          {showUniversityFields && (
            <View style={styles.conditionalSection}>
              <Input
                label="Nama Perguruan Tinggi *"
                value={formData.nama_pt}
                onChangeText={(value) => handleInputChange('nama_pt', value)}
                placeholder="Masukkan nama perguruan tinggi"
                error={errors.nama_pt}
              />
              
              <Input
                label="Jurusan *"
                value={formData.jurusan}
                onChangeText={(value) => handleInputChange('jurusan', value)}
                placeholder="Masukkan jurusan"
                error={errors.jurusan}
              />
              
              <Input
                label="Semester *"
                value={formData.semester}
                onChangeText={(value) => handleInputChange('semester', value)}
                placeholder="Masukkan semester"
                keyboardType="number-pad"
                error={errors.semester}
              />
              
              <Input
                label="Alamat Perguruan Tinggi"
                value={formData.alamat_pt}
                onChangeText={(value) => handleInputChange('alamat_pt', value)}
                placeholder="Masukkan alamat perguruan tinggi"
                multiline={true}
                numberOfLines={3}
                error={errors.alamat_pt}
              />
            </View>
          )}
          
          <Text style={styles.sectionTitle}>Data Anak</Text>
          
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Foto Anak</Text>
            <ImagePickerComponent
              imageUri={formData.foto ? formData.foto.uri : null}
              onImageSelected={(img) => handleInputChange('foto', img)}
            />
          </View>
          
          <Input
            label="NIK Anak *"
            value={formData.nik_anak}
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
                value={formData.anak_ke}
                onChangeText={(value) => handleInputChange('anak_ke', value)}
                placeholder="Contoh: 2"
                keyboardType="number-pad"
                error={errors.anak_ke}
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Dari Bersaudara *"
                value={formData.dari_bersaudara}
                onChangeText={(value) => handleInputChange('dari_bersaudara', value)}
                placeholder="Contoh: 3"
                keyboardType="number-pad"
                error={errors.dari_bersaudara}
              />
            </View>
          </View>
          
          <Input
            label="Nama Panggilan *"
            value={formData.nick_name}
            onChangeText={(value) => handleInputChange('nick_name', value)}
            placeholder="Masukkan nama panggilan"
            error={errors.nick_name}
          />
          
          <Input
            label="Nama Lengkap *"
            value={formData.full_name}
            onChangeText={(value) => handleInputChange('full_name', value)}
            placeholder="Masukkan nama lengkap"
            error={errors.full_name}
          />
          
          <DropdownSelect
            label="Agama *"
            value={formData.agama}
            options={religionOptions}
            onValueChange={(value) => handleInputChange('agama', value)}
            placeholder="Pilih agama"
            error={errors.agama}
          />
          
          <Input
            label="Tempat Lahir *"
            value={formData.tempat_lahir}
            onChangeText={(value) => handleInputChange('tempat_lahir', value)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir}
          />
          
          <Text style={styles.inputLabel}>Tanggal Lahir *</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formData.tanggal_lahir}</Text>
          </TouchableOpacity>
          {errors.tanggal_lahir && (
            <Text style={styles.errorText}>{errors.tanggal_lahir}</Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <DropdownSelect
            label="Jenis Kelamin *"
            value={formData.jenis_kelamin}
            options={genderOptions}
            onValueChange={(value) => handleInputChange('jenis_kelamin', value)}
            placeholder="Pilih jenis kelamin"
            error={errors.jenis_kelamin}
          />
          
          <DropdownSelect
            label="Tinggal Bersama *"
            value={formData.tinggal_bersama}
            options={livingWithOptions}
            onValueChange={(value) => handleInputChange('tinggal_bersama', value)}
            placeholder="Pilih tinggal bersama"
            error={errors.tinggal_bersama}
          />
          
          <DropdownSelect
            label="Jenis Anak Binaan *"
            value={formData.jenis_anak_binaan}
            options={childTypeOptions}
            onValueChange={(value) => handleInputChange('jenis_anak_binaan', value)}
            placeholder="Pilih jenis anak binaan"
            error={errors.jenis_anak_binaan}
          />
          
          <DropdownSelect
            label="Hafalan *"
            value={formData.hafalan}
            options={hafalanOptions}
            onValueChange={(value) => handleInputChange('hafalan', value)}
            placeholder="Pilih jenis hafalan"
            error={errors.hafalan}
          />
          
          <Input
            label="Pelajaran Favorit"
            value={formData.pelajaran_favorit}
            onChangeText={(value) => handleInputChange('pelajaran_favorit', value)}
            placeholder="Masukkan pelajaran favorit"
            error={errors.pelajaran_favorit}
          />
          
          <Input
            label="Hobi"
            value={formData.hobi}
            onChangeText={(value) => handleInputChange('hobi', value)}
            placeholder="Masukkan hobi"
            error={errors.hobi}
          />
          
          <Input
            label="Prestasi"
            value={formData.prestasi}
            onChangeText={(value) => handleInputChange('prestasi', value)}
            placeholder="Masukkan prestasi"
            error={errors.prestasi}
          />
          
          <Input
            label="Jarak Rumah (km)"
            value={formData.jarak_rumah}
            onChangeText={(value) => handleInputChange('jarak_rumah', value)}
            placeholder="Contoh: 2.5"
            keyboardType="numeric"
            error={errors.jarak_rumah}
          />
          
          <DropdownSelect
            label="Transportasi *"
            value={formData.transportasi}
            options={transportOptions}
            onValueChange={(value) => handleInputChange('transportasi', value)}
            placeholder="Pilih transportasi"
            error={errors.transportasi}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Simpan"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
          
          <Button
            title="Kembali"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
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
  scrollViewContent: {
    padding: 15,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2E86DE',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#555',
  },
});

export default PengajuanAnakFormScreen;