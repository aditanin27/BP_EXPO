import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchTutors, 
  deleteTutor, 
  resetTutorState 
} from '../../redux/slices/tutorSlice';
import TutorCard from '../../components/TutorCard';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const TutorListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    list, 
    isLoading, 
    pagination, 
    error, 
    deleteSuccess 
  } = useAppSelector((state) => state.tutor);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    loadData();
    
    return () => {
      dispatch(resetTutorState());
    };
  }, []);
  
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Tutor berhasil dihapus');
      dispatch(resetTutorState());
    }
  }, [deleteSuccess]);
  
  const loadData = useCallback((page = 1) => {
    setCurrentPage(page);
    dispatch(fetchTutors({ 
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
  
  const handleItemPress = (id) => {
    navigation.navigate('TutorDetail', { idTutor: id });
  };
  
  const handleCreateTutor = () => {
    navigation.navigate('FormTutor', {});
  };
  
  const handleEditTutor = (id) => {
    navigation.navigate('FormTutor', { id_tutor: id });
  };
  
  const handleDeleteTutor = (id, tutorName) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus tutor "${tutorName}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          onPress: () => dispatch(deleteTutor(id)),
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const renderItem = ({ item }) => (
    <TutorCard 
      tutor={item}
      onPress={() => handleItemPress(item.id_tutor)}
      onEdit={() => handleEditTutor(item.id_tutor)}
      onDelete={() => handleDeleteTutor(item.id_tutor, item.nama)}
    />
  );
  
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <Text>Memuat data...</Text>
      </View>
    );
  };
  
  if (isLoading && list.length === 0) {
    return <LoadingOverlay />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Tutor</Text>
        <Text style={styles.headerSubtitle}>
          Total: {pagination?.total || 0} tutor
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama tutor..."
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
        data={list}
        keyExtractor={(item) => item.id_tutor?.toString()}
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
                ? 'Tidak ada tutor yang sesuai dengan pencarian' 
                : 'Belum ada data tutor'
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
          title="Tambah Tutor"
          onPress={handleCreateTutor}
          style={styles.addButton}
        />
      </View>
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
});

export default TutorListScreen;