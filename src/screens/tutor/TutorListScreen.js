import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTutors } from '../../redux/slices/tutorSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const TutorCard = ({ tutor, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: tutor.foto_url }} 
        style={styles.cardImage} 
        
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {tutor.nama}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardSubtitle}>
            {tutor.maple} | {tutor.pendidikan}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {tutor.shelter?.nama_shelter || 'No Shelter'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TutorListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const { 
    data: tutors, 
    isLoading, 
    error, 
    pagination 
  } = useAppSelector((state) => state.tutor);

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const loadTutors = useCallback((page = 1, search = '') => {
    dispatch(fetchTutors({ 
      page, 
      search: search.trim() 
    }));
  }, [dispatch]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTutors(1, searchQuery);
    setRefreshing(false);
  }, [loadTutors, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadTutors(1, searchQuery);
  };

  const loadMoreTutors = () => {
    if (!isLoading && currentPage < pagination.last_page) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadTutors(nextPage, searchQuery);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading && tutors.length === 0) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Tutor</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama, maple, atau email"
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
        data={tutors}
        keyExtractor={(item) => item.id_tutor.toString()}
        renderItem={({ item }) => (
          <TutorCard 
            tutor={item} 
            onPress={() => {
              // TODO: Navigate to tutor detail when implemented
              // navigation.navigate('TutorDetail', { tutorId: item.id_tutor })
              console.log('Tutor Detail Navigation Placeholder');
            }} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E86DE']}
          />
        }
        onEndReached={loadMoreTutors}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          isLoading ? <LoadingOverlay /> : null
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error ? 'Gagal memuat data' : 'Tidak ada data tutor'}
            </Text>
          </View>
        )}
      />

      <Button
        title="Kembali"
        onPress={handleBack}
        style={styles.backButton}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchButton: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDetails: {
    marginTop: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    margin: 20,
    backgroundColor: '#555',
  },
});

export default TutorListScreen;