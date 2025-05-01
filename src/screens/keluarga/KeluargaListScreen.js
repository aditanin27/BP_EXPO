import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchKeluarga, deleteKeluarga, resetKeluargaState } from '../../redux/slices/keluargaSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const KeluargaListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    list, 
    isLoading, 
    error, 
    pagination, 
    deleteSuccess 
  } = useAppSelector((state) => state.keluarga);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initial data fetch
  useEffect(() => {
    loadData();
  }, [dispatch]);
  
  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data keluarga berhasil dihapus');
      dispatch(resetKeluargaState());
    }
  }, [deleteSuccess, dispatch]);
  
  // Function to load data with current filters
  const loadData = useCallback((page = 1) => {
    setCurrentPage(page);
    dispatch(fetchKeluarga({ 
      page, 
      search: searchQuery.trim(),
    }));
  }, [dispatch, searchQuery]);
  
  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(1).then(() => setRefreshing(false));
  }, [loadData]);
  
  // Search handler
  const handleSearch = () => {
    loadData(1);
  };
  
  // Load more data when reaching end of list
  const handleLoadMore = () => {
    if (!isLoading && currentPage < pagination.last_page) {
      loadData(currentPage + 1);
    }
  };
  
  // Navigate to add new family screen
  const handleTambahKeluarga = () => {
    navigation.navigate('TambahKeluarga');
  };
  
  // Navigate to family detail screen
  const handleViewKeluarga = (idKeluarga) => {
    navigation.navigate('KeluargaDetail', { idKeluarga });
  };
  
  // Delete family confirmation
  const handleDeleteKeluarga = (idKeluarga, nama) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data keluarga ${nama}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => dispatch(deleteKeluarga(idKeluarga)),
          style: 'destructive',
        },
      ]
    );
  };
  
  // Navigate back to Home screen
  // const handleBack = () => {
  //   navigation.navigate('Home');
  // };
  
  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };
  
  
  // Render each family card
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleViewKeluarga(item.id_keluarga)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.kepala_keluarga}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status_ortu}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <InfoRow label="No KK" value={item.no_kk} />
        <InfoRow 
          label="Shelter" 
          value={item.shelter?.nama_shelter || '-'} 
        />
        {item.no_tlp && (
          <InfoRow label="No. Telp" value={item.no_tlp} />
        )}
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditKeluarga', { idKeluarga: item.id_keluarga })}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteKeluarga(item.id_keluarga, item.kepala_keluarga)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  // Show simple info row
  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
  
  // Loading indicator for pagination
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2E86DE" />
        <Text style={styles.footerText}>Memuat data...</Text>
      </View>
    );
  };
  
  // Empty list display
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'Tidak ada keluarga yang sesuai dengan pencarian' 
          : 'Belum ada data keluarga'}
      </Text>
    </View>
  );
  
  if (isLoading && list.length === 0) {
    return <LoadingOverlay />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Keluarga</Text>
        <Text style={styles.headerSubtitle}>
          Total: {pagination.total || 0} keluarga
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama kepala keluarga atau no KK"
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
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Coba Lagi" 
            onPress={() => loadData(1)} 
            style={styles.retryButton}
          />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id_keluarga?.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2E86DE"]}
            />
          }
        />
      )}
      
      <View style={styles.bottomButtonContainer}>
        <Button
          title="Kembali"
          onPress={handleBack}
          style={styles.backButton}
        />
        <Button
          title="Tambah Keluarga"
          onPress={handleTambahKeluarga}
          style={styles.addButton}
        />
      </View>
      
      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleTambahKeluarga}
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
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
    backgroundColor: '#e6f7ff',
  },
  statusText: {
    fontSize: 12,
    color: '#0080ff',
    fontWeight: '500',
  },
  cardBody: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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
  editButton: {
    backgroundColor: '#f0f8ff',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontWeight: '600',
    color: '#2E86DE',
  },
  deleteButtonText: {
    color: '#ff3b30',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    minWidth: 120,
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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
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

export default KeluargaListScreen;