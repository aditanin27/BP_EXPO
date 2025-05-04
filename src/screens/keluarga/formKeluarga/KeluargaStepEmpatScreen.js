// src/screens/KeluargaStepEmpatScreen.js

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
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  updateFormData, 
  nextStep,
  prevStep
} from '../../../redux/slices/keluargaSlice';
import Input from '../../../components/Input';
import DropdownSelect from '../../../components/DropdownSelect';
import FormButtons from '../../../components/FormButtons';
import DateTimePicker from '@react-native-community/datetimepicker';

const KeluargaStepEmpatScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);

  const [errors, setErrors] = useState({});
  const [isDeceased, setIsDeceased] = useState(false);

  // helper to format Date object as DD-MM-YYYY
  const formatDMY = (d) => {
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year  = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // parse string "DD-MM-YYYY" into Date
  const parseDMY = (str) => {
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // birth date picker state
  const initialBirth = formData.ayah.tanggal_lahir_ayah
    ? parseDMY(formData.ayah.tanggal_lahir_ayah)
    : new Date();
  const [birthDate, setBirthDate] = useState(initialBirth);
  const [showBirthPicker, setShowBirthPicker] = useState(false);

  // death date picker state
  const initialDeath = formData.ayah.tanggal_kematian_ayah
    ? parseDMY(formData.ayah.tanggal_kematian_ayah)
    : new Date();
  const [deathDate, setDeathDate] = useState(initialDeath);
  const [showDeathPicker, setShowDeathPicker] = useState(false);

  // sync deceased flag with existing form data
  useEffect(() => {
    setIsDeceased(!!formData.ayah.tanggal_kematian_ayah);
  }, [formData.ayah.tanggal_kematian_ayah]);

  const handleInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'ayah',
      data: { [name]: value }
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const toggleDeceasedStatus = (value) => {
    setIsDeceased(value);
    if (!value) {
      dispatch(updateFormData({
        section: 'ayah',
        data: {
          tanggal_kematian_ayah: '',
          penyebab_kematian_ayah: ''
        }
      }));
    }
  };

  const onBirthChange = (event, selectedDate) => {
    setShowBirthPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
      const dmy = formatDMY(selectedDate);
      handleInputChange('tanggal_lahir_ayah', dmy);
    }
  };
  const showBirthDatePicker = () => setShowBirthPicker(true);

  const onDeathChange = (event, selectedDate) => {
    setShowDeathPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDeathDate(selectedDate);
      const dmy = formatDMY(selectedDate);
      handleInputChange('tanggal_kematian_ayah', dmy);
    }
  };
  const showDeathDatePicker = () => setShowDeathPicker(true);

  const validateForm = () => {
    const newErrors = {};
    const { ayah } = formData;

    // optional NIK but if given must be 16 digits
    if (ayah.nik_ayah && (!/^\d+$/.test(ayah.nik_ayah) || ayah.nik_ayah.length !== 16)) {
      newErrors.nik_ayah = 'NIK harus 16 digit angka';
    }

    // if deceased, require death date & reason
    if (isDeceased) {
      if (!ayah.tanggal_kematian_ayah) newErrors.tanggal_kematian_ayah = 'Tanggal kematian wajib diisi';
      if (!ayah.penyebab_kematian_ayah) newErrors.penyebab_kematian_ayah = 'Penyebab kematian wajib diisi';
    }

    // check if father info is required by status_ortu
    const { status_ortu } = formData.keluarga;
    const fatherInfoRequired = status_ortu !== 'yatim' && status_ortu !== 'yatim piatu';
    if (fatherInfoRequired && !ayah.nama_ayah) {
      newErrors.nama_ayah = 'Nama ayah wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) dispatch(nextStep());
  };
  const handleBack = () => dispatch(prevStep());

  // options
  const incomeOptions = [
    { label: 'Di bawah Rp 500.000', value: 'dibawah_500k' },
    { label: 'Rp 500.000 - Rp 1.500.000', value: '500k_1500k' },
    { label: 'Rp 1.500.000 - Rp 2.500.000', value: '1500k_2500k' },
    { label: 'Rp 2.500.000 - Rp 3.500.000', value: '2500k_3500k' },
    { label: 'Rp 3.500.000 - Rp 5.000.000', value: '3500k_5000k' },
    { label: 'Rp 5.000.000 - Rp 7.000.000', value: '5000k_7000k' },
    { label: 'Rp 7.000.000 - Rp 10.000.000', value: '7000k_10000k' },
    { label: 'Di atas Rp 10.000.000', value: 'diatas_10000k' },
  ];
  const religionOptions = [
    { label: 'Islam', value: 'Islam' },
    { label: 'Kristen', value: 'Kristen' },
    { label: 'Katolik', value: 'Katolik' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Budha', value: 'Budha' },
    { label: 'Konghucu', value: 'Konghucu' },
  ];

  const { status_ortu } = formData.keluarga;
  const isFatherInfoNeeded = status_ortu !== 'yatim' && status_ortu !== 'yatim piatu';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Ayah</Text>

      {!isFatherInfoNeeded ? (
        <View style={styles.notRequiredContainer}>
          <Text style={styles.notRequiredText}>
            Data ayah tidak diperlukan karena status orangtua {status_ortu}.
          </Text>
          <Text style={styles.notRequiredSubtext}>
            Anda dapat langsung melanjutkan ke langkah berikutnya.
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* Data Diri */}
          <Text style={styles.sectionTitle}>Data Diri</Text>
          <Input
            label="NIK"
            value={formData.ayah.nik_ayah}
            onChangeText={v => handleInputChange('nik_ayah', v)}
            placeholder="Masukkan NIK ayah"
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik_ayah}
          />
          <Input
            label="Nama Ayah *"
            value={formData.ayah.nama_ayah}
            onChangeText={v => handleInputChange('nama_ayah', v)}
            placeholder="Masukkan nama lengkap ayah"
            error={errors.nama_ayah}
          />
          <DropdownSelect
            label="Agama"
            value={formData.ayah.agama_ayah}
            options={religionOptions}
            onValueChange={v => handleInputChange('agama_ayah', v)}
            placeholder="Pilih agama"
            error={errors.agama_ayah}
          />
          <Input
            label="Tempat Lahir"
            value={formData.ayah.tempat_lahir_ayah}
            onChangeText={v => handleInputChange('tempat_lahir_ayah', v)}
            placeholder="Masukkan tempat lahir"
            error={errors.tempat_lahir_ayah}
          />

          {/* Tanggal Lahir */}
          <Text style={styles.sectionTitle}>Tanggal Lahir *</Text>
          <TouchableOpacity onPress={showBirthDatePicker} style={styles.dateInput}>
            <Text>{formData.ayah.tanggal_lahir_ayah || formatDMY(birthDate)}</Text>
          </TouchableOpacity>
          {errors.tanggal_lahir_ayah && <Text style={styles.errorText}>{errors.tanggal_lahir_ayah}</Text>}
          {showBirthPicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onBirthChange}
              maximumDate={new Date()}
            />
          )}

          {/* Alamat & Penghasilan */}
          <Text style={styles.sectionTitle}>Alamat & Penghasilan</Text>
          <Input
            label="Alamat"
            value={formData.ayah.alamat_ayah}
            onChangeText={v => handleInputChange('alamat_ayah', v)}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={3}
            error={errors.alamat_ayah}
          />
          <DropdownSelect
            label="Penghasilan"
            value={formData.ayah.penghasilan_ayah}
            options={incomeOptions}
            onValueChange={v => handleInputChange('penghasilan_ayah', v)}
            placeholder="Pilih rentang penghasilan"
            error={errors.penghasilan_ayah}
          />

          {/* Meninggal? */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>Sudah Meninggal?</Text>
            <Switch
              value={isDeceased}
              onValueChange={toggleDeceasedStatus}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDeceased ? '#2E86DE' : '#f4f3f4'}
            />
          </View>

          {isDeceased && (
            <View style={styles.conditionalSection}>
              <Text style={styles.sectionTitle}>Tanggal Kematian *</Text>
              <TouchableOpacity onPress={showDeathDatePicker} style={styles.dateInput}>
                <Text>{formData.ayah.tanggal_kematian_ayah || formatDMY(deathDate)}</Text>
              </TouchableOpacity>
              {errors.tanggal_kematian_ayah && <Text style={styles.errorText}>{errors.tanggal_kematian_ayah}</Text>}
              {showDeathPicker && (
                <DateTimePicker
                  value={deathDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDeathChange}
                  maximumDate={new Date()}
                />
              )}

              <Input
                label="Penyebab Kematian *"
                value={formData.ayah.penyebab_kematian_ayah}
                onChangeText={v => handleInputChange('penyebab_kematian_ayah', v)}
                placeholder="Masukkan penyebab kematian"
                error={errors.penyebab_kematian_ayah}
              />
            </View>
          )}
        </View>
      )}

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
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  conditionalSection: {
    borderLeftWidth: 2,
    borderLeftColor: '#2E86DE',
    paddingLeft: 10,
    marginBottom: 15,
  },
  notRequiredContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cce5ff',
  },
  notRequiredText: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  notRequiredSubtext: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default KeluargaStepEmpatScreen;
