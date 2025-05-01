// src/screens/KeluargaStepLimaScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  updateFormData, 
  nextStep,
  prevStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';

const KeluargaStepLimaScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);
  
  const [errors, setErrors] = useState({});
  const [isMotherDeceased, setIsMotherDeceased] = useState(false);
  const [showGuardianSection, setShowGuardianSection] = useState(false);

  // helper to format Date object as DD-MM-YYYY
  const formatDMY = (d) => {
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year  = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // parse "DD-MM-YYYY" into Date
  const parseDMY = (str) => {
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Mother's birth date picker
  const initialMotherBirth = formData.ibu.tanggal_lahir_ibu
    ? parseDMY(formData.ibu.tanggal_lahir_ibu)
    : new Date();
  const [motherBirthDate, setMotherBirthDate] = useState(initialMotherBirth);
  const [showMotherBirthPicker, setShowMotherBirthPicker] = useState(false);

  // Mother's death date picker
  const initialMotherDeath = formData.ibu.tanggal_kematian_ibu
    ? parseDMY(formData.ibu.tanggal_kematian_ibu)
    : new Date();
  const [motherDeathDate, setMotherDeathDate] = useState(initialMotherDeath);
  const [showMotherDeathPicker, setShowMotherDeathPicker] = useState(false);

  // Guardian's birth date picker
  const initialGuardianBirth = formData.wali.tanggal_lahir_wali
    ? parseDMY(formData.wali.tanggal_lahir_wali)
    : new Date();
  const [guardianBirthDate, setGuardianBirthDate] = useState(initialGuardianBirth);
  const [showGuardianBirthPicker, setShowGuardianBirthPicker] = useState(false);

  useEffect(() => {
    setIsMotherDeceased(!!formData.ibu.tanggal_kematian_ibu);
    const { status_ortu } = formData.keluarga;
    const { tinggal_bersama } = formData.anak;
    const needsGuardian =
      tinggal_bersama === 'Wali' ||
      status_ortu === 'yatim piatu' ||
      (status_ortu === 'yatim' && tinggal_bersama === 'Ibu' && !!formData.ibu.tanggal_kematian_ibu);
    setShowGuardianSection(needsGuardian);
  }, [
    formData.ibu.tanggal_kematian_ibu,
    formData.keluarga.status_ortu,
    formData.anak.tinggal_bersama
  ]);
  
  const handleMotherInputChange = (name, value) => {
    dispatch(updateFormData({ section: 'ibu', data: { [name]: value } }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };
  const handleGuardianInputChange = (name, value) => {
    dispatch(updateFormData({ section: 'wali', data: { [name]: value } }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const toggleMotherDeceasedStatus = (value) => {
    setIsMotherDeceased(value);
    if (!value) {
      dispatch(updateFormData({ section: 'ibu', data: {
        tanggal_kematian_ibu: '',
        penyebab_kematian_ibu: ''
      }}));
    }
    const { status_ortu } = formData.keluarga;
    const { tinggal_bersama } = formData.anak;
    if (value && (status_ortu === 'piatu' || tinggal_bersama === 'Ibu')) {
      setShowGuardianSection(true);
    }
  };
  const toggleGuardianSection = () => {
    if (showGuardianSection) {
      dispatch(updateFormData({ section: 'wali', data: {
        nik_wali: '',
        nama_wali: '',
        agama_wali: 'Islam',
        tempat_lahir_wali: '',
        tanggal_lahir_wali: '',
        alamat_wali: '',
        penghasilan_wali: '',
        hub_kerabat_wali: ''
      }}));
    }
    setShowGuardianSection(prev => !prev);
  };

  const onMotherBirthChange = (event, date) => {
    setShowMotherBirthPicker(Platform.OS === 'ios');
    if (date) {
      setMotherBirthDate(date);
      handleMotherInputChange('tanggal_lahir_ibu', formatDMY(date));
    }
  };
  const onMotherDeathChange = (event, date) => {
    setShowMotherDeathPicker(Platform.OS === 'ios');
    if (date) {
      setMotherDeathDate(date);
      handleMotherInputChange('tanggal_kematian_ibu', formatDMY(date));
    }
  };
  const onGuardianBirthChange = (event, date) => {
    setShowGuardianBirthPicker(Platform.OS === 'ios');
    if (date) {
      setGuardianBirthDate(date);
      handleGuardianInputChange('tanggal_lahir_wali', formatDMY(date));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { ibu, wali } = formData;
    const { status_ortu } = formData.keluarga;
    const { tinggal_bersama } = formData.anak;
    const motherInfoRequired = status_ortu !== 'piatu' && status_ortu !== 'yatim piatu';

    if (motherInfoRequired) {
      if (!ibu.nama_ibu) newErrors.nama_ibu = 'Nama ibu wajib diisi';
      if (ibu.nik_ibu && (!/^[0-9]+$/.test(ibu.nik_ibu) || ibu.nik_ibu.length !== 16))
        newErrors.nik_ibu = 'NIK harus 16 digit angka';
      if (isMotherDeceased) {
        if (!ibu.tanggal_kematian_ibu) newErrors.tanggal_kematian_ibu = 'Tanggal kematian wajib diisi';
        if (!ibu.penyebab_kematian_ibu) newErrors.penyebab_kematian_ibu = 'Penyebab kematian wajib diisi';
      }
    }

    if (showGuardianSection) {
      if (!wali.nama_wali) newErrors.nama_wali = 'Nama wali wajib diisi';
      if (!wali.hub_kerabat_wali) newErrors.hub_kerabat_wali = 'Hubungan kerabat wajib dipilih';
      if (wali.nik_wali && (!/^[0-9]+$/.test(wali.nik_wali) || wali.nik_wali.length !== 16))
        newErrors.nik_wali = 'NIK harus 16 digit angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateForm()) dispatch(nextStep()); };
  const handleBack = () => dispatch(prevStep());

  const incomeOptions = [
    { label: 'Di bawah Rp 500.000', value: 'dibawah_500k' },
    { label: 'Rp 500.000 - Rp 1.500.000', value: '500k_1500k' },
    { label: 'Rp 1.500.000 - Rp 2.500.000', value: '1500k_2500k' },
    { label: 'Rp 2.500.000 - Rp 3.500.000', value: '2500k_3500k' },
    { label: 'Rp 3.500.000 - Rp 5.000.000', value: '3500k_5000k' },
    { label: 'Rp 5.000.000 - Rp 7.000.000', value: '5000k_7000k' },
    { label: 'Rp 7.000.000 - Rp 10.000.000', value: '7000k_10000k' },
    { label: 'Di atas Rp 10.000.000', value: 'diatas_10000k' }
  ];
  const religionOptions = [
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Budha', value: 'Budha' },
    { label: 'Konghucu', value: 'Konghucu' }
  ];
  const relationshipOptions = [
    { label: 'Kakak', value: 'Kakak' },
    { label: 'Saudara dari Ayah', value: 'Saudara dari Ayah' },
    { label: 'Saudara dari Ibu', value: 'Saudara dari Ibu' },
    { label: 'Tidak Ada Hubungan Keluarga', value: 'Tidak Ada Hubungan Keluarga' }
  ];

  const { status_ortu } = formData.keluarga;
  const isMotherInfoNeeded = status_ortu !== 'piatu' && status_ortu !== 'yatim piatu';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Ibu & Wali</Text>

      {!isMotherInfoNeeded ? (
        <View style={styles.notRequiredContainer}>
          <Text style={styles.notRequiredText}>
            Data ibu tidak diperlukan karena status orangtua {status_ortu}.
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Data Ibu</Text>
          <Input
            label="NIK"
            value={formData.ibu.nik_ibu}
            onChangeText={v => handleMotherInputChange('nik_ibu', v)}
            placeholder="Masukkan NIK ibu"
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik_ibu}
          />
          <Input
            label="Nama Ibu *"
            value={formData.ibu.nama_ibu}
            onChangeText={v => handleMotherInputChange('nama_ibu', v)}
            placeholder="Masukkan nama lengkap ibu"
            error={errors.nama_ibu}
          />
          <DropdownSelect
            label="Agama"
            value={formData.ibu.agama_ibu}
            options={religionOptions}
            onValueChange={v => handleMotherInputChange('agama_ibu', v)}
            placeholder="Pilih agama"
            error={errors.agama_ibu}
          />
          <Input
            label="Tempat Lahir"
            value={formData.ibu.tempat_lahir_ibu}
            onChangeText={v => handleMotherInputChange('tempat_lahir_ibu', v)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir_ibu}
          />
          <Text style={styles.sectionTitle}>Tanggal Lahir *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowMotherBirthPicker(true)}
          >
            <Text>
              {formData.ibu.tanggal_lahir_ibu || formatDMY(motherBirthDate)}
            </Text>
          </TouchableOpacity>
          {errors.tanggal_lahir_ibu && (
            <Text style={styles.errorText}>{errors.tanggal_lahir_ibu}</Text>
          )}
          {showMotherBirthPicker && (
            <DateTimePicker
              value={motherBirthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={onMotherBirthChange}
            />
          )}
          <Input
            label="Alamat"
            value={formData.ibu.alamat_ibu}
            onChangeText={v => handleMotherInputChange('alamat_ibu', v)}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={3}
            error={errors.alamat_ibu}
          />
          <DropdownSelect
            label="Penghasilan"
            value={formData.ibu.penghasilan_ibu}
            options={incomeOptions}
            onValueChange={v => handleMotherInputChange('penghasilan_ibu', v)}
            placeholder="Pilih rentang penghasilan"
            error={errors.penghasilan_ibu}
          />
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>Sudah Meninggal?</Text>
            <Switch
              value={isMotherDeceased}
              onValueChange={toggleMotherDeceasedStatus}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isMotherDeceased ? '#2E86DE' : '#f4f3f4'}
            />
          </View>
          {isMotherDeceased && (
            <View style={styles.conditionalSection}>
              <Text style={styles.sectionTitle}>Tanggal Kematian *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowMotherDeathPicker(true)}
              >
                <Text>
                  {formData.ibu.tanggal_kematian_ibu || formatDMY(motherDeathDate)}
                </Text>
              </TouchableOpacity>
              {errors.tanggal_kematian_ibu && (
                <Text style={styles.errorText}>{errors.tanggal_kematian_ibu}</Text>
              )}
              {showMotherDeathPicker && (
                <DateTimePicker
                  value={motherDeathDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={onMotherDeathChange}
                />
              )}
              <Input
                label="Penyebab Kematian *"
                value={formData.ibu.penyebab_kematian_ibu}
                onChangeText={v => handleMotherInputChange('penyebab_kematian_ibu', v)}
                placeholder="Masukkan penyebab kematian"
                error={errors.penyebab_kematian_ibu}
              />
            </View>
          )}
        </View>
      )}

      {showGuardianSection ? (
        <View style={styles.formContainer}>
          <View style={styles.guardianHeaderContainer}>
            <Text style={styles.sectionTitle}>Data Wali</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={toggleGuardianSection}
            >
              <Text style={styles.removeButtonText}>Hapus Data Wali</Text>
            </TouchableOpacity>
          </View>
          <Input
            label="NIK"
            value={formData.wali.nik_wali}
            onChangeText={v => handleGuardianInputChange('nik_wali', v)}
            placeholder="Masukkan NIK wali"
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik_wali}
          />
          <Input
            label="Nama Wali *"
            value={formData.wali.nama_wali}
            onChangeText={v => handleGuardianInputChange('nama_wali', v)}
            placeholder="Masukkan nama lengkap wali"
            error={errors.nama_wali}
          />
          <DropdownSelect
            label="Hubungan Kerabat *"
            value={formData.wali.hub_kerabat_wali}
            options={relationshipOptions}
            onValueChange={v => handleGuardianInputChange('hub_kerabat_wali', v)}
            placeholder="Pilih hubungan kerabat"
            error={errors.hub_kerabat_wali}
          />
          <DropdownSelect
            label="Agama"
            value={formData.wali.agama_wali}
            options={religionOptions}
            onValueChange={v => handleGuardianInputChange('agama_wali', v)}
            placeholder="Pilih agama"
            error={errors.agama_wali}
          />
          <Input
            label="Tempat Lahir"
            value={formData.wali.tempat_lahir_wali}
            onChangeText={v => handleGuardianInputChange('tempat_lahir_wali', v)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir_wali}
          />
          <Text style={styles.sectionTitle}>Tanggal Lahir *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowGuardianBirthPicker(true)}
          >
            <Text>
              {formData.wali.tanggal_lahir_wali || formatDMY(guardianBirthDate)}
            </Text>
          </TouchableOpacity>
          {errors.tanggal_lahir_wali && (
            <Text style={styles.errorText}>{errors.tanggal_lahir_wali}</Text>
          )}
          {showGuardianBirthPicker && (
            <DateTimePicker
              value={guardianBirthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={onGuardianBirthChange}
            />
          )}
          <Input
            label="Alamat"
            value={formData.wali.alamat_wali}
            onChangeText={v => handleGuardianInputChange('alamat_wali', v)}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={3}
            error={errors.alamat_wali}
          />
          <DropdownSelect
            label="Penghasilan"
            value={formData.wali.penghasilan_wali}
            options={incomeOptions}
            onValueChange={v => handleGuardianInputChange('penghasilan_wali', v)}
            placeholder="Pilih rentang penghasilan"
            error={errors.penghasilan_wali}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addGuardianButton}
          onPress={toggleGuardianSection}
        >
          <Text style={styles.addGuardianText}>+ Tambahkan Data Wali</Text>
        </TouchableOpacity>
      )}

      <FormButtons
        onNext={handleNext}
        onBack={handleBack}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 16, paddingBottom: 100 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
    textAlign: 'center',
    marginBottom: 20
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
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12
  },
  errorText: {
    color: 'red',
    marginTop: 4
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  conditionalSection: {
    borderLeftWidth: 2,
    borderLeftColor: '#2E86DE',
    paddingLeft: 10,
    marginBottom: 15
  },
  notRequiredContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cce5ff'
  },
  notRequiredText: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  addGuardianButton: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2E86DE'
  },
  addGuardianText: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: '600'
  },
  guardianHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  removeButton: {
    backgroundColor: '#ffeeee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '600'
  }
});

export default KeluargaStepLimaScreen;
