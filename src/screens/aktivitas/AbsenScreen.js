// src/screens/aktivitas/AbsenScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchAbsenByAktivitas,
  submitAbsen,
  updateAbsenStatus,
  fetchAvailableChildren,
  resetAbsenState,
  updateAbsenLocal
} from '../../redux/slices/absenSlice';
import { fetchAktivitasDetail } from '../../redux/slices/aktivitasSlice';
import AbsenItem from '../../components/AbsenItem';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const AbsenScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id: id_aktivitas } = route.params || {};
  
  const {
    list,
    aktivitas,
    isLoading,
    isSubmitting,
    isUpdating,
    submitSuccess,
    error
  } = useAppSelector(state => state.absen);
  
  const { detail: aktivitasDetail } = useAppSelector(state => state.aktivitas);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [changed, setChanged] = useState(false);
  
  // Fetch absensi data for the specified activity when component mounts
  useEffect(() => {
    if (id_aktivitas) {
      dispatch(fetchAbsenByAktivitas(id_aktivitas));
      if (!aktivitasDetail) {
        dispatch(fetchAktivitasDetail(id_aktivitas));
      }
    }
    
    // Clean up when component unmounts
    return () => {
      dispatch(resetAbsenState());
    };
  }, [dispatch, id_aktivitas]);
  
  // Update the filtered list when list or search query changes
  useEffect(() => {
    if (list) {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const filtered = list.filter(item => 
          item.nama_anak?.toLowerCase().includes(query) || 
          item.nick_name?.toLowerCase().includes(query)
        );
        setFilteredList(filtered);
      } else {
        setFilteredList(list);
      }
    }
  }, [list, searchQuery]);
  
  // Handle submit success
  useEffect(() => {
    if (submitSuccess) {
      setChanged(false);
      Alert.alert('Sukses', 'Data absensi berhasil disimpan', [
        { text: 'OK' }
      ]);
      dispatch(resetAbsenState());
    }
  }, [submitSuccess, dispatch]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetAbsenState());
    }
  }, [error, dispatch]);
  
  // Handle attendance status change for a child
  const handleStatusChange = (id_anak, status) => {
    // Update local state first for immediate feedback
    dispatch(updateAbsenLocal({ id_anak, status_absen: status }));
    setChanged(true);
    
    // Optionally update on server immediately (real-time sync)
    // Comment out if you prefer batch updates with the Submit button
    /*
    dispatch(updateAbsenStatus({ 
      id_aktivitas, 
      id_anak, 
      status_absen: status 
    }));
    */
  };
  
  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
  };
  
  // Submit all attendance data
  const handleSubmit = () => {
    if (list.length === 0) {
      Alert.alert('Error', 'Tidak ada data absensi untuk disimpan');
      return;
    }
    
    // Format attendance data for submission
    const absenData = list.map(item => ({
      id_anak: item.id_anak,
      status_absen: item.status_absen || 'Tidak' // Default to 'Tidak' if not set
    }));
    
    dispatch(submitAbsen({ id_aktivitas, absenData }));
  };
  
  // Render item for the FlatList
  const renderItem = ({ item }) => (
    <AbsenItem
      anak={item}
      onStatusChange={(status) => handleStatusChange(item.id_anak, status)}
    />
  );
  
  // Render empty list state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'Tidak ada hasil yang sesuai dengan pencarian'
          : 'Tidak ada data absensi untuk aktivitas ini'
        }
      </Text>
    </View>
  );
  
  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  if (isLoading) {
    return <LoadingOverlay />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Absensi Aktivitas</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {/* Activity info */}
      <View style={styles.activityInfo}>
        <View style={styles.activityHeader}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {aktivitasDetail?.jenis_kegiatan || aktivitas?.jenis_kegiatan || '-'}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {formatDate(aktivitasDetail?.tanggal || aktivitas?.tanggal)}
          </Text>
        </View>
        
        <Text style={styles.activityTitle}>
          {aktivitasDetail?.materi || aktivitas?.materi || 'Aktivitas'}
        </Text>
        
        {aktivitasDetail?.jenis_kegiatan === 'Bimbel' && (
          <View style={styles.bimbelInfo}>
            <Text style={styles.bimbelText}>
              Kelompok: {aktivitasDetail.nama_kelompok || '-'}
            </Text>
            <Text style={styles.bimbelText}>
              Level: {aktivitasDetail.level || '-'}
            </Text>
          </View>
        )}
      </View>
      
      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama anak..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Header for attendance status columns */}
      <View style={styles.statusHeader}>
        <View style={styles.nameColumn}>
          <Text style={styles.statusHeaderText}>Nama Anak</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.statusHeaderText}>Hadir</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.statusHeaderText}>Tidak</Text>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.statusHeaderText}>Izin</Text>
        </View>
      </View>
      
      {/* Attendance list */}
      <FlatList
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={item => item.id_anak.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
      
      {/* Submit button */}
      <View style={styles.submitButtonContainer}>
        <Button
          title="Simpan Absensi"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          style={[
            styles.submitButton,
            !changed && styles.disabledButton
          ]}
          disabled={!changed || isSubmitting}
        />
      </View>
    </SafeAreaView>
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
  activityInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: '#E6F2FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#2E86DE',
    fontWeight: '600',
    fontSize: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  bimbelInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  bimbelText: {
    fontSize: 14,
    color: '#666',
    marginRight: 20,
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
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  clearButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  statusHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  nameColumn: {
    flex: 1,
  },
  statusColumn: {
    width: 60,
    alignItems: 'center',
  },
  statusHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for the submit button
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
  },
  submitButton: {
    backgroundColor: '#27ae60',
  },
  disabledButton: {
    backgroundColor: '#a0dab3',
  },
});

export default AbsenScreen;