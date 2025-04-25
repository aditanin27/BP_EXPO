import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchChildren, deleteChild, resetChildrenState } from '../../redux/slices/childrenSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { calculateAge } from '../../utils/dateUtils';
import { getStatusCpbColor } from '../../utils/status-colors';

const { width } = Dimensions.get('window');

const ChildrenListScreen = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { 
    list, 
    isLoading, 
    isLoadingMore, 
    error, 
    deleteSuccess, 
    pagination 
  } = useAppSelector((state) => state.children);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const statusFilter = route.params?.status;

  useEffect(() => {
    dispatch(fetchChildren({ 
      page: 1, 
      search: searchQuery,
      status: statusFilter
    }));
  }, [dispatch, searchQuery, statusFilter]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data anak berhasil dihapus');
      dispatch(resetChildrenState());
      dispatch(fetchChildren({ 
        page: 1, 
        search: searchQuery,
        status: statusFilter 
      }));
    }
  }, [deleteSuccess, dispatch, searchQuery, statusFilter]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading && 
      !isLoadingMore && 
      currentPage < pagination.last_page
    ) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(fetchChildren({ 
        page: nextPage, 
        search: searchQuery, 
        loadMore: true,
        status: statusFilter 
      }));
    }
  }, [
    dispatch, 
    currentPage, 
    pagination.last_page, 
    isLoading, 
    isLoadingMore, 
    searchQuery,
    statusFilter
  ]);

  const handleAddChild = () => {
    navigation.navigate('AddChild');
  };

  const handleViewChild = (childId) => {
    navigation.navigate('ChildDetail', { childId });
  };

  const handleEditChild = (childId) => {
    navigation.navigate('EditChild', { childId });
  };

  const handleDeleteChild = (childId, childName) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data anak ${childName}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => dispatch(deleteChild(childId)),
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const statusCpbColors = getStatusCpbColor(item.status_cpb);

    return (
      <TouchableOpacity 
        style={styles.childCard}
        onPress={() => handleViewChild(item.id_anak)}
      >
        <View style={styles.statusCpbContainer}>
          <View 
            style={[
              styles.statusCpbBadge, 
              { backgroundColor: statusCpbColors.backgroundColor }
            ]}
          >
            <Text 
              style={[
                styles.statusCpbText, 
                { color: statusCpbColors.textColor }
              ]}
            >
              {statusCpbColors.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Image
            source={{ 
              uri: item.foto_url || 'https://berbagipendidikan.org/images/default.png'
            }}
            style={styles.childPhoto}
          />
          <View style={styles.childInfo}>
            <Text style={styles.childName} numberOfLines={2}>
              {item.full_name}
            </Text>
            <Text style={styles.childDetail}>
              Umur: {calculateAge(item.tanggal_lahir)} tahun
            </Text>
            <Text style={styles.childStatus}>
              Status: <Text style={getStatusStyle(item.status_validasi)}>
                {item.status_validasi}
              </Text>
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditChild(item.id_anak)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteChild(item.id_anak, item.full_name)}
          >
            <Text style={[styles.buttonText, styles.deleteText]}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'aktif':
        return styles.statusActive;
      case 'tidak aktif':
        return styles.statusInactive;
      case 'Ditolak':
        return styles.statusRejected;
      case 'Ditangguhkan':
        return styles.statusSuspended;
      default:
        return styles.statusInactive;
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <Text>Memuat lebih banyak...</Text>
      </View>
    );
  };

  const getHeaderInfo = () => {
    switch (statusFilter) {
      case 'aktif':
        return {
          title: 'Anak Binaan Aktif',
          subtitle: `Total: ${pagination.anak_aktif} anak aktif`
        };
      case 'tidak aktif':
        return {
          title: 'Anak Binaan Tidak Aktif',
          subtitle: `Total: ${pagination.anak_tidak_aktif} anak tidak aktif`
        };
      default:
        return {
          title: 'Daftar Anak Binaan',
          subtitle: `Total: ${pagination.total} anak`
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerInfo.title}</Text>
        <Text style={styles.headerSubtitle}>{headerInfo.subtitle}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama anak..."
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
            onPress={() => dispatch(fetchChildren({ 
              page: 1, 
              search: searchQuery,
              status: statusFilter 
            }))} 
          />
        </View>
      ) : (
        <>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id_anak.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery 
                    ? 'Tidak ada anak yang sesuai dengan pencarian' 
                    : 'Belum ada data anak'
                  }
                </Text>
              </View>
            }
          />
          
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={handleAddChild}
            >
              <Text style={styles.floatingButtonText}>+</Text>
            </TouchableOpacity>
          </View>
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
  },
  childCard: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  statusCpbContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  statusCpbBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
  },
  statusCpbText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  childPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  childInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  childDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  childStatus: {
    fontSize: 14,
    color: '#666',
  },
  statusActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  statusInactive: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  statusRejected: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  statusSuspended: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
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
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  statusCpbBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 5,
  },
  statusCpbText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChildrenListScreen;