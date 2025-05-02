import React, { useEffect, useState, useCallback } from 'react';
import { 
 View, 
 Text, 
 StyleSheet, 
 FlatList, 
 TouchableOpacity, 
 SafeAreaView,
 TextInput,
 Alert,
 RefreshControl
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
 fetchKelompok, 
 deleteKelompok, 
 resetKelompokError, 
 resetKelompokSuccess 
} from '../../redux/slices/kelompokSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const KelompokListScreen = ({ navigation }) => {
 const dispatch = useAppDispatch();
 const { 
   data, 
   isLoading, 
   pagination, 
   error, 
   deleteSuccess 
 } = useAppSelector((state) => state.kelompok);
 
 const [searchQuery, setSearchQuery] = useState('');
 const [refreshing, setRefreshing] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 
 useEffect(() => {
   loadData();
   
   return () => {
     dispatch(resetKelompokError());
     dispatch(resetKelompokSuccess());
   };
 }, []);
 
 useEffect(() => {
   if (deleteSuccess) {
     Alert.alert('Sukses', 'Kelompok berhasil dihapus');
     dispatch(resetKelompokSuccess());
   }
 }, [deleteSuccess]);
 
 const loadData = useCallback((page = 1) => {
   setCurrentPage(page);
   dispatch(fetchKelompok({ 
     page, 
     search: searchQuery.trim(),
   }));
 }, [dispatch, searchQuery]);
 
 const onRefresh = useCallback(() => {
   setRefreshing(true);
   loadData(1);
   setRefreshing(false);
 }, [loadData]);
 
 const handleSearch = () => {
   loadData(1);
 };
 
 const handleLoadMore = () => {
   if (!isLoading && pagination && currentPage < pagination.last_page) {
     loadData(currentPage + 1);
   }
 };
 
 const handleItemPress = (item) => {
   navigation.navigate('DetailKelompok', { idKelompok: item.id_kelompok });
 };
 
 const handleCreateKelompok = () => {
   navigation.navigate('FormKelompok', {});
 };
 
 const handleEditKelompok = (id_kelompok) => {
   navigation.navigate('FormKelompok', { id_kelompok });
 };
 
 const handleViewAnggota = (id_kelompok, kelompokName) => {
   navigation.navigate('AnakKelompok', { 
     id_kelompok, 
     kelompokName 
   });
 };
 
 const handleDeleteKelompok = (id_kelompok, kelompokName) => {
   Alert.alert(
     'Konfirmasi Hapus',
     `Apakah Anda yakin ingin menghapus kelompok "${kelompokName}"?`,
     [
       { text: 'Batal', style: 'cancel' },
       { 
         text: 'Hapus', 
         onPress: () => dispatch(deleteKelompok(id_kelompok)),
         style: 'destructive'
       }
     ]
   );
 };
 
 const handleBack = () => {
   navigation.goBack();
 };
 
 const renderItem = ({ item }) => (
   <TouchableOpacity 
     style={styles.card}
     onPress={() => handleItemPress(item)}
   >
     <View style={styles.cardHeader}>
       <Text style={styles.cardTitle}>{item.nama_kelompok}</Text>
       <View style={styles.levelBadge}>
         <Text style={styles.levelText}>
           {item.level_anak_binaan?.nama_level || 'Tidak ada level'}
         </Text>
       </View>
     </View>
     
     <View style={styles.cardContent}>
       <Text style={styles.shelterText}>
         Shelter: {item.shelter?.nama_shelter || '-'}
       </Text>
       <Text style={styles.memberText}>
         Anggota: {item.anak_count || 0} / {item.jumlah_anggota || 0}
       </Text>
     </View>
     
     <View style={styles.cardActions}>
       <TouchableOpacity
         style={styles.actionButton}
         onPress={() => handleViewAnggota(item.id_kelompok, item.nama_kelompok)}
       >
         <Text style={styles.actionButtonText}>Lihat Anggota</Text>
       </TouchableOpacity>
       
       <TouchableOpacity
         style={styles.actionButton}
         onPress={() => handleEditKelompok(item.id_kelompok)}
       >
         <Text style={styles.actionButtonText}>Edit</Text>
       </TouchableOpacity>
       
       <TouchableOpacity
         style={[styles.actionButton, styles.deleteButton]}
         onPress={() => handleDeleteKelompok(item.id_kelompok, item.nama_kelompok)}
       >
         <Text style={styles.deleteButtonText}>Hapus</Text>
       </TouchableOpacity>
     </View>
   </TouchableOpacity>
 );
 
 const renderFooter = () => {
   if (!isLoading) return null;
   return (
     <View style={styles.footerLoader}>
       <Text>Memuat data...</Text>
     </View>
   );
 };
 
 if (isLoading && data.length === 0) {
   return <LoadingOverlay />;
 }
 
 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.header}>
       <Text style={styles.headerTitle}>Daftar Kelompok</Text>
       <Text style={styles.headerSubtitle}>
         Total: {pagination?.total || 0} kelompok
       </Text>
     </View>
     
     <View style={styles.searchContainer}>
       <TextInput
         style={styles.searchInput}
         placeholder="Cari nama kelompok..."
         value={searchQuery}
         onChangeText={setSearchQuery}
         onSubmitEditing={handleSearch}
       />
       <Button 
         title="Cari" 
         onPress={handleSearch} 
         style={styles.searchButton}
       />
     </View>
     
     {error && (
       <View style={styles.errorContainer}>
         <Text style={styles.errorText}>{error}</Text>
       </View>
     )}
     
     <FlatList
       data={data}
       keyExtractor={(item) => item.id_kelompok?.toString()}
       renderItem={renderItem}
       contentContainerStyle={styles.listContainer}
       ListFooterComponent={renderFooter}
       onEndReached={handleLoadMore}
       onEndReachedThreshold={0.5}
       refreshControl={
         <RefreshControl
           refreshing={refreshing}
           onRefresh={onRefresh}
           colors={["#2E86DE"]}
         />
       }
       ListEmptyComponent={() => (
         <View style={styles.emptyContainer}>
           <Text style={styles.emptyText}>
             {searchQuery 
               ? 'Tidak ada kelompok yang sesuai dengan pencarian' 
               : 'Belum ada data kelompok'
             }
           </Text>
         </View>
       )}
     />
     
     <View style={styles.bottomButtonContainer}>
       <Button
         title="Kembali"
         onPress={handleBack}
         style={styles.backButton}
       />
       <Button
         title="Tambah Kelompok"
         onPress={handleCreateKelompok}
         style={styles.addButton}
       />
     </View>
     
     <TouchableOpacity 
       style={styles.floatingButton}
       onPress={handleCreateKelompok}
     >
       <Text style={styles.floatingButtonText}>+</Text>
     </TouchableOpacity>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
 },
 header: {
   padding: 20,
   backgroundColor: '#2E86DE',
 },
 headerTitle: {
   fontSize: 22,
   fontWeight: 'bold',
   color: 'white',
 },
 headerSubtitle: {
   fontSize: 16,
   color: 'white',
   marginTop: 5,
 },
 searchContainer: {
   flexDirection: 'row',
   padding: 15,
   backgroundColor: 'white',
   borderBottomWidth: 1,
   borderBottomColor: '#ddd',
 },
 searchInput: {
   flex: 1,
   height: 40,
   borderWidth: 1,
   borderColor: '#ddd',
   borderRadius: 8,
   paddingHorizontal: 10,
   marginRight: 10,
   backgroundColor: '#f9f9f9',
 },
 searchButton: {
   height: 40,
   paddingHorizontal: 15,
 },
 listContainer: {
   paddingHorizontal: 15,
   paddingTop: 10,
   paddingBottom: 100,
 },
 card: {
   backgroundColor: 'white',
   borderRadius: 10,
   marginBottom: 15,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
   overflow: 'hidden',
 },
 cardHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: 15,
   borderBottomWidth: 1,
   borderBottomColor: '#f0f0f0',
 },
 cardTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   color: '#333',
   flex: 1,
 },
 levelBadge: {
   paddingHorizontal: 10,
   paddingVertical: 3,
   borderRadius: 15,
   backgroundColor: '#e6f7ff',
 },
 levelText: {
   fontSize: 12,
   color: '#0080ff',
   fontWeight: '500',
 },
 cardContent: {
   padding: 15,
 },
 shelterText: {
   fontSize: 14,
   color: '#666',
   marginBottom: 5,
 },
 memberText: {
   fontSize: 14,
   color: '#666',
   fontWeight: '500',
 },
 cardActions: {
   flexDirection: 'row',
   borderTopWidth: 1,
   borderTopColor: '#f0f0f0',
 },
 actionButton: {
   flex: 1,
   paddingVertical: 12,
   alignItems: 'center',
   justifyContent: 'center',
 },
 actionButtonText: {
   fontWeight: '600',
   color: '#2E86DE',
 },
 deleteButton: {
   backgroundColor: '#fff5f5',
 },
 deleteButtonText: {
   color: '#ff3b30',
   fontWeight: '600',
 },
 errorContainer: {
   padding: 15,
   backgroundColor: '#fff8f8',
   margin: 15,
   borderRadius: 8,
   borderWidth: 1,
   borderColor: '#ffcdd2',
 },
 errorText: {
   color: '#e53935',
   fontSize: 14,
 },
 emptyContainer: {
   padding: 30,
   alignItems: 'center',
 },
 emptyText: {
   fontSize: 16,
   color: '#666',
   textAlign: 'center',
 },
 footerLoader: {
   padding: 10,
   alignItems: 'center',
 },
 bottomButtonContainer: {
   position: 'absolute',
   bottom: 0,
   left: 0,
   right: 0,
   flexDirection: 'row',
   padding: 15,
   backgroundColor: 'white',
   borderTopWidth: 1,
   borderTopColor: '#ddd',
 },
 backButton: {
   flex: 1,
   marginRight: 10,
   backgroundColor: '#666',
 },
 addButton: {
   flex: 2,
 },
 floatingButton: {
   position: 'absolute',
   right: 20,
   bottom: 90,
   width: 56,
   height: 56,
   borderRadius: 28,
   backgroundColor: '#2E86DE',
   alignItems: 'center',
   justifyContent: 'center',
   elevation: 5,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.3,
   shadowRadius: 3,
 },
 floatingButtonText: {
   fontSize: 24,
   color: 'white',
   fontWeight: 'bold',
 },
});

export default KelompokListScreen;