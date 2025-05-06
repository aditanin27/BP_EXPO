// src/screens/aktivitas/AktivitasListScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAktivitas, 
  deleteAktivitas, 
  resetAktivitasState 
} from '../../redux/slices/aktivitasSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import AktivitasCard from '../../components/AktivitasCard';

const { width } = Dimensions.get('window');

const AktivitasListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    list = [], 
    isLoading = false, 
    isLoadingMore = false, 
    error = null, 
    deleteSuccess = false, 
    pagination = {} 
  } = useAppSelector((state) => state.aktivitas || {});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  
  useEffect(() => {
    dispatch(fetchAktivitas({ 
      page: 1, 
      search: searchQuery,
      jenis_kegiatan: filterType 
    }));
  }, [dispatch, searchQuery, filterType]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Aktivitas berhasil dihapus');
      dispatch(resetAktivitasState());
    }
  }, [deleteSuccess, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading && 
      !isLoadingMore && 
      currentPage < pagination?.last_page
    ) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(fetchAktivitas({ 
        page: nextPage, 
        search: searchQuery, 
        jenis_kegiatan: filterType,
        loadMore: true 
      }));
    }
  }, [
    dispatch, 
    currentPage, 
    pagination?.last_page, 
    isLoading, 
    isLoadingMore, 
    searchQuery,
    filterType
  ]);

  const handleViewAktivitas = (id) => {
    navigation.navigate('AktivitasDetail', { id });
  };

  const handleEditAktivitas = (id) => {
    navigation.navigate('AktivitasForm', { id });
  };

  const handleDeleteAktivitas = (id, name) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus aktivitas "${name}"?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => dispatch(deleteAktivitas(id)),
          style: 'destructive',
        },
      ]
    );
  };

  const handleAddAktivitas = () => {
    navigation.navigate('AktivitasForm');
  };

  const handleFilterChange = (type) => {
    setFilterType(type === filterType ? '' : type);
    setCurrentPage(1);
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterType === '' && styles.filterButtonActive
        ]}
        onPress={() => handleFilterChange('')}
      >
        <Text style={[
          styles.filterButtonText,
          filterType === '' && styles.filterButtonTextActive
        ]}>
          Semua
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterType === 'Bimbel' && styles.filterButtonActive
        ]}
        onPress={() => handleFilterChange('Bimbel')}
      >
        <Text style={[
          styles.filterButtonText,
          filterType === 'Bimbel' && styles.filterButtonTextActive
        ]}>
          Bimbel
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterType === 'Kegiatan' && styles.filterButtonActive
        ]}
        onPress={() => handleFilterChange('Kegiatan')}
      >
        <Text style={[
          styles.filterButtonText,
          filterType === 'Kegiatan' && styles.filterButtonTextActive
        ]}>
          Kegiatan
        </Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.headerTitle}>Aktivitas Shelter</Text>
        <Text style={styles.headerSubtitle}>
          {`Total: ${pagination?.total || 0} aktivitas`}
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari aktivitas..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(1);
          }}
        />
      </View>
      
      {renderFilterButtons()}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Coba Lagi" 
            onPress={() => dispatch(fetchAktivitas({ 
              page: 1, 
              search: searchQuery,
              jenis_kegiatan: filterType
            }))} 
          />
        </View>
      ) : (
        <>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id_aktivitas.toString()}
            renderItem={({ item }) => (
              <AktivitasCard 
                aktivitas={item}
                onPress={() => handleViewAktivitas(item.id_aktivitas)}
                onEdit={() => handleEditAktivitas(item.id_aktivitas)}
                onDelete={() => handleDeleteAktivitas(
                  item.id_aktivitas, 
                  item.jenis_kegiatan === 'Bimbel' 
                    ? `Bimbel ${item.nama_kelompok || ''}`
                    : item.materi
                )}
              />
            )}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery || filterType
                    ? 'Tidak ada aktivitas yang sesuai dengan pencarian' 
                    : 'Belum ada data aktivitas'
                  }
                </Text>
              </View>
            }
          />
          
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={handleAddAktivitas}
          >
            <Text style={styles.floatingButtonText}>+</Text>
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
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#2E86DE',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80, // Extra space for floating button
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
  floatingButton: {
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 56,
    textAlign: 'center',
  },
});

export default AktivitasListScreen;