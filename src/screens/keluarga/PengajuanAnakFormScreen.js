import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchWithAuth } from '../../api/utils';
import Input from '../../components/Input';
import DropdownSelect from '../../components/DropdownSelect';
import Button from '../../components/Button';
import ImagePickerComponent from '../../components/ImagePickerComponent';

const PengajuanAnakFormScreen = ({ navigation, route }) => {
  const { keluarga, noKK } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    // Hidden field for KK number
    no_kk: noKK || '',
    
    // Pendidikan fields
    jenjang: '',
    kelas: '',
    nama_sekolah: '',
    alamat_sekolah: '',
    jurusan: '',
    semester: '',
    nama_pt: '',
    alamat_pt: '',
    
    // Anak fields
    nik_anak: '',
    anak_ke: '',
    dari_bersaudara: '',
    nick_name: '',
    full_name: '',
    agama: 'Islam', // Default value
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    tinggal_bersama: '',
    jenis_anak_binaan: '',
    hafalan: '',
    pelajaran_favorit: '',
    hobi: '',
    prestasi: '',
    jarak_rumah: '',
    transportasi: '',
    foto: null,
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Options for dropdowns
  const jenjangOptions = [
    { label: 'Belum Sekolah', value: 'belum_sd' },
    { label: 'SD / MI / Sederajat', value: 'sd' },
    { label: 'SMP / MTs / Sederajat', value: 'smp' },
    { label: 'SMA / MA / Sederajat', value: 'sma' },
    { label: 'Perguruan Tinggi', value: 'perguruan_tinggi' }
  ];
  
  const agamaOptions = [
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Budha', value: 'Budha' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];
  
  const jenisKelaminOptions = [
    { label: 'Laki-laki', value: 'Laki-laki' },
    { label: 'Perempuan', value: 'Perempuan' },
  ];
  
  const tinggalBersamaOptions = [
    { label: 'Ayah', value: 'Ayah' },
    { label: 'Ibu', value: 'Ibu' },
    { label: 'Wali', value: 'Wali' },
  ];
  
  const jenisAnakBinaanOptions = [
    { label: 'BPCB', value: 'BPCB' },
    { label: 'NPB', value: 'NPB' },
  ];
  
  const hafalanOptions = [
    { label: 'Tahfidz', value: 'Tahfidz' },
    { label: 'Non-Tahfidz', value: 'Non-Tahfidz' },
  ];
  
  const transportasiOptions = [
    { label: 'Jalan Kaki', value: 'Jalan Kaki' },
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Sepeda Motor', value: 'Sepeda Motor' },
    { label: 'Mobil', value: 'Mobil' },
    { label: 'Angkutan Umum', value: 'Angkutan Umum' },
    { label: 'Lainnya', value: 'Lainnya' },
  ];
  
  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ''
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      handleChange('tanggal_lahir', formattedDate);
    }
  };
  
  // Format date to string
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  // Parse date string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Handle photo selection
  const handleImageSelected = (image) => {
    handleChange('foto', image);
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.nik_anak) {
      newErrors.nik_anak = 'NIK anak wajib diisi';
    } else if (formData.nik_anak.length !== 16) {
      newErrors.nik_anak = 'NIK harus 16 digit';
    }
    
    if (!formData.full_name) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!formData.nick_name) newErrors.nick_name = 'Nama panggilan wajib diisi';
    if (!formData.anak_ke) newErrors.anak_ke = 'Anak ke berapa wajib diisi';
    if (!formData.dari_bersaudara) newErrors.dari_bersaudara = 'Jumlah saudara wajib diisi';
    if (!formData.tempat_lahir) newErrors.tempat_lahir = 'Tempat lahir wajib diisi';
    if (!formData.tanggal_lahir) newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    if (!formData.jenis_kelamin) newErrors.jenis_kelamin = 'Jenis kelamin wajib dipilih';
    if (!formData.tinggal_bersama) newErrors.tinggal_bersama = 'Tinggal bersama wajib dipilih';
    if (!formData.jenis_anak_binaan) newErrors.jenis_anak_binaan = 'Jenis anak binaan wajib dipilih';
    if (!formData.hafalan) newErrors.hafalan = 'Kategori hafalan wajib dipilih';
    if (!formData.transportasi) newErrors.transportasi = 'Transportasi wajib dipilih';
    if (!formData.jenjang) newErrors.jenjang = 'Jenjang pendidikan wajib dipilih';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form to API
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Mohon lengkapi semua data yang diperlukan');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Prepare form data for submission
      const dataToSubmit = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'foto' && formData[key] !== '') {
          dataToSubmit.append(key, formData[key]);
        }
      });
      
      // Add photo if present
      if (formData.foto) {
        const fileUri = formData.foto.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        dataToSubmit.append('foto', {
          uri: fileUri,
          name: filename,
          type,
        });
      }
      
      // Send request to API
      const response = await fetchWithAuth('/pengajuan-anak/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: dataToSubmit,
      });
      
      if (response.success) {
        Alert.alert(
          'Berhasil',
          'Data anak berhasil ditambahkan ke keluarga',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('KeluargaList')
            }
          ]
        );
      } else {
        setError(response.message || 'Gagal menambahkan data anak');
        
        // Handle validation errors from backend
        if (response.errors) {
          const backendErrors = {};
          Object.keys(response.errors).forEach(key => {
            backendErrors[key] = response.errors[key][0];
          });
          setErrors(backendErrors);
        }
      }
    } catch (error) {
      console.error('Error submitting anak:', error);
      setError('Terjadi kesalahan saat mengirim data');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Formulir Pengajuan Anak</Text>
          <Text style={styles.headerSubtitle}>
            Keluarga: {keluarga?.kepala_keluarga || '-'}
          </Text>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Identitas Anak</Text>
            
            <Input
              label="NIK Anak"
              value={formData.nik_anak}
              onChangeText={(text) => handleChange('nik_anak', text)}
              placeholder="Masukkan NIK Anak"
              error={errors.nik_anak}
              keyboardType="numeric"
            />
            
            <Input
              label="Nama Lengkap"
              value={formData.full_name}
              onChangeText={(text) => handleChange('full_name', text)}
              placeholder="Masukkan nama lengkap anak"
              error={errors.full_name}
            />
            
            <Input
              label="Nama Panggilan"
              value={formData.nick_name}
              onChangeText={(text) => handleChange('nick_name', text)}
              placeholder="Masukkan nama panggilan anak"
              error={errors.nick_name}
            />
            
            <View style={styles.rowContainer}>
              <Input
                label="Anak ke"
                value={formData.anak_ke}
                onChangeText={(text) => handleChange('anak_ke', text)}
                placeholder="Contoh: 2"
                error={errors.anak_ke}
                keyboardType="numeric"
                style={styles.halfInput}
              />
              
              <Input
                label="Dari bersaudara"
                value={formData.dari_bersaudara}
                onChangeText={(text) => handleChange('dari_bersaudara', text)}
                placeholder="Contoh: 3"
                error={errors.dari_bersaudara}
                keyboardType="numeric"
                style={styles.halfInput}
              />
            </View>
            
            <DropdownSelect
              label="Agama"
              value={formData.agama}
              options={agamaOptions}
              onValueChange={(value) => handleChange('agama', value)}
              placeholder="Pilih agama"
              error={errors.agama}
            />
            
            <Input
              label="Tempat Lahir"
              value={formData.tempat_lahir}
              onChangeText={(text) => handleChange('tempat_lahir', text)}
              placeholder="Masukkan tempat lahir anak"
              error={errors.tempat_lahir}
            />
            
            <TouchableOpacity
              style={[styles.dateInput, errors.tanggal_lahir && styles.errorInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateInputLabel}>Tanggal Lahir</Text>
              <Text style={styles.dateInputValue}>
                {formData.tanggal_lahir || 'Pilih tanggal lahir anak'}
              </Text>
            </TouchableOpacity>
            
            {errors.tanggal_lahir && (
              <Text style={styles.errorText}>{errors.tanggal_lahir}</Text>
            )}
            
            {showDatePicker && (
              <DateTimePicker
                value={parseDate(formData.tanggal_lahir)}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            
            <DropdownSelect
              label="Jenis Kelamin"
              value={formData.jenis_kelamin}
              options={jenisKelaminOptions}
              onValueChange={(value) => handleChange('jenis_kelamin', value)}
              placeholder="Pilih jenis kelamin"
              error={errors.jenis_kelamin}
            />
            
            <DropdownSelect
              label="Tinggal Bersama"
              value={formData.tinggal_bersama}
              options={tinggalBersamaOptions}
              onValueChange={(value) => handleChange('tinggal_bersama', value)}
              placeholder="Pilih tinggal bersama"
              error={errors.tinggal_bersama}
            />
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Data Tambahan</Text>
            
            <DropdownSelect
              label="Jenis Anak Binaan"
              value={formData.jenis_anak_binaan}
              options={jenisAnakBinaanOptions}
              onValueChange={(value) => handleChange('jenis_anak_binaan', value)}
              placeholder="Pilih jenis anak binaan"
              error={errors.jenis_anak_binaan}
            />
            
            <DropdownSelect
              label="Hafalan"
              value={formData.hafalan}
              options={hafalanOptions}
              onValueChange={(value) => handleChange('hafalan', value)}
              placeholder="Pilih jenis hafalan"
              error={errors.hafalan}
            />
            
            <Input
              label="Pelajaran Favorit"
              value={formData.pelajaran_favorit}
              onChangeText={(text) => handleChange('pelajaran_favorit', text)}
              placeholder="Masukkan pelajaran favorit (opsional)"
              error={errors.pelajaran_favorit}
            />
            
            <Input
              label="Hobi"
              value={formData.hobi}
              onChangeText={(text) => handleChange('hobi', text)}
              placeholder="Masukkan hobi anak (opsional)"
              error={errors.hobi}
            />
            
            <Input
              label="Prestasi"
              value={formData.prestasi}
              onChangeText={(text) => handleChange('prestasi', text)}
              placeholder="Masukkan prestasi anak (opsional)"
              error={errors.prestasi}
              multiline
              numberOfLines={2}
            />
            
            <Input
              label="Jarak Rumah ke Shelter (km)"
              value={formData.jarak_rumah}
              onChangeText={(text) => handleChange('jarak_rumah', text)}
              placeholder="Contoh: 2.5"
              error={errors.jarak_rumah}
              keyboardType="numeric"
            />
            
            <DropdownSelect
              label="Transportasi ke Shelter"
              value={formData.transportasi}
              options={transportasiOptions}
              onValueChange={(value) => handleChange('transportasi', value)}
              placeholder="Pilih transportasi"
              error={errors.transportasi}
            />
            
            <View style={styles.photoContainer}>
              <Text style={styles.photoLabel}>Foto Anak</Text>
              <ImagePickerComponent 
                imageUri={formData.foto ? formData.foto.uri : null}
                onImageSelected={handleImageSelected}
                label="Pilih Foto Anak"
              />
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Data Pendidikan</Text>
            
            <DropdownSelect
              label="Jenjang Pendidikan"
              value={formData.jenjang}
              options={jenjangOptions}
              onValueChange={(value) => handleChange('jenjang', value)}
              placeholder="Pilih jenjang pendidikan"
              error={errors.jenjang}
            />
            
            {formData.jenjang && formData.jenjang !== 'belum_sd' && (
              <>
                {['sd', 'smp', 'sma'].includes(formData.jenjang) && (
                  <>
                    <Input
                      label="Kelas"
                      value={formData.kelas}
                      onChangeText={(text) => handleChange('kelas', text)}
                      placeholder="Masukkan kelas (contoh: 7)"
                      error={errors.kelas}
                    />
                    
                    <Input
                      label="Nama Sekolah"
                      value={formData.nama_sekolah}
                      onChangeText={(text) => handleChange('nama_sekolah', text)}
                      placeholder="Masukkan nama sekolah"
                      error={errors.nama_sekolah}
                    />
                    
                    <Input
                      label="Alamat Sekolah"
                      value={formData.alamat_sekolah}
                      onChangeText={(text) => handleChange('alamat_sekolah', text)}
                      placeholder="Masukkan alamat sekolah"
                      error={errors.alamat_sekolah}
                      multiline
                      numberOfLines={2}
                    />
                    
                    {formData.jenjang === 'sma' && (
                      <Input
                        label="Jurusan"
                        value={formData.jurusan}
                        onChangeText={(text) => handleChange('jurusan', text)}
                        placeholder="Masukkan jurusan (opsional)"
                        error={errors.jurusan}
                      />
                    )}
                  </>
                )}
                
                {formData.jenjang === 'perguruan_tinggi' && (
                  <>
                    <Input
                      label="Semester"
                      value={formData.semester}
                      onChangeText={(text) => handleChange('semester', text)}
                      placeholder="Masukkan semester"
                      error={errors.semester}
                      keyboardType="numeric"
                    />
                    
                    <Input
                      label="Nama Perguruan Tinggi"
                      value={formData.nama_pt}
                      onChangeText={(text) => handleChange('nama_pt', text)}
                      placeholder="Masukkan nama perguruan tinggi"
                      error={errors.nama_pt}
                    />
                    
                    <Input
                      label="Alamat Perguruan Tinggi"
                      value={formData.alamat_pt}
                      onChangeText={(text) => handleChange('alamat_pt', text)}
                      placeholder="Masukkan alamat perguruan tinggi"
                      error={errors.alamat_pt}
                      multiline
                      numberOfLines={2}
                    />
                    
                    <Input
                      label="Jurusan"
                      value={formData.jurusan}
                      onChangeText={(text) => handleChange('jurusan', text)}
                      placeholder="Masukkan jurusan"
                      error={errors.jurusan}
                    />
                  </>
                )}
              </>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Simpan"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E86DE',
    padding: 20,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30,
  },
  errorBox: {
    backgroundColor: '#ffdddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  errorBoxText: {
    color: '#c00',
    fontSize: 14,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
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
  photoContainer: {
    marginTop: 10,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  submitButton: {
    marginBottom: 10,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#555',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PengajuanAnakFormScreen;