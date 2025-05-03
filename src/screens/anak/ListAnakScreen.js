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
import { fetchAnak, deleteAnak, resetAnakState, toggleAnakStatus } from '../../redux/slices/anakSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { calculateAge } from '../../utils/dateUtils';
import { getStatusCpbColor } from '../../utils/status-colors';

const { width } = Dimensions.get('window');

const ListAnakScreen = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { 
    list, 
    isLoading, 
    isLoadingMore, 
    error, 
    deleteSuccess, 
    pagination,
    toggleStatusSuccess,
    isTogglingStatus
  } = useAppSelector((state) => state.anak);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const statusFilter = route.params?.status;

  useEffect(() => {
    dispatch(fetchAnak({ 
      page: 1, 
      search: searchQuery,
      status: statusFilter
    }));
  }, [dispatch, searchQuery, statusFilter]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data anak berhasil dihapus');
      dispatch(resetAnakState());
      dispatch(fetchAnak({ 
        page: 1, 
        search: searchQuery,
        status: statusFilter 
      }));
    }
  }, [deleteSuccess, dispatch, searchQuery, statusFilter]);
  
  // Handle toggle status success
  useEffect(() => {
    if (toggleStatusSuccess) {
      Alert.alert('Sukses', 'Status anak berhasil diubah');
      dispatch(resetAnakState());
      dispatch(fetchAnak({ 
        page: 1, 
        search: searchQuery,
        status: statusFilter 
      }));
    }
  }, [toggleStatusSuccess, dispatch, searchQuery, statusFilter]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading && 
      !isLoadingMore && 
      currentPage < pagination.last_page
    ) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(fetchAnak({ 
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

  const handleViewAnak = (idAnak) => {
    navigation.navigate('DetailAnak', { idAnak });
  };

  const handleEditAnak = (idAnak) => {
    navigation.navigate('EditAnak', { idAnak });
  };

  const handleDeleteAnak = (idAnak, anakName) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data anak ${anakName}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => dispatch(deleteAnak(idAnak)),
          style: 'destructive',
        },
      ]
    );
  };
  
  // Handle toggle status
  const handleToggleStatus = (idAnak, anakName, currentStatus) => {
    const newStatus = currentStatus === 'aktif' ? 'non-aktif' : 'aktif';
    const action = currentStatus === 'aktif' ? 'menonaktifkan' : 'mengaktifkan';
    
    Alert.alert(
      `Konfirmasi ${action} status`,
      `Apakah Anda yakin ingin ${action} status anak ${anakName}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => dispatch(toggleAnakStatus(idAnak)),
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const statusCpbColors = getStatusCpbColor(item.status_cpb);
    const isActive = item.status_validasi === 'aktif';

    return (
      <TouchableOpacity 
        style={styles.anakCard}
        onPress={() => handleViewAnak(item.id_anak)}
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
            style={styles.anakPhoto}
          />
          <View style={styles.anakInfo}>
            <Text style={styles.anakName} numberOfLines={2}>
              {item.full_name}
            </Text>
            <Text style={styles.DetailAnak}>
              Umur: {calculateAge(item.tanggal_lahir)} tahun
            </Text>
            <Text style={styles.anakStatus}>
              Status: <Text style={getStatusStyle(item.status_validasi)}>
                {item.status_validasi}
              </Text>
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          {/* Toggle Status Button */}
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isActive ? styles.deactivateButton : styles.activateButton
            ]}
            onPress={() => handleToggleStatus(item.id_anak, item.full_name, item.status_validasi)}
            disabled={isTogglingStatus}
          >
            <Text style={[
              styles.actionButtonText, 
              isActive ? styles.deactivateText : styles.activateText
            ]}>
              {isActive ? 'Non-aktifkan' : 'Aktifkan'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditAnak(item.id_anak)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteAnak(item.id_anak, item.full_name)}
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
      case 'non-aktif':
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
      case 'non-aktif':
        return {
          title: 'Anak Binaan non-aktif',
          subtitle: `Total: ${pagination.anak_tidak_aktif} anak non-aktif`
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
            onPress={() => dispatch(fetchAnak({ 
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
  anakCard: {
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
  anakPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  anakInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  anakName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  DetailAnak: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  anakStatus: {
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
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  activateButton: {
    backgroundColor: '#27ae60',
  },
  deactivateButton: {
    backgroundColor: '#f39c12',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteText: {
    color: '#e74c3c',
  },
  activateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deactivateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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
  footerLoading: {
    padding: 10,
    alignItems: 'center',
  },
});

export default ListAnakScreen;