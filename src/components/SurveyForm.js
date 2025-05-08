import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import DropdownSelect from './DropdownSelect';
import Input from './Input';
import Button from './Button';
import FormButtons from './FormButtons';

const SurveyForm = ({ 
  initialValues = {}, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  currentTab = 'data-keluarga',
  isSurveyExists = false 
}) => {
  const [formData, setFormData] = useState({
    // Default empty values for all form fields
    pendidikan_kepala_keluarga: '',
    jumlah_tanggungan: '',
    pekerjaan_kepala_keluarga: '',
    penghasilan: '',
    kepemilikan_tabungan: '',
    jumlah_makan: '',
    kepemilikan_tanah: '',
    kepemilikan_rumah: '',
    kondisi_rumah_dinding: '',
    kondisi_rumah_lantai: '',
    kepemilikan_kendaraan: '',
    kepemilikan_elektronik: '',
    sumber_air_bersih: '',
    jamban_limbah: '',
    tempat_sampah: '',
    perokok: '',
    konsumen_miras: '',
    persediaan_p3k: '',
    makan_buah_sayur: '',
    solat_lima_waktu: '',
    membaca_alquran: '',
    majelis_taklim: '',
    membaca_koran: '',
    pengurus_organisasi: '',
    pengurus_organisasi_sebagai: '',
    status_anak: '',
    biaya_pendidikan_perbulan: '',
    bantuan_lembaga_formal_lain: '',
    bantuan_lembaga_formal_lain_sebesar: '',
    kondisi_penerima_manfaat: '',
    petugas_survey: '',
    hasil_survey: '',
    keterangan_hasil: '',
    ...initialValues
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(currentTab || 'data-keluarga');
  
  // Options for dropdown selects
  const pendidikanOptions = [
    { label: 'Tidak Sekolah', value: 'Tidak Sekolah' },
    { label: 'Sekolah Dasar', value: 'Sekolah Dasar' },
    { label: 'SMP/MTS/SEDERAJAT', value: 'SMP/MTS/SEDERAJAT' },
    { label: 'SMK/SMA/MA/SEDERAJAT', value: 'SMK/SMA/MA/SEDERAJAT' },
    { label: 'DIPLOMA I', value: 'DIPLOMA I' },
    { label: 'DIPLOMA II', value: 'DIPLOMA II' },
    { label: 'DIPLOMA III', value: 'DIPLOMA III' },
    { label: 'STRATA-1', value: 'STRATA-1' },
    { label: 'STRATA-2', value: 'STRATA-2' },
    { label: 'STRATA-3', value: 'STRATA-3' },
    { label: 'LAINNYA', value: 'LAINNYA' }
  ];
  
  const pekerjaanOptions = [
    { label: 'Petani', value: 'Petani' },
    { label: 'Nelayan', value: 'Nelayan' },
    { label: 'Peternak', value: 'Peternak' },
    { label: 'PNS NON Dosen/Guru', value: 'PNS NON Dosen/Guru' },
    { label: 'Guru PNS', value: 'Guru PNS' },
    { label: 'Guru Non PNS', value: 'Guru Non PNS' },
    { label: 'Karyawan Swasta', value: 'Karyawan Swasta' },
    { label: 'Buruh', value: 'Buruh' },
    { label: 'Wiraswasta', value: 'Wiraswasta' },
    { label: 'Wirausaha', value: 'Wirausaha' },
    { label: 'Pedagang Kecil', value: 'Pedagang Kecil' },
    { label: 'Pedagang Besar', value: 'Pedagang Besar' },
    { label: 'Pensiunan', value: 'Pensiunan' },
    { label: 'Tidak Bekerja', value: 'Tidak Bekerja' },
    { label: 'Sudah Meninggal', value: 'Sudah Meninggal' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  const penghasilanOptions = [
    { label: 'di bawah Rp 500.000', value: 'dibawah_500k' },
    { label: 'Rp 500.000 - Rp 1.500.000', value: '500k_1500k' },
    { label: 'Rp 1.500.000 - Rp 2.500.000', value: '1500k_2500k' },
    { label: 'Rp 2.500.000 - Rp 3.500.000', value: '2500k_3500k' },
    { label: 'Rp 3.500.000 - Rp 5.000.000', value: '3500k_5000k' },
    { label: 'Rp 5.000.000 - Rp 7.000.000', value: '5000k_7000k' },
    { label: 'Rp 7.000.000 - Rp 10.000.000', value: '7000k_10000k' },
    { label: 'di atas Rp 10.000.000', value: 'diatas_10000k' }
  ];
  
  const yaOrTidakOptions = [
    { label: 'Ya', value: 'Ya' },
    { label: 'Tidak', value: 'Tidak' }
  ];
  
  const jenisRumahOptions = [
    { label: 'Hak Milik', value: 'Hak Milik' },
    { label: 'Sewa', value: 'Sewa' },
    { label: 'Orang Tua', value: 'Orang Tua' },
    { label: 'Saudara', value: 'Saudara' },
    { label: 'Kerabat', value: 'Kerabat' }
  ];
  
  const bahanDindingOptions = [
    { label: 'Tembok', value: 'Tembok' },
    { label: 'Kayu', value: 'Kayu' },
    { label: 'Papan', value: 'Papan' },
    { label: 'Geribik', value: 'Geribik' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  const bahanLantaiOptions = [
    { label: 'Keramik', value: 'Keramik' },
    { label: 'Ubin', value: 'Ubin' },
    { label: 'Marmer', value: 'Marmer' },
    { label: 'Kayu', value: 'Kayu' },
    { label: 'Tanah', value: 'Tanah' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  const kendaraanOptions = [
    { label: 'Sepeda', value: 'Sepeda' },
    { label: 'Motor', value: 'Motor' },
    { label: 'Mobil', value: 'Mobil' }
  ];
  
  const elektronikOptions = [
    { label: 'Radio', value: 'Radio' },
    { label: 'Televisi', value: 'Televisi' },
    { label: 'Handphone', value: 'Handphone' },
    { label: 'Kulkas', value: 'Kulkas' }
  ];
  
  const sumberAirOptions = [
    { label: 'Sumur', value: 'Sumur' },
    { label: 'Sungai', value: 'Sungai' },
    { label: 'PDAM', value: 'PDAM' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  const jambanOptions = [
    { label: 'Sungai', value: 'Sungai' },
    { label: 'Sepitank', value: 'Sepitank' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  const sampahOptions = [
    { label: 'TPS', value: 'TPS' },
    { label: 'Sungai', value: 'Sungai' },
    { label: 'Pekarangan', value: 'Pekarangan' }
  ];
  
  const solatOptions = [
    { label: 'Lengkap', value: 'Lengkap' },
    { label: 'Kadang-kadang', value: 'Kadang-kadang' },
    { label: 'Tidak Pernah', value: 'Tidak Pernah' }
  ];
  
  const bacaQuranOptions = [
    { label: 'Lancar', value: 'Lancar' },
    { label: 'Terbata-bata', value: 'Terbata-bata' },
    { label: 'Tidak Bisa', value: 'Tidak Bisa' }
  ];
  
  const keseringanOptions = [
    { label: 'Rutin', value: 'Rutin' },
    { label: 'Jarang', value: 'Jarang' },
    { label: 'Tidak Pernah', value: 'Tidak Pernah' }
  ];
  
  const selaluJarangOptions = [
    { label: 'Selalu', value: 'Selalu' },
    { label: 'Jarang', value: 'Jarang' },
    { label: 'Tidak Pernah', value: 'Tidak Pernah' }
  ];
  
  const statusAnakOptions = [
    { label: 'Yatim', value: 'Yatim' },
    { label: 'Dhuafa', value: 'Dhuafa' },
    { label: 'Non Dhuafa', value: 'Non Dhuafa' }
  ];
  
  const hasilSurveyOptions = [
    { label: 'Layak', value: 'Layak' },
    { label: 'Tidak Layak', value: 'Tidak Layak' }
  ];
  
  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...initialValues
      }));
    }
  }, [initialValues]);
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error for the field if exists
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
    
    // Handle conditional fields
    if (field === 'pengurus_organisasi' && value === 'Tidak') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        pengurus_organisasi_sebagai: ''
      }));
    }
    
    if (field === 'bantuan_lembaga_formal_lain' && value === 'Tidak') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        bantuan_lembaga_formal_lain_sebesar: ''
      }));
    }
  };
  
  // Function to switch tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
  };
  
  // Validate the current tab's fields
  const validateTabFields = (tab) => {
    const newErrors = {};
    
    switch (tab) {
      case 'data-keluarga':
        if (!formData.pendidikan_kepala_keluarga) {
          newErrors.pendidikan_kepala_keluarga = 'Pendidikan kepala keluarga harus diisi';
        }
        if (!formData.jumlah_tanggungan) {
          newErrors.jumlah_tanggungan = 'Jumlah tanggungan harus diisi';
        }
        break;
        
      case 'data-ekonomi':
        if (!formData.pekerjaan_kepala_keluarga) {
          newErrors.pekerjaan_kepala_keluarga = 'Pekerjaan kepala keluarga harus diisi';
        }
        if (!formData.penghasilan) {
          newErrors.penghasilan = 'Penghasilan harus diisi';
        }
        if (!formData.kepemilikan_tabungan) {
          newErrors.kepemilikan_tabungan = 'Kepemilikan tabungan harus diisi';
        }
        if (!formData.jumlah_makan) {
          newErrors.jumlah_makan = 'Jumlah makan harus diisi';
        }
        break;
        
      case 'data-asset':
        if (!formData.kepemilikan_tanah) {
          newErrors.kepemilikan_tanah = 'Kepemilikan tanah harus diisi';
        }
        if (!formData.kepemilikan_rumah) {
          newErrors.kepemilikan_rumah = 'Kepemilikan rumah harus diisi';
        }
        if (!formData.kondisi_rumah_dinding) {
          newErrors.kondisi_rumah_dinding = 'Kondisi rumah (dinding) harus diisi';
        }
        if (!formData.kondisi_rumah_lantai) {
          newErrors.kondisi_rumah_lantai = 'Kondisi rumah (lantai) harus diisi';
        }
        if (!formData.kepemilikan_kendaraan) {
          newErrors.kepemilikan_kendaraan = 'Kepemilikan kendaraan harus diisi';
        }
        if (!formData.kepemilikan_elektronik) {
          newErrors.kepemilikan_elektronik = 'Kepemilikan elektronik harus diisi';
        }
        break;
        
      case 'data-kesehatan':
        if (!formData.sumber_air_bersih) {
          newErrors.sumber_air_bersih = 'Sumber air bersih harus diisi';
        }
        if (!formData.jamban_limbah) {
          newErrors.jamban_limbah = 'Jamban/limbah harus diisi';
        }
        if (!formData.tempat_sampah) {
          newErrors.tempat_sampah = 'Tempat sampah harus diisi';
        }
        if (!formData.perokok) {
          newErrors.perokok = 'Perokok harus diisi';
        }
        if (!formData.konsumen_miras) {
          newErrors.konsumen_miras = 'Konsumen miras harus diisi';
        }
        if (!formData.persediaan_p3k) {
          newErrors.persediaan_p3k = 'Persediaan P3K harus diisi';
        }
        if (!formData.makan_buah_sayur) {
          newErrors.makan_buah_sayur = 'Makan buah & sayur harus diisi';
        }
        break;
        
      case 'data-ibadah':
        if (!formData.solat_lima_waktu) {
          newErrors.solat_lima_waktu = 'Sholat lima waktu harus diisi';
        }
        if (!formData.membaca_alquran) {
          newErrors.membaca_alquran = 'Membaca Al-Quran harus diisi';
        }
        if (!formData.majelis_taklim) {
          newErrors.majelis_taklim = 'Majelis taklim harus diisi';
        }
        if (!formData.membaca_koran) {
          newErrors.membaca_koran = 'Membaca koran harus diisi';
        }
        if (!formData.pengurus_organisasi) {
          newErrors.pengurus_organisasi = 'Pengurus organisasi harus diisi';
        }
        if (formData.pengurus_organisasi === 'Ya' && !formData.pengurus_organisasi_sebagai) {
          newErrors.pengurus_organisasi_sebagai = 'Jabatan pengurus harus diisi';
        }
        break;
        
      case 'data-lainnya':
        if (!formData.status_anak) {
          newErrors.status_anak = 'Status anak harus diisi';
        }
        if (!formData.biaya_pendidikan_perbulan) {
          newErrors.biaya_pendidikan_perbulan = 'Biaya pendidikan per bulan harus diisi';
        }
        if (!formData.bantuan_lembaga_formal_lain) {
          newErrors.bantuan_lembaga_formal_lain = 'Bantuan lembaga formal lain harus diisi';
        }
        if (formData.bantuan_lembaga_formal_lain === 'Ya' && !formData.bantuan_lembaga_formal_lain_sebesar) {
          newErrors.bantuan_lembaga_formal_lain_sebesar = 'Jumlah bantuan harus diisi';
        }
        break;
        
      case 'data-survey':
        // Most fields optional here, except for hasil_survey if this is a final submission
        if (!formData.hasil_survey && formData.hasil_survey !== null) {
          newErrors.hasil_survey = 'Hasil survey harus diisi';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Function to handle tab navigation
  const handleTabChange = (nextTab) => {
    // Validate current tab before switching
    if (validateTabFields(activeTab)) {
      switchTab(nextTab);
    } else {
      Alert.alert('Validasi Gagal', 'Harap periksa kembali data yang diinput.');
    }
  };
  
  // Function to handle form submission
  const handleSubmit = () => {
    // Validate current tab first
    if (!validateTabFields(activeTab)) {
      Alert.alert('Validasi Gagal', 'Harap periksa kembali data yang diinput.');
      return;
    }
    
    // Call the parent's onSubmit function with the form data
    onSubmit(formData);
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'data-keluarga', label: 'Keluarga' },
      { id: 'data-ekonomi', label: 'Ekonomi' },
      { id: 'data-asset', label: 'Asset' },
      { id: 'data-kesehatan', label: 'Kesehatan' },
      { id: 'data-ibadah', label: 'Ibadah' },
      { id: 'data-lainnya', label: 'Lainnya' },
      { id: 'data-survey', label: 'Survey' },
    ];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton
            ]}
            onPress={() => handleTabChange(tab.id)}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === tab.id && styles.activeTabButtonText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'data-keluarga':
        return (
          <View style={styles.tabContent}>
            <DropdownSelect
              label="Pendidikan Kepala Keluarga*"
              value={formData.pendidikan_kepala_keluarga}
              options={pendidikanOptions}
              onValueChange={(value) => handleChange('pendidikan_kepala_keluarga', value)}
              placeholder="Pilih pendidikan"
              error={errors.pendidikan_kepala_keluarga}
            />
            
            <Input
              label="Jumlah Tanggungan*"
              value={formData.jumlah_tanggungan}
              onChangeText={(value) => handleChange('jumlah_tanggungan', value)}
              placeholder="Masukkan jumlah tanggungan"
              keyboardType="numeric"
              error={errors.jumlah_tanggungan}
            />
          </View>
        );
        
      case 'data-ekonomi':
        return (
          <View style={styles.tabContent}>
            <DropdownSelect
              label="Pekerjaan Kepala Keluarga*"
              value={formData.pekerjaan_kepala_keluarga}
              options={pekerjaanOptions}
              onValueChange={(value) => handleChange('pekerjaan_kepala_keluarga', value)}
              placeholder="Pilih pekerjaan"
              error={errors.pekerjaan_kepala_keluarga}
            />
            
            <DropdownSelect
              label="Penghasilan*"
              value={formData.penghasilan}
              options={penghasilanOptions}
              onValueChange={(value) => handleChange('penghasilan', value)}
              placeholder="Pilih penghasilan"
              error={errors.penghasilan}
            />
            
            <DropdownSelect
              label="Memiliki Tabungan*"
              value={formData.kepemilikan_tabungan}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('kepemilikan_tabungan', value)}
              placeholder="Pilih kepemilikan tabungan"
              error={errors.kepemilikan_tabungan}
            />
            
            <DropdownSelect
              label="Makan 3 Kali Sehari*"
              value={formData.jumlah_makan}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('jumlah_makan', value)}
              placeholder="Pilih jumlah makan"
              error={errors.jumlah_makan}
            />
          </View>
        );
        
      case 'data-asset':
        return (
          <View style={styles.tabContent}>
            <DropdownSelect
              label="Memiliki Tanah*"
              value={formData.kepemilikan_tanah}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('kepemilikan_tanah', value)}
              placeholder="Pilih kepemilikan tanah"
              error={errors.kepemilikan_tanah}
            />
            
            <DropdownSelect
              label="Kepemilikan Rumah*"
              value={formData.kepemilikan_rumah}
              options={jenisRumahOptions}
              onValueChange={(value) => handleChange('kepemilikan_rumah', value)}
              placeholder="Pilih kepemilikan rumah"
              error={errors.kepemilikan_rumah}
            />
            
            <DropdownSelect
              label="Kondisi Rumah (Dinding)*"
              value={formData.kondisi_rumah_dinding}
              options={bahanDindingOptions}
              onValueChange={(value) => handleChange('kondisi_rumah_dinding', value)}
              placeholder="Pilih kondisi dinding"
              error={errors.kondisi_rumah_dinding}
            />
            
            <DropdownSelect
              label="Kondisi Rumah (Lantai)*"
              value={formData.kondisi_rumah_lantai}
              options={bahanLantaiOptions}
              onValueChange={(value) => handleChange('kondisi_rumah_lantai', value)}
              placeholder="Pilih kondisi lantai"
              error={errors.kondisi_rumah_lantai}
            />
            
            <DropdownSelect
              label="Kepemilikan Kendaraan*"
              value={formData.kepemilikan_kendaraan}
              options={kendaraanOptions}
              onValueChange={(value) => handleChange('kepemilikan_kendaraan', value)}
              placeholder="Pilih kendaraan"
              error={errors.kepemilikan_kendaraan}
            />
            
            <DropdownSelect
              label="Kepemilikan Elektronik*"
              value={formData.kepemilikan_elektronik}
              options={elektronikOptions}
              onValueChange={(value) => handleChange('kepemilikan_elektronik', value)}
              placeholder="Pilih elektronik"
              error={errors.kepemilikan_elektronik}
            />
          </View>
        );
        
      case 'data-kesehatan':
        return (
          <View style={styles.tabContent}>
            <DropdownSelect
              label="Sumber Air Bersih*"
              value={formData.sumber_air_bersih}
              options={sumberAirOptions}
              onValueChange={(value) => handleChange('sumber_air_bersih', value)}
              placeholder="Pilih sumber air"
              error={errors.sumber_air_bersih}
            />
            
            <DropdownSelect
              label="Jamban/Limbah*"
              value={formData.jamban_limbah}
              options={jambanOptions}
              onValueChange={(value) => handleChange('jamban_limbah', value)}
              placeholder="Pilih jenis jamban"
              error={errors.jamban_limbah}
            />
            
            <DropdownSelect
              label="Tempat Sampah*"
              value={formData.tempat_sampah}
              options={sampahOptions}
              onValueChange={(value) => handleChange('tempat_sampah', value)}
              placeholder="Pilih tempat sampah"
              error={errors.tempat_sampah}
            />
            
            <DropdownSelect
              label="Apakah Perokok*"
              value={formData.perokok}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('perokok', value)}
              placeholder="Pilih status perokok"
              error={errors.perokok}
            />
            
            <DropdownSelect
              label="Konsumen Minuman Keras*"
              value={formData.konsumen_miras}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('konsumen_miras', value)}
              placeholder="Pilih status konsumen"
              error={errors.konsumen_miras}
            />
            
            <DropdownSelect
              label="Memiliki Persediaan P3K*"
              value={formData.persediaan_p3k}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('persediaan_p3k', value)}
              placeholder="Pilih persediaan P3K"
              error={errors.persediaan_p3k}
            />
            
            <DropdownSelect
              label="Makan Buah & Sayur*"
              value={formData.makan_buah_sayur}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('makan_buah_sayur', value)}
              placeholder="Pilih konsumsi buah & sayur"
              error={errors.makan_buah_sayur}
            />
          </View>
        );
        
      case 'data-ibadah':
        return (
          <View style={styles.tabContent}>
            <DropdownSelect
              label="Sholat 5 Waktu*"
              value={formData.solat_lima_waktu}
              options={solatOptions}
              onValueChange={(value) => handleChange('solat_lima_waktu', value)}
              placeholder="Pilih kebiasaan sholat"
              error={errors.solat_lima_waktu}
            />
            
            <DropdownSelect
              label="Membaca Al-Quran*"
              value={formData.membaca_alquran}
              options={bacaQuranOptions}
              onValueChange={(value) => handleChange('membaca_alquran', value)}
              placeholder="Pilih kemampuan membaca"
              error={errors.membaca_alquran}
            />
            
            <DropdownSelect
              label="Mengikuti Majelis Taklim*"
              value={formData.majelis_taklim}
              options={keseringanOptions}
              onValueChange={(value) => handleChange('majelis_taklim', value)}
              placeholder="Pilih kebiasaan majelis"
              error={errors.majelis_taklim}
            />
            
            <DropdownSelect
              label="Membaca Koran*"
              value={formData.membaca_koran}
              options={selaluJarangOptions}
              onValueChange={(value) => handleChange('membaca_koran', value)}
              placeholder="Pilih kebiasaan membaca"
              error={errors.membaca_koran}
            />
            
            <DropdownSelect
              label="Pengurus Organisasi*"
              value={formData.pengurus_organisasi}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('pengurus_organisasi', value)}
              placeholder="Pilih status organisasi"
              error={errors.pengurus_organisasi}
            />
            
            {formData.pengurus_organisasi === 'Ya' && (
              <Input
                label="Sebagai*"
                value={formData.pengurus_organisasi_sebagai}
                onChangeText={(value) => handleChange('pengurus_organisasi_sebagai', value)}
                placeholder="Masukkan jabatan"
                error={errors.pengurus_organisasi_sebagai}
              />
            )}
          </View>
        );
        
      case 'data-lainnya':
        return (
          <View style={styles.tabContent}>
            <DropdownSelect
              label="Status Anak*"
              value={formData.status_anak}
              options={statusAnakOptions}
              onValueChange={(value) => handleChange('status_anak', value)}
              placeholder="Pilih status anak"
              error={errors.status_anak}
            />
            
            <Input
              label="Biaya Pendidikan Per Bulan*"
              value={formData.biaya_pendidikan_perbulan}
              onChangeText={(value) => handleChange('biaya_pendidikan_perbulan', value)}
              placeholder="Masukkan biaya pendidikan"
              keyboardType="numeric"
              error={errors.biaya_pendidikan_perbulan}
            />
            
            <DropdownSelect
              label="Mendapat Bantuan Lembaga Formal Lain*"
              value={formData.bantuan_lembaga_formal_lain}
              options={yaOrTidakOptions}
              onValueChange={(value) => handleChange('bantuan_lembaga_formal_lain', value)}
              placeholder="Pilih status bantuan"
              error={errors.bantuan_lembaga_formal_lain}
            />
            
            {formData.bantuan_lembaga_formal_lain === 'Ya' && (
              <Input
                label="Jumlah Bantuan*"
                value={formData.bantuan_lembaga_formal_lain_sebesar}
                onChangeText={(value) => handleChange('bantuan_lembaga_formal_lain_sebesar', value)}
                placeholder="Masukkan jumlah bantuan"
                keyboardType="numeric"
                error={errors.bantuan_lembaga_formal_lain_sebesar}
              />
            )}
          </View>
        );
        
      case 'data-survey':
        return (
          <View style={styles.tabContent}>
            <Input
              label="Kondisi Penerima Manfaat"
              value={formData.kondisi_penerima_manfaat}
              onChangeText={(value) => handleChange('kondisi_penerima_manfaat', value)}
              placeholder="Masukkan kondisi penerima manfaat"
              multiline
            />
            
            <Input
              label="Petugas Survey"
              value={formData.petugas_survey}
              onChangeText={(value) => handleChange('petugas_survey', value)}
              placeholder="Masukkan nama petugas survey"
            />
            
            <DropdownSelect
              label="Hasil Survey"
              value={formData.hasil_survey}
              options={hasilSurveyOptions}
              onValueChange={(value) => handleChange('hasil_survey', value)}
              placeholder="Pilih hasil survey"
              error={errors.hasil_survey}
            />
            
            <Input
              label="Keterangan"
              value={formData.keterangan_hasil}
              onChangeText={(value) => handleChange('keterangan_hasil', value)}
              placeholder="Masukkan keterangan hasil survey"
              multiline
            />
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        {renderTabs()}
        
        <ScrollView style={styles.scrollView}>
          {renderTabContent()}
          <View style={{ height: 100 }} />
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Batal"
            onPress={onCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
          <Button
            title={isSurveyExists ? "Update Survey" : "Tambah Survey"}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabScrollView: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabContainer: {
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E86DE',
  },
  tabButtonText: {
    color: '#777',
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabButtonText: {
    color: '#2E86DE',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#2E86DE',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default SurveyForm;