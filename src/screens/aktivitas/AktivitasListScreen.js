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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAktivitas, deleteAktivitas, resetAktivitasState } from '../../redux/slices/aktivitasSlice';
import AktivitasCard from '../../components/AktivitasCard';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Handle successful delete
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Berhasil', 'Aktivitas berhasil dihapus');
      dispatch(resetAktivitasState());
    }
  }, [deleteSuccess]);
  
  const loadData = (page = 1) => {
    setCurrentPage(page);
    dispatch(fetchAktivitas({ page, search: searchQuery }));
  };
  
  const handleSearch = () => {
    loadData(1);
  };
  
  const handleLoadMore = () => {
    if (isLoadingMore || currentPage >= pagination.last_page) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(fetchAktivitas({ 
      page: nextPage, 
      search: searchQuery, 
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
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus aktivitas "${name || 'ini'}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => dispatch(deleteAktivitas(id))
        }
      ]
    );
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
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'Tidak ada hasil yang cocok dengan pencarian Anda' 
          : 'Belum ada data aktivitas'
        }
      </Text>
      <Button title="Tambah Aktivitas" onPress={handleAddPress} />
    </View>
  );
  
  if (isLoading && currentPage === 1) {
    return <LoadingOverlay />;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Aktivitas</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari aktivitas..."
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    width: 70,
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
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AktivitasListScreen;