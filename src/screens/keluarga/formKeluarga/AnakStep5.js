import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  setFormData, 
  prevFormStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import DateTimePicker from '@react-native-community/datetimepicker';

const AnakStep5 = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  const [nikAnakError, setNikAnakError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [nickNameError, setNickNameError] = useState('');
  const [anakKeError, setAnakKeError] = useState('');
  const [dariBersaudaraError, setDariBersaudaraError] = useState('');
  const [tempatLahirError, setTempatLahirError] = useState('');
  const [tanggalLahirError, setTanggalLahirError] = useState('');
  const [jenisKelaminError, setJenisKelaminError] = useState('');
  const [tinggalBersamaError, setTinggalBersamaError] = useState('');
  const [jenisAnakBinaanError, setJenisAnakBinaanError] = useState('');
  const [hafalanError, setHafalanError] = useState('');
  const [transportasiError, setTransportasiError] = useState('');
  const [jenjangError, setJenjangError] = useState('');
  
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
  
  // Jenis Kelamin options
  const jenisKelaminOptions = [
    { label: 'Laki-laki', value: 'Laki-laki' },
    { label: 'Perempuan', value: 'Perempuan' }
  ];
  
  // Tinggal Bersama options
  const tinggalBersamaOptions = [
    { label: 'Ayah', value: 'Ayah' },
    { label: 'Ibu', value: 'Ibu' },
    { label: 'Wali', value: 'Wali' }
  ];
  
  // Jenis Anak Binaan options
  const jenisAnakBinaanOptions = [
    { label: 'BPCB', value: 'BPCB' },
    { label: 'NPB', value: 'NPB' }
  ];
  
  // Hafalan options
  const hafalanOptions = [
    { label: 'Tahfidz', value: 'Tahfidz' },
    { label: 'Non-Tahfidz', value: 'Non-Tahfidz' }
  ];
  
  // Transportasi options
  const transportasiOptions = [
    { label: 'Jalan Kaki', value: 'Jalan Kaki' },
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Sepeda Motor', value: 'Sepeda Motor' },
    { label: 'Mobil', value: 'Mobil' },
    { label: 'Angkutan Umum', value: 'Angkutan Umum' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  // Jenjang Pendidikan options
  const jenjangOptions = [
    { label: 'Belum Sekolah', value: 'belum_sd' },
    { label: 'SD / MI / Sederajat', value: 'sd' },
    { label: 'SMP / MTs / Sederajat', value: 'smp' },
    { label: 'SMA / MA / Sederajat', value: 'sma' },
    { label: 'Perguruan Tinggi', value: 'perguruan_tinggi' }
  ];
  
  // Handle child data changes
  const handleAnakChange = (field, value) => {
    dispatch(setFormData({
      section: 'anak',
      data: { [field]: value }
    }));
    
    // Clear relevant errors
    switch (field) {
      case 'nik_anak':
        setNikAnakError('');
        break;
      case 'full_name':
        setFullNameError('');
        break;
      case 'nick_name':
        setNickNameError('');
        break;
      case 'anak_ke':
        setAnakKeError('');
        break;
      case 'dari_bersaudara':
        setDariBersaudaraError('');
        break;
      case 'tempat_lahir':
        setTempatLahirError('');
        break;
      case 'tanggal_lahir':
        setTanggalLahirError('');
        break;
      case 'jenis_kelamin':
        setJenisKelaminError('');
        break;
      case 'tinggal_bersama':
        setTinggalBersamaError('');
        break;
      case 'jenis_anak_binaan':
        setJenisAnakBinaanError('');
        break;
      case 'hafalan':
        setHafalanError('');
        break;
      case 'transportasi':
        setTransportasiError('');
        break;
      default:
        break;
    }
  };
  
  // Handle pendidikan data changes
  const handlePendidikanChange = (field, value) => {
    dispatch(setFormData({
      section: 'pendidikan',
      data: { [field]: value }
    }));
    
    // Clear relevant errors
    if (field === 'jenjang') {
      setJenjangError('');
    }
  };
  
  // Handle photo selection
  const handleImageSelected = (image) => {
    handleAnakChange('foto', image);
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
      handleAnakChange('tanggal_lahir', formatDate(selectedDate));
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Validate NIK
    if (!formData.anak.nik_anak) {
      setNikAnakError('NIK wajib diisi');
      isValid = false;
    } else if (formData.anak.nik_anak.length !== 16) {
      setNikAnakError('NIK harus 16 digit');
      isValid = false;
    }
    
    // Validate Full Name
    if (!formData.anak.full_name) {
      setFullNameError('Nama lengkap wajib diisi');
      isValid = false;
    }
    
    // Validate Nick Name
    if (!formData.anak.nick_name) {
      setNickNameError('Nama panggilan wajib diisi');
      isValid = false;
    }
    
    // Validate Anak Ke
    if (!formData.anak.anak_ke) {
      setAnakKeError('Wajib diisi');
      isValid = false;
    }
    
    // Validate Dari Bersaudara
    if (!formData.anak.dari_bersaudara) {
      setDariBersaudaraError('Wajib diisi');
      isValid = false;
    }
    
    // Validate Tempat Lahir
    if (!formData.anak.tempat_lahir) {
      setTempatLahirError('Tempat lahir wajib diisi');
      isValid = false;
    }
    
    // Validate Tanggal Lahir
    if (!formData.anak.tanggal_lahir) {
      setTanggalLahirError('Tanggal lahir wajib diisi');
      isValid = false;
    }
    
    // Validate Jenis Kelamin
    if (!formData.anak.jenis_kelamin) {
      setJenisKelaminError('Jenis kelamin wajib dipilih');
      isValid = false;
    }
    
    // Validate Tinggal Bersama
    if (!formData.anak.tinggal_bersama) {
      setTinggalBersamaError('Wajib dipilih');
      isValid = false;
    }
    
    // Validate Jenis Anak Binaan
    if (!formData.anak.jenis_anak_binaan) {
      setJenisAnakBinaanError('Wajib dipilih');
      isValid = false;
    }
    
    // Validate Hafalan
    if (!formData.anak.hafalan) {
      setHafalanError('Wajib dipilih');
      isValid = false;
    }
    
    // Validate Transportasi
    if (!formData.anak.transportasi) {
      setTransportasiError('Wajib dipilih');
      isValid = false;
    }
    
    // Validate Jenjang Pendidikan
    if (!formData.pendidikan.jenjang) {
      setJenjangError('Jenjang pendidikan wajib dipilih');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle Submit
  const handleSubmit = () => {
    if (validateForm()) {
      // Confirm before submitting
      Alert.alert(
        'Konfirmasi',
        'Apakah Anda yakin ingin menyimpan data keluarga ini?',
        [
          {
            text: 'Batal',
            style: 'cancel'
          },
          {
            text: 'Simpan',
            onPress: onSubmit
          }
        ]
      );
    } else {
      // Scroll to top to show errors
      Alert.alert('Peringatan', 'Mohon isi semua data yang diperlukan');
    }
  };
  
  // Handle back step
  const handleBack = () => {
    dispatch(prevFormStep());
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Anak</Text>
        <Text style={styles.stepIndicator}>Langkah 5 dari 5</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Silakan isi data anak pertama. Anda bisa menambahkan anak lainnya setelah keluarga terdaftar.
          </Text>
        </View>
        
        {/* Data Identitas Anak */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Identitas Anak</Text>
          
          <Input
            label="NIK Anak"
            value={formData.anak.nik_anak}
            onChangeText={(text) => handleAnakChange('nik_anak', text)}
            placeholder="Masukkan NIK Anak"
            error={nikAnakError}
            keyboardType="numeric"
          />
          
          <Input
            label="Nama Lengkap"
            value={formData.anak.full_name}
            onChangeText={(text) => handleAnakChange('full_name', text)}
            placeholder="Masukkan nama lengkap anak"
            error={fullNameError}
          />
          
          <Input
            label="Nama Panggilan"
            value={formData.anak.nick_name}
            onChangeText={(text) => handleAnakChange('nick_name', text)}
            placeholder="Masukkan nama panggilan anak"
            error={nickNameError}
          />
          
          <View style={styles.rowContainer}>
            <Input
              label="Anak ke"
              value={formData.anak.anak_ke}
              onChangeText={(text) => handleAnakChange('anak_ke', text)}
              placeholder="Contoh: 2"
              error={anakKeError}
              keyboardType="numeric"
              style={styles.halfInput}
            />
            
            <Input
              label="Dari bersaudara"
              value={formData.anak.dari_bersaudara}
              onChangeText={(text) => handleAnakChange('dari_bersaudara', text)}
              placeholder="Contoh: 3"
              error={dariBersaudaraError}
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>
          
          <DropdownSelect
            label="Agama"
            value={formData.anak.agama}
            options={agamaOptions}
            onValueChange={(value) => handleAnakChange('agama', value)}
            placeholder="Pilih agama"
          />
          
          <Input
            label="Tempat Lahir"
            value={formData.anak.tempat_lahir}
            onChangeText={(text) => handleAnakChange('tempat_lahir', text)}
            placeholder="Masukkan tempat lahir anak"
            error={tempatLahirError}
          />
          
          <TouchableOpacity
            style={[styles.dateInput, tanggalLahirError && styles.errorInput]}
            onPress={() => setShowBirthDatePicker(true)}
          >
            <Text style={styles.dateInputLabel}>Tanggal Lahir</Text>
            <Text style={styles.dateInputValue}>
              {formData.anak.tanggal_lahir || 'Pilih tanggal lahir anak'}
            </Text>
          </TouchableOpacity>
          
          {tanggalLahirError && (
            <Text style={styles.errorText}>{tanggalLahirError}</Text>
          )}
          
          {showBirthDatePicker && (
            <DateTimePicker
              value={parseDate(formData.anak.tanggal_lahir)}
              mode="date"
              display="default"
              onChange={handleBirthDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <DropdownSelect
            label="Jenis Kelamin"
            value={formData.anak.jenis_kelamin}
            options={jenisKelaminOptions}
            onValueChange={(value) => handleAnakChange('jenis_kelamin', value)}
            placeholder="Pilih jenis kelamin"
            error={jenisKelaminError}
          />
          
          <DropdownSelect
            label="Tinggal Bersama"
            value={formData.anak.tinggal_bersama}
            options={tinggalBersamaOptions}
            onValueChange={(value) => handleAnakChange('tinggal_bersama', value)}
            placeholder="Pilih tinggal bersama"
            error={tinggalBersamaError}
          />
        </View>
        
        {/* Data Tambahan */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data Tambahan</Text>
          
          <DropdownSelect
            label="Jenis Anak Binaan"
            value={formData.anak.jenis_anak_binaan}
            options={jenisAnakBinaanOptions}
            onValueChange={(value) => handleAnakChange('jenis_anak_binaan', value)}
            placeholder="Pilih jenis anak binaan"
            error={jenisAnakBinaanError}
          />
          
          <DropdownSelect
            label="Hafalan"
            value={formData.anak.hafalan}
            options={hafalanOptions}
            onValueChange={(value) => handleAnakChange('hafalan', value)}
            placeholder="Pilih jenis hafalan"
            error={hafalanError}
          />
          
          <Input
            label="Pelajaran Favorit"
            value={formData.anak.pelajaran_favorit}
            onChangeText={(text) => handleAnakChange('pelajaran_favorit', text)}
            placeholder="Masukkan pelajaran favorit (opsional)"
          />
          
          <Input
            label="Hobi"
            value={formData.anak.hobi}
            onChangeText={(text) => handleAnakChange('hobi', text)}
            placeholder="Masukkan hobi anak (opsional)"
          />
          
          <Input
            label="Prestasi"
            value={formData.anak.prestasi}
            onChangeText={(text) => handleAnakChange('prestasi', text)}
            placeholder="Masukkan prestasi anak (opsional)"
            multiline
            numberOfLines={2}
          />
          
          <Input
            label="Jarak Rumah ke Shelter (km)"
            value={formData.anak.jarak_rumah}
            onChangeText={(text) => handleAnakChange('jarak_rumah', text)}
            placeholder="Contoh: 2.5"
            keyboardType="numeric"
          />
          
          <DropdownSelect
            label="Transportasi ke Shelter"
            value={formData.anak.transportasi}
            options={transportasiOptions}
            onValueChange={(value) => handleAnakChange('transportasi', value)}
            placeholder="Pilih transportasi"
            error={transportasiError}
          />
          
          <View style={styles.photoContainer}>
            <Text style={styles.photoLabel}>Foto Anak</Text>
            <ImagePickerComponent 
              imageUri={formData.anak.foto ? formData.anak.foto.uri : null}
              onImageSelected={handleImageSelected}
              label="Pilih Foto Anak"
            />
          </View>
        </View>
        
        {/* Data Pendidikan */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data Pendidikan</Text>
          
          <DropdownSelect
            label="Jenjang Pendidikan"
            value={formData.pendidikan.jenjang}
            options={jenjangOptions}
            onValueChange={(value) => handlePendidikanChange('jenjang', value)}
            placeholder="Pilih jenjang pendidikan"
            error={jenjangError}
          />
          
          {formData.pendidikan.jenjang && formData.pendidikan.jenjang !== 'belum_sd' && (
            <>
              {['sd', 'smp', 'sma'].includes(formData.pendidikan.jenjang) && (
                <>
                  <Input
                    label="Kelas"
                    value={formData.pendidikan.kelas}
                    onChangeText={(text) => handlePendidikanChange('kelas', text)}
                    placeholder="Masukkan kelas (contoh: 7)"
                  />
                  
                  <Input
                    label="Nama Sekolah"
                    value={formData.pendidikan.nama_sekolah}
                    onChangeText={(text) => handlePendidikanChange('nama_sekolah', text)}
                    placeholder="Masukkan nama sekolah"
                  />
                  
                  <Input
                    label="Alamat Sekolah"
                    value={formData.pendidikan.alamat_sekolah}
                    onChangeText={(text) => handlePendidikanChange('alamat_sekolah', text)}
                    placeholder="Masukkan alamat sekolah"
                    multiline
                    numberOfLines={2}
                  />
                  
                  {formData.pendidikan.jenjang === 'sma' && (
                    <Input
                      label="Jurusan"
                      value={formData.pendidikan.jurusan}
                      onChangeText={(text) => handlePendidikanChange('jurusan', text)}
                      placeholder="Masukkan jurusan (opsional)"
                    />
                  )}
                </>
              )}
              
              {formData.pendidikan.jenjang === 'perguruan_tinggi' && (
                <>
                  <Input
                    label="Semester"
                    value={formData.pendidikan.semester}
                    onChangeText={(text) => handlePendidikanChange('semester', text)}
                    placeholder="Masukkan semester"
                    keyboardType="numeric"
                  />
                  
                  <Input
                    label="Nama Perguruan Tinggi"
                    value={formData.pendidikan.nama_pt}
                    onChangeText={(text) => handlePendidikanChange('nama_pt', text)}
                    placeholder="Masukkan nama perguruan tinggi"
                  />
                  
                  <Input
                    label="Alamat Perguruan Tinggi"
                    value={formData.pendidikan.alamat_pt}
                    onChangeText={(text) => handlePendidikanChange('alamat_pt', text)}
                    placeholder="Masukkan alamat perguruan tinggi"
                    multiline
                    numberOfLines={2}
                  />
                  
                  <Input
                    label="Jurusan"
                    value={formData.pendidikan.jurusan}
                    onChangeText={(text) => handlePendidikanChange('jurusan', text)}
                    placeholder="Masukkan jurusan"
                  />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
      
      <FormButtons
        onNext={handleSubmit}
        onBack={handleBack}
        nextLabel="Simpan"
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
    fontSize: 16,
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
});

export default AnakStep5;