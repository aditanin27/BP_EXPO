import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchSurveys, 
  resetSurveyState 
} from '../../redux/slices/surveySlice';
import SurveyItem from '../../components/SurveyItem';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const SurveyListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    list, 
    availableFamilies,
    pagination, 
    isLoading, 
    isLoadingMore, 
    error 
  } = useAppSelector(state => state.survey);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSurveys, setShowAllSurveys] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, [showAllSurveys]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetSurveyState());
    }
  }, [error]);
  
  const loadData = (page = 1) => {
    setCurrentPage(page);
    dispatch(fetchSurveys({ 
      page, 
      search: searchQuery,
      show_all: showAllSurveys
    }));
  };
  
  const handleSearch = () => {
    loadData(1);
  };
  
  const handleToggleView = () => {
    setShowAllSurveys(!showAllSurveys);
  };
  
  const handleLoadMore = () => {
    if (isLoadingMore || currentPage >= pagination.last_page) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(fetchSurveys({ 
      page: nextPage, 
      search: searchQuery,
      show_all: showAllSurveys,
      loadMore: true 
    }));
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadData(1);
    setRefreshing(false);
  };
  
  const handleItemPress = (item) => {
    if (showAllSurveys) {
      // View survey details
      navigation.navigate('SurveyDetail', { 
        id_keluarga: item.id_keluarga || item.keluarga?.id_keluarga 
      });
    } else {
      // Create new survey
      navigation.navigate('SurveyForm', { 
        id_keluarga: item.id_keluarga,
        keluarga: item 
      });
    }
  };
  
  const renderItem = ({ item }) => (
    <SurveyItem
      data={item}
      onPress={() => handleItemPress(item)}
      isSurvey={showAllSurveys}
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
        {searchQuery
          ? 'Tidak ada hasil yang cocok dengan pencarian Anda' 
          : showAllSurveys 
            ? 'Belum ada survey yang telah dibuat' 
            : 'Semua keluarga sudah disurvey'
        }
      </Text>
    </View>
  );
  
  if (isLoading && currentPage === 1 && !refreshing) {
    return <LoadingOverlay />;
  }
  
  const dataToShow = showAllSurveys ? list : availableFamilies;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showAllSurveys ? 'Daftar Survey' : 'Buat Survey'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={showAllSurveys ? "Cari survey..." : "Cari keluarga..."}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Button 
          title="Cari" 
          onPress={handleSearch} 
          style={styles.searchButton}
        />
      </View>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !showAllSurveys && styles.activeToggleButton
          ]}
          onPress={() => !showAllSurveys || handleToggleView()}
        >
          <Text style={[
            styles.toggleText,
            !showAllSurveys && styles.activeToggleText
          ]}>
            Buat Survey
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            showAllSurveys && styles.activeToggleButton
          ]}
          onPress={() => showAllSurveys || handleToggleView()}
        >
          <Text style={[
            styles.toggleText,
            showAllSurveys && styles.activeToggleText
          ]}>
            Lihat Survey
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={item => {
          if (showAllSurveys) {
            return `survey-${item.id_survey || item.id_keluarga || item.keluarga?.id_keluarga}`;
          }
          return `keluarga-${item.id_keluarga}`;
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  searchButton: {
    width: 70,
    paddingVertical: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  activeToggleButton: {
    backgroundColor: '#E6F2FF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  activeToggleText: {
    color: '#2E86DE',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
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
    padding: 20,
    marginTop: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SurveyListScreen;