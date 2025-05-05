import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  resetFormData, 
  createKeluarga, 
  resetKeluargaState
} from '../../../redux/slices/keluargaSlice';
import LoadingOverlay from '../../../components/LoadingOverlay';

// Form steps
import KeluargaStep1 from './KeluargaStep1';
import AyahStep2 from './AyahStep2';
import IbuStep3 from './IbuStep3';
import WaliStep4 from './WaliStep4';
import AnakStep5 from './AnakStep5';

const TambahKeluargaScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    formData, 
    isLoading, 
    error, 
    createSuccess,
    dropdownData,
    wilbinOptions,
    shelterOptions
  } = useAppSelector((state) => state.keluarga);
  
  // Reset form when the component mounts
  useEffect(() => {
    dispatch(resetFormData());
  }, [dispatch]);
  
  // Handle successful form submission
  useEffect(() => {
    if (createSuccess) {
      Alert.alert(
        'Berhasil',
        'Data keluarga berhasil disimpan',
        [
          { 
            text: 'OK', 
            onPress: () => {
              dispatch(resetKeluargaState());
              navigation.navigate('KeluargaList');
            }
          }
        ]
      );
    }
  }, [createSuccess, dispatch, navigation]);
  
  // Handle form errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetKeluargaState());
    }
  }, [error, dispatch]);
  
  // Submit form data
  const handleSubmit = () => {
    // Prepare data
    const keluargaData = {
      // Keluarga data
      ...formData.keluarga,
      
      // Ayah data prefixed with ayah_*
      nik_ayah: formData.ayah.nik_ayah,
      nama_ayah: formData.ayah.nama_ayah,
      agama_ayah: formData.ayah.agama_ayah,
      tempat_lahir_ayah: formData.ayah.tempat_lahir_ayah,
      tanggal_lahir_ayah: formData.ayah.tanggal_lahir_ayah,
      alamat_ayah: formData.ayah.alamat_ayah,
      id_prov_ayah: formData.ayah.id_prov_ayah,
      id_kab_ayah: formData.ayah.id_kab_ayah,
      id_kec_ayah: formData.ayah.id_kec_ayah,
      id_kel_ayah: formData.ayah.id_kel_ayah,
      penghasilan_ayah: formData.ayah.penghasilan_ayah,
      tanggal_kematian_ayah: formData.ayah.tanggal_kematian_ayah,
      penyebab_kematian_ayah: formData.ayah.penyebab_kematian_ayah,
      
      // Ibu data prefixed with ibu_*
      nik_ibu: formData.ibu.nik_ibu,
      nama_ibu: formData.ibu.nama_ibu,
      agama_ibu: formData.ibu.agama_ibu,
      tempat_lahir_ibu: formData.ibu.tempat_lahir_ibu,
      tanggal_lahir_ibu: formData.ibu.tanggal_lahir_ibu,
      alamat_ibu: formData.ibu.alamat_ibu,
      id_prov_ibu: formData.ibu.id_prov_ibu,
      id_kab_ibu: formData.ibu.id_kab_ibu,
      id_kec_ibu: formData.ibu.id_kec_ibu,
      id_kel_ibu: formData.ibu.id_kel_ibu,
      penghasilan_ibu: formData.ibu.penghasilan_ibu,
      tanggal_kematian_ibu: formData.ibu.tanggal_kematian_ibu,
      penyebab_kematian_ibu: formData.ibu.penyebab_kematian_ibu,
      
      // Wali data prefixed with wali_*
      nik_wali: formData.wali.nik_wali,
      nama_wali: formData.wali.nama_wali,
      agama_wali: formData.wali.agama_wali,
      tempat_lahir_wali: formData.wali.tempat_lahir_wali,
      tanggal_lahir_wali: formData.wali.tanggal_lahir_wali,
      alamat_wali: formData.wali.alamat_wali,
      id_prov_wali: formData.wali.id_prov_wali,
      id_kab_wali: formData.wali.id_kab_wali,
      id_kec_wali: formData.wali.id_kec_wali,
      id_kel_wali: formData.wali.id_kel_wali,
      penghasilan_wali: formData.wali.penghasilan_wali,
      hub_kerabat_wali: formData.wali.hub_kerabat_wali,
      
      // Anak & pendidikan data
      nik_anak: formData.anak.nik_anak,
      anak_ke: formData.anak.anak_ke,
      dari_bersaudara: formData.anak.dari_bersaudara,
      nick_name: formData.anak.nick_name,
      full_name: formData.anak.full_name,
      agama: formData.anak.agama,
      tempat_lahir: formData.anak.tempat_lahir,
      tanggal_lahir: formData.anak.tanggal_lahir,
      jenis_kelamin: formData.anak.jenis_kelamin,
      tinggal_bersama: formData.anak.tinggal_bersama,
      jenis_anak_binaan: formData.anak.jenis_anak_binaan,
      hafalan: formData.anak.hafalan,
      pelajaran_favorit: formData.anak.pelajaran_favorit,
      hobi: formData.anak.hobi,
      prestasi: formData.anak.prestasi,
      jarak_rumah: formData.anak.jarak_rumah,
      transportasi: formData.anak.transportasi,
      foto: formData.anak.foto,
      
      // Pendidikan data
      jenjang: formData.pendidikan.jenjang,
      kelas: formData.pendidikan.kelas,
      nama_sekolah: formData.pendidikan.nama_sekolah,
      alamat_sekolah: formData.pendidikan.alamat_sekolah,
      jurusan: formData.pendidikan.jurusan,
      semester: formData.pendidikan.semester,
      nama_pt: formData.pendidikan.nama_pt,
      alamat_pt: formData.pendidikan.alamat_pt,
    };
    
    // Remove data based on user choices
    if (formData.keluarga.bank_choice === 'no') {
      delete keluargaData.id_bank;
      keluargaData.no_rek = null;
      keluargaData.an_rek = null;
    }
    
    if (formData.keluarga.telp_choice === 'no') {
      keluargaData.no_tlp = null;
      keluargaData.an_tlp = null;
    }
    
    // Submit the data
    dispatch(createKeluarga(keluargaData));
  };
  
  // Render the appropriate step based on the current step index
  const renderStep = () => {
    switch (formData.currentStep) {
      case 0:
        return (
          <KeluargaStep1 
            navigation={navigation} 
            dropdownData={dropdownData}
            wilbinOptions={wilbinOptions}
            shelterOptions={shelterOptions}
          />
        );
      case 1:
        return <AyahStep2 navigation={navigation} />;
      case 2:
        return <IbuStep3 navigation={navigation} />;
      case 3:
        return <WaliStep4 navigation={navigation} />;
      case 4:
        return (
          <AnakStep5 
            navigation={navigation} 
            onSubmit={handleSubmit}
          />
        );
      default:
        return <KeluargaStep1 navigation={navigation} />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {renderStep()}
        </View>
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
  content: {
    flex: 1,
  },
});

export default TambahKeluargaScreen;