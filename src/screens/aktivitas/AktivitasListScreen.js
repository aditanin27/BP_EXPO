// src/screens/aktivitas/AktivitasListScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAktivitas, 
  deleteAktivitas, 
  resetAktivitasState 
} from '../../redux/slices/aktivitasSlice';
import AktivitasCard from '../../components/AktivitasCard';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import DropdownSelect from '../../components/DropdownSelect';

const AktivitasListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    list, 
    pagination, 
    isLoading, 
    isLoadingMore, 
    deleteSuccess, 
    error 
  } = useAppSelector(state => state.aktivitas);
  
  const { adminShelter } = useAppSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [jenisKegiatan, setJenisKegiatan] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const jenisKegiatanOptions = [
    { label: 'Semua Jenis', value: '' },
    { label: 'Bimbel', value: 'Bimbel' },
    { label: 'Keterampilan', value: 'Keterampilan' },
    { label: 'Keagamaan', value: 'Keagamaan' },
    { label: 'Olahraga', value: 'Olahraga' },
    { label: 'Lainnya', value: 'Lainnya' }
  ];
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Handle successful delete
  useEffect(() => {
    if (deleteSuccess) {
      setIsDeleting(false);
      setConfirmDeleteId(null);
      setConfirmDeleteName('');
      Alert.alert('Berhasil', 'Aktivitas berhasil dihapus');
      dispatch(resetAktivitasState());
    }
  }, [deleteSuccess]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      setIsDeleting(false);
      Alert.alert('Error', error);
      dispatch(resetAktivitasState());
    }
  }, [error]);
  
  const loadData = (page = 1) => {
    setCurrentPage(page);
    dispatch(fetchAktivitas({ 
      page, 
      search: searchQuery,
      jenis_kegiatan: jenisKegiatan,
      // Pass shelter ID if we have it from admin
      id_shelter: adminShelter?.id_shelter || ''
    }));
  };
  
  const handleSearch = () => {
    loadData(1);
  };
  
  const handleFilterApply = () => {
    setFilterModalVisible(false);
    loadData(1);
  };
  
  const handleFilterReset = () => {
    setJenisKegiatan('');
    setFilterModalVisible(false);
    loadData(1);
  };
  
  const handleLoadMore = () => {
    if (isLoadingMore || currentPage >= pagination.last_page) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(fetchAktivitas({ 
      page: nextPage, 
      search: searchQuery,
      jenis_kegiatan: jenisKegiatan,
      id_shelter: adminShelter?.id_shelter || '',
      loadMore: true 
    }));
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadData(1);
    setRefreshing(false);
  };
  
  const handleAddPress = () => {
    navigation.navigate('AktivitasForm');
  };
  
  const handleItemPress = (id) => {
    navigation.navigate('AktivitasDetail', { id });
  };
  
  const handleEditPress = (id) => {
    navigation.navigate('AktivitasForm', { id });
  };
  
  const handleDeletePress = (id, name) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(name || 'ini');
  };
  
  const confirmDelete = () => {
    if (confirmDeleteId) {
      setIsDeleting(true);
      dispatch(deleteAktivitas(confirmDeleteId));
    }
  };
  
  const cancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteName('');
  };
  
  const handleAbsenPress = (id) => {
    navigation.navigate('Absen', { id });
  };
  
  const renderItem = ({ item }) => (
    <AktivitasCard
      aktivitas={item}
      onPress={() => handleItemPress(item.id_aktivitas)}
      onEdit={() => handleEditPress(item.id_aktivitas)}
      onDelete={() => handleDeletePress(item.id_aktivitas, item.materi)}
      onAbsen={() => handleAbsenPress(item.id_aktivitas)}
    />
  );
  
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#2E86DE" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  };
  
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={require('../../../assets/icon.png')} 
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>
        {searchQuery || jenisKegiatan
          ? 'Tidak ada hasil yang cocok dengan filter Anda' 
          : 'Belum ada data aktivitas'
        }
      </Text>
      <Button title="Tambah Aktivitas" onPress={handleAddPress} />
    </View>
  );
  
  if (isLoading && currentPage === 1 && !refreshing) {
    return <LoadingOverlay />;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Aktivitas</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari aktivitas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Button 
          title="Cari" 
          onPress={handleSearch} 
          style={styles.searchButton}
        />
      </View>
      
      {/* Applied filters */}
      {jenisKegiatan && (
        <View style={styles.appliedFiltersContainer}>
          <Text style={styles.appliedFiltersLabel}>Filter aktif:</Text>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{jenisKegiatan}</Text>
            <TouchableOpacity 
              onPress={() => {
                setJenisKegiatan('');
                loadData(1);
              }}
            >
              <Text style={styles.filterChipClose}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id_aktivitas.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddPress}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Aktivitas</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <DropdownSelect
                label="Jenis Kegiatan"
                value={jenisKegiatan}
                options={jenisKegiatanOptions}
                onValueChange={setJenisKegiatan}
                placeholder="Pilih jenis kegiatan"
              />
              
              <View style={styles.modalActions}>
                <Button 
                  title="Reset" 
                  onPress={handleFilterReset}
                  style={styles.resetButton}
                  textStyle={styles.resetButtonText}
                />
                <Button 
                  title="Terapkan" 
                  onPress={handleFilterApply}
                  style={styles.applyButton}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={confirmDeleteId !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmTitle}>Konfirmasi Hapus</Text>
            <Text style={styles.confirmText}>
              Apakah Anda yakin ingin menghapus aktivitas "{confirmDeleteName}"?
            </Text>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={cancelDelete}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, isDeleting && styles.disabledButton]}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>Hapus</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2E86DE',
  },
  filterButtonText: {
    color: '#2E86DE',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  searchButton: {
    width: 70,
    paddingVertical: 8,
  },
  appliedFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appliedFiltersLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  filterChipText: {
    fontSize: 12,
    color: '#2E86DE',
    marginRight: 5,
  },
  filterChipClose: {
    fontSize: 16,
    color: '#2E86DE',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: 300,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
    flex: 1,
    marginRight: 8,
  },
  resetButtonText: {
    color: '#2E86DE',
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
  },
  confirmModalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  confirmText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#f1a9a0',
  },
});

export default AktivitasListScreen;