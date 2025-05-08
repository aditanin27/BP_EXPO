import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchSurveysForValidation, 
  fetchValidationSummary,
  resetSurveyValidasiState
} from '../../redux/slices/surveyValidasiSlice';

import SurveyValidasiItem from '../../components/SurveyValidasiItem';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const SurveyValidasiListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    list, 
    pagination, 
    summary,
    isLoading, 
    isLoadingMore, 
    isLoadingSummary,
    error 
  } = useAppSelector((state) => state.surveyValidasi);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Load data when component mounts
  useEffect(() => {
    loadData();
    dispatch(fetchValidationSummary());
  }, []);
  
  // Handle error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetSurveyValidasiState());
    }
  }, [error]);
  
  // Load data function
  const loadData = (page = 1) => {
    setCurrentPage(page);
    dispatch(fetchSurveysForValidation({
      page,
      search: searchQuery,
      status: currentStatus
    }));
  };
  
  // Handle search
  const handleSearch = () => {
    loadData(1);
  };
  
  // Handle filter
  const applyFilter = (status) => {
    setCurrentStatus(status);
    setFilterModalVisible(false);
    loadData(1);
  };
  
  // Clear filters
  const clearFilters = () => {
    setCurrentStatus('');
    setFilterModalVisible(false);
    loadData(1);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    if (isLoadingMore || currentPage >= pagination.last_page) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(fetchSurveysForValidation({
      page: nextPage,
      search: searchQuery,
      status: currentStatus,
      loadMore: true
    }));
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchValidationSummary());
    loadData(1);
    setRefreshing(false);
  };
  
  // Press survey item
  const handleSurveyPress = (survey) => {
    navigation.navigate('SurveyValidasiForm', { survey });
  };
  
  // Quick validate survey
  const handleQuickValidate = (id_survey, hasil_survey) => {
    Alert.alert(
      'Konfirmasi Validasi',
      `Apakah Anda yakin ingin menandai survey ini sebagai ${hasil_survey}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya', 
          onPress: () => {
            navigation.navigate('SurveyValidasiForm', { 
              id_survey,
              preselectedResult: hasil_survey
            });
          }
        }
      ]
    );
  };
  
  // Render survey item
  const renderSurveyItem = ({ item }) => (
    <SurveyValidasiItem
      survey={item}
      onPress={() => handleSurveyPress(item)}
      onValidate={handleQuickValidate}
    />
  );
  
  // Render loading more indicator
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#2E86DE" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  };
  
  // Render empty list
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={require('../../../assets/icon.png')} 
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>
        {searchQuery || currentStatus
          ? 'Tidak ada hasil yang cocok dengan filter Anda'
          : 'Belum ada data survey untuk divalidasi'
        }
      </Text>
    </View>
  );
  
  // Show loading overlay for initial loading
  if (isLoading && currentPage === 1 && !refreshing) {
    return <LoadingOverlay />;
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validasi Survey</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {/* Summary Cards */}
      {!isLoadingSummary && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.totalCard]}>
              <Text style={styles.summaryNumber}>{summary.total || 0}</Text>
              <Text style={styles.summaryText}>Total</Text>
            </View>
            <View style={[styles.summaryCard, styles.pendingCard]}>
              <Text style={styles.summaryNumber}>{summary.pending || 0}</Text>
              <Text style={styles.summaryText}>Menunggu</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.layakCard]}>
              <Text style={styles.summaryNumber}>{summary.layak || 0}</Text>
              <Text style={styles.summaryText}>Layak</Text>
            </View>
            <View style={[styles.summaryCard, styles.tidakLayakCard]}>
              <Text style={styles.summaryNumber}>{summary.tidak_layak || 0}</Text>
              <Text style={styles.summaryText}>Tidak Layak</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Search and filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kepala keluarga atau No. KK..."
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
      {currentStatus && (
        <View style={styles.appliedFiltersContainer}>
          <Text style={styles.appliedFiltersLabel}>Filter aktif:</Text>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{currentStatus}</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.filterChipClose}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Survey list */}
      <FlatList
        data={list}
        renderItem={renderSurveyItem}
        keyExtractor={(item) => item.id_survey?.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2E86DE']}
          />
        }
      />
      
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
              <Text style={styles.modalTitle}>Filter Status</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  currentStatus === '' && styles.activeFilterOption
                ]}
                onPress={() => applyFilter('')}
              >
                <Text style={styles.filterOptionText}>Semua</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  currentStatus === null && styles.activeFilterOption
                ]}
                onPress={() => applyFilter(null)}
              >
                <Text style={styles.filterOptionText}>Menunggu Validasi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  currentStatus === 'Layak' && styles.activeFilterOption
                ]}
                onPress={() => applyFilter('Layak')}
              >
                <Text style={styles.filterOptionText}>Layak</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  currentStatus === 'Tidak Layak' && styles.activeFilterOption
                ]}
                onPress={() => applyFilter('Tidak Layak')}
              >
                <Text style={styles.filterOptionText}>Tidak Layak</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption,
                  currentStatus === 'Tambah Kelayakan' && styles.activeFilterOption
                ]}
                onPress={() => applyFilter('Tambah Kelayakan')}
              >
                <Text style={styles.filterOptionText}>Tambah Kelayakan</Text>
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
  summaryContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  totalCard: {
    backgroundColor: '#f0f0f0',
  },
  pendingCard: {
    backgroundColor: '#fff3cd',
  },
  layakCard: {
    backgroundColor: '#d4edda',
  },
  tidakLayakCard: {
    backgroundColor: '#f8d7da',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
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
    minHeight: 200,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
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
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeFilterOption: {
    backgroundColor: '#E6F2FF',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SurveyValidasiListScreen;