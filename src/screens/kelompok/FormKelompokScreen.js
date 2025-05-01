import React, { useState, useEffect } from 'react';
import { 
 View, 
 Text, 
 StyleSheet, 
 ScrollView, 
 SafeAreaView,
 Alert 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
 createKelompok, 
 updateKelompok, 
 fetchLevelAnakBinaan,
 fetchKelompokDetail,
 resetKelompokSuccess,
 resetKelompokError
} from '../../redux/slices/kelompokSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import DropdownSelect from '../../components/DropdownSelect';
import LoadingOverlay from '../../components/LoadingOverlay';

const FormKelompokScreen = ({ route, navigation }) => {
 const { id_kelompok } = route.params || {};
 const isEditing = !!id_kelompok;
 
 const dispatch = useAppDispatch();
 const { 
   levels, 
   detail, 
   isLoading, 
   isLoadingLevels, 
   error, 
   createSuccess, 
   updateSuccess 
 } = useAppSelector((state) => state.kelompok);
 
 const [formData, setFormData] = useState({
   nama_kelompok: '',
   id_level_anak_binaan: '',
   jumlah_anggota: '0'
 });
 
 const [errors, setErrors] = useState({});
 
 // Fetch level anak binaan when component mounts
 useEffect(() => {
   dispatch(fetchLevelAnakBinaan());
   
   // If editing, fetch kelompok detail
   if (isEditing) {
     dispatch(fetchKelompokDetail(id_kelompok));
   }
   
   // Reset success and error states when component unmounts
   return () => {
     dispatch(resetKelompokSuccess());
     dispatch(resetKelompokError());
   };
 }, [dispatch, id_kelompok, isEditing]);
 
 // Populate form data when detail changes (for editing)
 useEffect(() => {
   if (isEditing && detail) {
     setFormData({
       nama_kelompok: detail.nama_kelompok || '',
       id_level_anak_binaan: detail.id_level_anak_binaan || '',
       jumlah_anggota: detail.jumlah_anggota ? String(detail.jumlah_anggota) : '0'
     });
   }
 }, [isEditing, detail]);
 
 // Handle success responses
 useEffect(() => {
   if (createSuccess) {
     Alert.alert('Sukses', 'Kelompok berhasil dibuat');
     navigation.goBack();
   }
   
   if (updateSuccess) {
     Alert.alert('Sukses', 'Kelompok berhasil diperbarui');
     navigation.goBack();
   }
 }, [createSuccess, updateSuccess, navigation]);
 
 // Handle form input changes
 const handleInputChange = (name, value) => {
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
   
   // Clear error for this field
   if (errors[name]) {
     setErrors(prev => ({
       ...prev,
       [name]: null
     }));
   }
 };
 
 // Validate form
 const validateForm = () => {
   const newErrors = {};
   
   if (!formData.nama_kelompok.trim()) {
     newErrors.nama_kelompok = 'Nama kelompok wajib diisi';
   }
   
   if (!formData.id_level_anak_binaan) {
     newErrors.id_level_anak_binaan = 'Level anak binaan wajib dipilih';
   }
   
   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };
 
 // Handle form submission
 const handleSubmit = () => {
   if (validateForm()) {
     // Convert string to number for jumlah_anggota
     const dataToSubmit = {
       ...formData,
       jumlah_anggota: parseInt(formData.jumlah_anggota, 10) || 0
     };
     
     if (isEditing) {
       dispatch(updateKelompok({ id: id_kelompok, data: dataToSubmit }));
     } else {
       dispatch(createKelompok(dataToSubmit));
     }
   }
 };
 
 // Handle back button
 const handleBack = () => {
   navigation.goBack();
 };
 
 // Show loading indicator
 if ((isEditing && isLoading && !detail) || isLoadingLevels) {
   return <LoadingOverlay />;
 }
 
 return (
   <SafeAreaView style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
       <View style={styles.header}>
         <Text style={styles.headerTitle}>
           {isEditing ? 'Edit Kelompok' : 'Tambah Kelompok Baru'}
         </Text>
       </View>
       
       <View style={styles.formContainer}>
         <Input
           label="Nama Kelompok *"
           value={formData.nama_kelompok}
           onChangeText={(value) => handleInputChange('nama_kelompok', value)}
           placeholder="Masukkan nama kelompok"
           error={errors.nama_kelompok}
         />
         
         <DropdownSelect
           label="Level Anak Binaan *"
           value={formData.id_level_anak_binaan}
           options={levels.map(level => ({
             label: level.nama_level_binaan,
             value: level.id_level_anak_binaan
           }))}
           onValueChange={(value) => handleInputChange('id_level_anak_binaan', value)}
           placeholder="Pilih level anak binaan"
           error={errors.id_level_anak_binaan}
         />
         
         {isEditing && (
           <Input
             label="Jumlah Anggota"
             value={formData.jumlah_anggota}
             onChangeText={(value) => handleInputChange('jumlah_anggota', value)}
             placeholder="0"
             keyboardType="number-pad"
             editable={false}
           />
         )}
         
         {error && (
           <View style={styles.errorContainer}>
             <Text style={styles.errorText}>{error}</Text>
           </View>
         )}
       </View>
       
       <View style={styles.buttonContainer}>
         <Button
           title={isEditing ? "Simpan Perubahan" : "Buat Kelompok"}
           onPress={handleSubmit}
           isLoading={isLoading}
           style={styles.submitButton}
         />
         
         <Button
           title="Batal"
           onPress={handleBack}
           style={styles.cancelButton}
           textStyle={styles.cancelButtonText}
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
   padding: 16,
   paddingBottom: 40,
 },
 header: {
   marginBottom: 20,
   alignItems: 'center',
 },
 headerTitle: {
   fontSize: 22,
   fontWeight: 'bold',
   color: '#2E86DE',
 },
 formContainer: {
   backgroundColor: 'white',
   borderRadius: 10,
   padding: 16,
   marginBottom: 20,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 2,
 },
 errorContainer: {
   backgroundColor: '#fff8f8',
   borderRadius: 5,
   padding: 10,
   marginTop: 10,
   borderWidth: 1,
   borderColor: '#ffcdd2',
 },
 errorText: {
   color: '#e53935',
   fontSize: 14,
 },
 buttonContainer: {
   marginTop: 10,
 },
 submitButton: {
   marginBottom: 10,
 },
 cancelButton: {
   backgroundColor: '#fff',
   borderWidth: 1,
   borderColor: '#2E86DE',
 },
 cancelButtonText: {
   color: '#2E86DE',
 },
});

export default FormKelompokScreen;