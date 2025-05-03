// src/screens/KeluargaStepTigaScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
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
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FormButtons from '../../../components/FormButtons';
import DateTimePicker from '@react-native-community/datetimepicker';

const KeluargaStepTigaScreen = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.keluarga);

  const [errors, setErrors] = useState({});

  // helper to format Date object as DD-MM-YYYY
  const formatDMY = (d) => {
    const day   = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year  = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // initialize date picker from formData (expects "DD-MM-YYYY") or today
  const parseDMY = (str) => {
    const [day, month, year] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const initialDate = formData.anak.tanggal_lahir
    ? parseDMY(formData.anak.tanggal_lahir)
    : new Date();
  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name, value) => {
    dispatch(updateFormData({
      section: 'anak',
      data: { [name]: value }
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const dmyString = formatDMY(selectedDate);
      handleInputChange('tanggal_lahir', dmyString);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const validateForm = () => {
    const newErrors = {};
    const { anak } = formData;

    if (!anak.nik_anak.trim()) newErrors.nik_anak = 'NIK anak wajib diisi';
    else if (!/^\d+$/.test(anak.nik_anak)) newErrors.nik_anak = 'NIK anak harus berupa angka';
    else if (anak.nik_anak.length !== 16) newErrors.nik_anak = 'NIK anak harus 16 digit';

    if (!anak.anak_ke.trim()) newErrors.anak_ke = 'Anak ke wajib diisi';
    else if (isNaN(Number(anak.anak_ke)) || Number(anak.anak_ke) < 1) newErrors.anak_ke = 'Anak ke harus berupa angka positif';

    if (!anak.dari_bersaudara.trim()) newErrors.dari_bersaudara = 'Jumlah saudara wajib diisi';
    else if (isNaN(Number(anak.dari_bersaudara)) || Number(anak.dari_bersaudara) < 1) newErrors.dari_bersaudara = 'Jumlah saudara harus berupa angka positif';

    if (!anak.nick_name.trim()) newErrors.nick_name = 'Nama panggilan wajib diisi';
    if (!anak.full_name.trim()) newErrors.full_name = 'Nama lengkap wajib diisi';
    if (!anak.tempat_lahir.trim()) newErrors.tempat_lahir = 'Tempat lahir wajib diisi';
    if (!anak.tanggal_lahir.trim()) newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    if (!anak.tinggal_bersama) newErrors.tinggal_bersama = 'Tinggal bersama wajib dipilih';
    if (!anak.transportasi.trim()) newErrors.transportasi = 'Transportasi wajib diisi';
    if (anak.jarak_rumah && isNaN(Number(anak.jarak_rumah))) newErrors.jarak_rumah = 'Jarak rumah harus berupa angka';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) dispatch(nextStep());
  };
  const handleBack = () => dispatch(prevStep());

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Informasi Anak</Text>
      <View style={styles.formContainer}>
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Foto Anak</Text>
          <ImagePickerComponent
            imageUri={formData.anak.foto ? formData.anak.foto.uri : null}
            onImageSelected={(img) => handleInputChange('foto', img)}
          />
        </View>

        <Text style={styles.sectionTitle}>Identitas Dasar</Text>
        <Input
          label="NIK *"
          value={formData.anak.nik_anak}
          onChangeText={(v) => handleInputChange('nik_anak', v)}
          placeholder="Masukkan NIK anak"
          keyboardType="number-pad"
          maxLength={16}
          error={errors.nik_anak}
        />

        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Input
              label="Anak ke *"
              value={formData.anak.anak_ke}
              onChangeText={(v) => handleInputChange('anak_ke', v)}
              placeholder="Contoh: 2"
              keyboardType="number-pad"
              error={errors.anak_ke}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Dari Bersaudara *"
              value={formData.anak.dari_bersaudara}
              onChangeText={(v) => handleInputChange('dari_bersaudara', v)}
              placeholder="Contoh: 3"
              keyboardType="number-pad"
              error={errors.dari_bersaudara}
            />
          </View>
        </View>

        <Input
          label="Nama Panggilan *"
          value={formData.anak.nick_name}
          onChangeText={(v) => handleInputChange('nick_name', v)}
          placeholder="Masukkan nama panggilan"
          error={errors.nick_name}
        />

        <Input
          label="Nama Lengkap *"
          value={formData.anak.full_name}
          onChangeText={(v) => handleInputChange('full_name', v)}
          placeholder="Masukkan nama lengkap"
          error={errors.full_name}
        />

        <DropdownSelect
          label="Agama *"
          value={formData.anak.agama}
          options={religionOptions}
          onValueChange={(v) => handleInputChange('agama', v)}
          placeholder="Pilih agama"
          error={errors.agama}
        />

        <Input
          label="Tempat Lahir *"
          value={formData.anak.tempat_lahir}
          onChangeText={(v) => handleInputChange('tempat_lahir', v)}
          placeholder="Masukkan tempat lahir"
          error={errors.tempat_lahir}
        />

        <Text style={styles.sectionTitle}>Tanggal Lahir *</Text>
        <TouchableOpacity onPress={showDatePickerModal} style={styles.dateInput}>
          <Text>{formatDMY(date)}</Text>
        </TouchableOpacity>
        {errors.tanggal_lahir && <Text style={styles.errorText}>{errors.tanggal_lahir}</Text>}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <DropdownSelect
          label="Jenis Kelamin *"
          value={formData.anak.jenis_kelamin}
          options={genderOptions}
          onValueChange={(v) => handleInputChange('jenis_kelamin', v)}
          placeholder="Pilih jenis kelamin"
          error={errors.jenis_kelamin}
        />

        <DropdownSelect
          label="Tinggal Bersama *"
          value={formData.anak.tinggal_bersama}
          options={livingWithOptions}
          onValueChange={(v) => handleInputChange('tinggal_bersama', v)}
          placeholder="Pilih tinggal bersama"
          error={errors.tinggal_bersama}
        />

        <Text style={styles.sectionTitle}>Informasi Tambahan</Text>

        <DropdownSelect
          label="Jenis Anak Binaan *"
          value={formData.anak.jenis_anak_binaan}
          options={childTypeOptions}
          onValueChange={(v) => handleInputChange('jenis_anak_binaan', v)}
          placeholder="Pilih jenis anak binaan"
          error={errors.jenis_anak_binaan}
        />

        <DropdownSelect
          label="Hafalan *"
          value={formData.anak.hafalan}
          options={hafalanOptions}
          onValueChange={(v) => handleInputChange('hafalan', v)}
          placeholder="Pilih jenis hafalan"
          error={errors.hafalan}
        />

        <Input
          label="Pelajaran Favorit"
          value={formData.anak.pelajaran_favorit}
          onChangeText={(v) => handleInputChange('pelajaran_favorit', v)}
          placeholder="Masukkan pelajaran favorit"
          error={errors.pelajaran_favorit}
        />

        <Input
          label="Hobi"
          value={formData.anak.hobi}
          onChangeText={(v) => handleInputChange('hobi', v)}
          placeholder="Masukkan hobi"
          error={errors.hobi}
        />

        <Input
          label="Prestasi"
          value={formData.anak.prestasi}
          onChangeText={(v) => handleInputChange('prestasi', v)}
          placeholder="Masukkan prestasi"
          error={errors.prestasi}
        />

        <Input
          label="Jarak Rumah (km)"
          value={formData.anak.jarak_rumah}
          onChangeText={(v) => handleInputChange('jarak_rumah', v)}
          placeholder="Contoh: 2.5"
          keyboardType="numeric"
          error={errors.jarak_rumah}
        />

        <DropdownSelect
          label="Transportasi *"
          value={formData.anak.transportasi}
          options={transportOptions}
          onValueChange={(v) => handleInputChange('transportasi', v)}
          placeholder="Pilih transportasi"
          error={errors.transportasi}
        />
      </View>

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
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
});

export default KeluargaStepTigaScreen;
