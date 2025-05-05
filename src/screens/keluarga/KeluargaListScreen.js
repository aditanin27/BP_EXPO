import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchKeluarga, 
  deleteKeluarga, 
  resetKeluargaState 
} from '../../redux/slices/keluargaSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const KeluargaListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    list, 
    pagination, 
    isLoading, 
    isLoadingMore, 
    error, 
    deleteSuccess 
  } = useAppSelector((state) => state.keluarga);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Load data when component mounts or search changes
  useEffect(() => {
    dispatch(fetchKeluarga({ page: 1, search: searchQuery }));
  }, [dispatch, searchQuery]);

  // Handle successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data keluarga berhasil dihapus');
      dispatch(resetKeluargaState());
      dispatch(fetchKeluarga({ page: 1, search: searchQuery }));
    }
  }, [deleteSuccess, dispatch, searchQuery]);

  // Load more data when scrolling
  const handleLoadMore = useCallback(() => {
    if (
      !isLoading && 
      !isLoadingMore && 
      currentPage < pagination.last_page
    ) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(fetchKeluarga({ 
        page: nextPage, 
        search: searchQuery, 
        loadMore: true 
      }));
    }
  }, [
    dispatch, 
    currentPage, 
    pagination.last_page, 
    isLoading, 
    isLoadingMore, 
    searchQuery
  ]);

  // View keluarga details
  const handleViewKeluarga = (idKeluarga) => {
    navigation.navigate('KeluargaDetail', { idKeluarga });
  };

  // Edit keluarga
  const handleEditKeluarga = (idKeluarga) => {
    navigation.navigate('EditKeluarga', { idKeluarga });
  };

  // Delete keluarga
  const handleDeleteKeluarga = (idKeluarga, keluargaName) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data keluarga ${keluargaName}?`,
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

  // Add new keluarga
  const handleAddKeluarga = () => {
    navigation.navigate('KeluargaFormSelection');
  };

  // Render each keluarga item
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.keluargaCard}
        onPress={() => handleViewKeluarga(item.id_keluarga)}
      >
        <View style={styles.cardContent}>
          <View style={styles.keluargaInfo}>
            <Text style={styles.keluargaName} numberOfLines={1}>
              {item.kepala_keluarga}
            </Text>
            <Text style={styles.kkNumber}>
              No. KK: {item.no_kk}
            </Text>
            <Text style={styles.keluargaDetail}>
              {item.shelter?.nama_shelter || 'Shelter tidak tersedia'}
            </Text>
            <Text style={styles.keluargaStatus}>
              Status: {item.status_ortu}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditKeluarga(item.id_keluarga)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteKeluarga(item.id_keluarga, item.kepala_keluarga)}
          >
            <Text style={[styles.buttonText, styles.deleteText]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <Text>Memuat lebih banyak...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Keluarga</Text>
        <Text style={styles.headerSubtitle}>
          Total: {pagination.total || 0} keluarga
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama kepala keluarga atau no. KK..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(1);
          }}
        />
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Coba Lagi" 
            onPress={() => dispatch(fetchKeluarga({ page: 1, search: searchQuery }))} 
          />
        </View>
      ) : (
        <>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id_keluarga.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery 
                    ? 'Tidak ada keluarga yang sesuai dengan pencarian' 
                    : 'Belum ada data keluarga'
                  }
                </Text>
              </View>
            }
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddKeluarga}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </>
      )}
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
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80, // Extra space for FAB
  },
  keluargaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
  },
  keluargaInfo: {
    flex: 1,
  },
  keluargaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  kkNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  keluargaDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  keluargaStatus: {
    fontSize: 14,
    color: '#2E86DE',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteText: {
    color: '#e74c3c',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footerLoading: {
    padding: 10,
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default KeluargaListScreen;