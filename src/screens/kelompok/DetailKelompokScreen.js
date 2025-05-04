import React, { useEffect } from 'react';
import { 
 View, 
 Text, 
 StyleSheet, 
 ScrollView, 
 SafeAreaView, 
 FlatList,
 Image,
 TouchableOpacity,
 Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
 fetchKelompokDetail, 
 resetKelompokError, 
 resetKelompokSuccess,
 deleteKelompok
} from '../../redux/slices/kelompokSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const AnakItem = ({ anak, onPress }) => (
 <TouchableOpacity style={styles.anakItem} onPress={onPress}>
   <Image
     source={{ 
       uri: anak.foto_url || 'https://berbagipendidikan.org/images/default.png'
     }}
     style={styles.anakPhoto}
   />
   <View style={styles.anakInfo}>
     <Text style={styles.anakName} numberOfLines={2}>
       {anak.full_name}
     </Text>
     <Text style={styles.anakDetail}>
       {anak.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {anak.agama}
     </Text>
   </View>
 </TouchableOpacity>
);

const DetailKelompokScreen = ({ route, navigation }) => {
 const { idKelompok } = route.params;
 const dispatch = useAppDispatch();
 const { 
   detail: kelompok, 
   isLoadingDetail, 
   error, 
   deleteSuccess 
 } = useAppSelector((state) => state.kelompok);

 useEffect(() => {
   dispatch(fetchKelompokDetail(idKelompok));
   
   return () => {
     dispatch(resetKelompokError());
     dispatch(resetKelompokSuccess());
   };
 }, [dispatch, idKelompok]);
 
 // Handle delete success
 useEffect(() => {
   if (deleteSuccess) {
     Alert.alert('Sukses', 'Kelompok berhasil dihapus');
     navigation.goBack();
   }
 }, [deleteSuccess, navigation]);

 const handleBack = () => {
   navigation.goBack();
 };

 const handleEditKelompok = () => {
   navigation.navigate('FormKelompok', { id_kelompok: idKelompok });
 };
 
 const handleManageMembers = () => {
   if (kelompok) {
     navigation.navigate('AnakKelompok', { 
       id_kelompok: idKelompok, 
       kelompokName: kelompok.nama_kelompok 
     });
   }
 };
 
 const handleDeleteKelompok = () => {
   if (!kelompok) return;
   
   Alert.alert(
     'Konfirmasi Hapus',
     `Apakah Anda yakin ingin menghapus kelompok "${kelompok.nama_kelompok}"?`,
     [
       { text: 'Batal', style: 'cancel' },
       { 
         text: 'Hapus', 
         onPress: () => dispatch(deleteKelompok(idKelompok)),
         style: 'destructive'
       }
     ]
   );
 };

 const handleAnakPress = (anak) => {
   navigation.navigate('DetailAnak', { idAnak: anak.id_anak });
 };

 if (isLoadingDetail) {
   return <LoadingOverlay />;
 }

 if (error) {
   return (
     <SafeAreaView style={styles.errorContainer}>
       <Text style={styles.errorText}>{error}</Text>
       <Button 
         title="Kembali" 
         onPress={handleBack} 
         style={styles.backButton} 
       />
     </SafeAreaView>
   );
 }

 if (!kelompok) {
   return (
     <SafeAreaView style={styles.errorContainer}>
       <Text style={styles.errorText}>Data kelompok tidak ditemukan</Text>
       <Button 
         title="Kembali" 
         onPress={handleBack} 
         style={styles.backButton} 
       />
     </SafeAreaView>
   );
 }

 return (
   <SafeAreaView style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
       <View style={styles.header}>
         <Text style={styles.headerTitle}>Detail Kelompok</Text>
       </View>

       <View style={styles.infoCard}>
         <Text style={styles.cardTitle}>{kelompok.nama_kelompok}</Text>
         
         <View style={styles.infoRow}>
           <Text style={styles.infoLabel}>Shelter:</Text>
           <Text style={styles.infoValue}>
             {kelompok.shelter?.nama_shelter || '-'}
           </Text>
         </View>
         
         <View style={styles.infoRow}>
           <Text style={styles.infoLabel}>Level Anak Binaan:</Text>
           <Text style={styles.infoValue}>
             {kelompok.level_anak_binaan?.nama_level_binaan || '-'}
           </Text>
         </View>
         
         <View style={styles.infoRow}>
           <Text style={styles.infoLabel}>Jumlah Anggota:</Text>
           <Text style={styles.infoValue}>
             {kelompok.anak?.length || 0} / {kelompok.jumlah_anggota || 0}
           </Text>
         </View>
       </View>

       {kelompok.anak && kelompok.anak.length > 0 && (
         <View style={styles.anakSection}>
           <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Anggota Kelompok</Text>
             <TouchableOpacity
               style={styles.viewAllButton}
               onPress={handleManageMembers}
             >
               <Text style={styles.viewAllText}>Kelola Anggota</Text>
             </TouchableOpacity>
           </View>
           
           <FlatList
             data={kelompok.anak.slice(0, 10)} // Show max 10 members in preview
             keyExtractor={(item) => item.id_anak.toString()}
             renderItem={({ item }) => (
               <AnakItem 
                 anak={item} 
                 onPress={() => handleAnakPress(item)} 
               />
             )}
             horizontal
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={styles.anakList}
             ListFooterComponent={() => 
               kelompok.anak.length > 10 ? (
                 <TouchableOpacity 
                   style={styles.moreItem}
                   onPress={handleManageMembers}
                 >
                   <Text style={styles.moreText}>
                     +{kelompok.anak.length - 10} Lainnya
                   </Text>
                 </TouchableOpacity>
               ) : null
             }
           />
         </View>
       )}

       <View style={styles.actionContainer}>
         <Button
           title="Kelola Anggota"
           onPress={handleManageMembers}
           style={styles.manageButton}
         />
         
         <Button
           title="Edit Kelompok"
           onPress={handleEditKelompok}
           style={styles.editButton}
         />
         
         <Button
           title="Hapus Kelompok"
           onPress={handleDeleteKelompok}
           style={styles.deleteButton}
           textStyle={styles.deleteButtonText}
         />
       </View>

       <Button
         title="Kembali"
         onPress={handleBack}
         style={styles.backButton}
       />
     </ScrollView>
   </SafeAreaView>
 );
};

export default DetailKelompokScreen;
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
 },
 scrollViewContent: {
   padding: 15,
   paddingBottom: 40,
 },
 header: {
   marginBottom: 15,
   alignItems: 'center',
 },
 headerTitle: {
   fontSize: 22,
   fontWeight: 'bold',
   color: '#2E86DE',
 },
 infoCard: {
   backgroundColor: 'white',
   borderRadius: 10,
   padding: 20,
   marginBottom: 20,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 10,
   elevation: 3,
 },
 cardTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   marginBottom: 15,
   color: '#2E86DE',
   textAlign: 'center',
 },
 infoRow: {
   flexDirection: 'row',
   marginBottom: 10,
   borderBottomWidth: 1,
   borderBottomColor: '#f0f0f0',
   paddingBottom: 8,
 },
 infoLabel: {
   width: '40%',
   fontSize: 16,
   color: '#555',
   fontWeight: '500',
 },
 infoValue: {
   flex: 1,
   fontSize: 16,
   color: '#333',
 },
 anakSection: {
   marginBottom: 20,
 },
 sectionHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 10,
   paddingHorizontal: 5,
 },
 sectionTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   color: '#333',
 },
 viewAllButton: {
   padding: 5,
 },
 viewAllText: {
   color: '#2E86DE',
   fontWeight: '600',
   fontSize: 14,
 },
 anakList: {
   paddingHorizontal: 5,
   paddingVertical: 10,
 },
 anakItem: {
   marginRight: 15,
   alignItems: 'center',
   width: 100,
 },
 anakPhoto: {
   width: 80,
   height: 80,
   borderRadius: 40,
   marginBottom: 10,
   borderWidth: 2,
   borderColor: '#2E86DE',
 },
 anakInfo: {
   alignItems: 'center',
 },
 anakName: {
   fontSize: 14,
   textAlign: 'center',
   color: '#333',
   fontWeight: '500',
   marginBottom: 4,
 },
 anakDetail: {
   fontSize: 12,
   color: '#666',
   textAlign: 'center',
 },
 moreItem: {
   width: 80,
   height: 80,
   borderRadius: 40,
   backgroundColor: '#f0f0f0',
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: 15,
 },
 moreText: {
   fontSize: 12,
   color: '#666',
   textAlign: 'center',
 },
 actionContainer: {
   marginBottom: 20,
 },
 manageButton: {
   marginBottom: 10,
   backgroundColor: '#2E86DE',
 },
 editButton: {
   marginBottom: 10,
   backgroundColor: '#4CAF50',
 },
 deleteButton: {
   backgroundColor: '#fff',
   borderWidth: 1,
   borderColor: '#ff3b30',
 },
 deleteButtonText: {
   color: '#ff3b30',
 },
 backButton: {
   backgroundColor: '#555',
 },
 errorContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 errorText: {
   color: '#e74c3c',
   fontSize: 16,
   textAlign: 'center',
   marginBottom: 20,
 },
});

