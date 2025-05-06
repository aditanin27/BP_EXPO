// src/screens/aktivitas/AbsenScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Alert,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAbsenByAktivitas, 
  createAbsen,
  updateAbsen,
  resetAbsenState,
  updateAbsenWorkingData,
  initializeWorkingData
} from '../../redux/slices/absenSlice';
import { fetchAktivitasById } from '../../redux/slices/aktivitasSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import AbsenItem from '../../components/AbsenItem';

const AbsenScreen = ({ navigation, route }) => {
  const { id_aktivitas } = route.params;
  const dispatch = useAppDispatch();
  
  const { 
    absenList, 
    isExisting, 
    aktivitasDetails,
    workingData,
    isLoading, 
    isCreating,
    isUpdating,
    error,
    createSuccess,
    updateSuccess
  } = useAppSelector((state) => state.absen);
  
  const { selectedAktivitas } = useAppSelector((state) => state.aktivitas);
  
  // Load data
  useEffect(() => {
    dispatch(fetchAbsenByAktivitas(id_aktivitas));
    dispatch(fetchAktivitasById(id_aktivitas));
    
    return () => {
      dispatch(resetAbsenState());
    };
  }, [dispatch, id_aktivitas]);
  
  // Initialize working data once absenList is loaded
  useEffect(() => {
    if (absenList.length > 0) {
      dispatch(initializeWorkingData());
    }
  }, [dispatch, absenList]);
  
  // Handle success responses
  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Sukses', 'Absensi berhasil disimpan');
      dispatch(resetAbsenState());
      navigation.goBack();
    }
    
    if (updateSuccess) {
      Alert.alert('Sukses', 'Absensi berhasil diperbarui');
      dispatch(resetAbsenState());
      navigation.goBack();
    }
  }, [createSuccess, updateSuccess, dispatch, navigation]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetAbsenState());
    }
  }, [error, dispatch]);
  
  // Handle attendance status change
  const handleStatusChange = (id_anak, status) => {
    dispatch(updateAbsenWorkingData({ id_anak, status }));
  };
  
  // Save attendance records
  const handleSave = () => {
    // Check if there are unsaved changes
    if (workingData.length === 0) {
      Alert.alert('Info', 'Tidak ada data absensi untuk disimpan');
      return;
    }
    
    // Build data for API
    if (isExisting) {
      // Update existing attendance records
      const absen_data = workingData.map(item => ({
        id_absen: item.id_absen,
        status: item.status_absen
      }));
      
      dispatch(updateAbsen({ id_aktivitas, absen_data }));
    } else {
      // Create new attendance records
      const absen_data = workingData.map(item => ({
        id_anak: item.id_anak,
        status: item.status_absen || 'Tidak' // Default to 'Tidak' if not set
      }));
      
      dispatch(createAbsen({ id_aktivitas, absen_data }));
    }
  };
  
  // Format date for display
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Absensi</Text>
        {selectedAktivitas && (
          <>
            <Text style={styles.headerSubtitle}>
              {selectedAktivitas.jenis_kegiatan === 'Bimbel' 
                ? `Bimbel ${selectedAktivitas.nama_kelompok || ''}` 
                : selectedAktivitas.materi}
            </Text>
            <Text style={styles.headerDate}>
              {formatDate(selectedAktivitas.tanggal)}
            </Text>
          </>
        )}
      </View>
      
      <View style={styles.statusLegend}>
        <Text style={styles.legendTitle}>Status Kehadiran:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.legendText}>Hadir</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Tidak Hadir</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f39c12' }]} />
            <Text style={styles.legendText}>Izin</Text>
          </View>
        </View>
      </View>
      
      {workingData.length > 0 ? (
        <FlatList
          data={workingData}
          keyExtractor={(item) => item.id_anak.toString()}
          renderItem={({ item }) => (
            <AbsenItem
              anak={item}
              onStatusChange={(status) => handleStatusChange(item.id_anak, status)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tidak ada data anak untuk diabsen</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          title="Simpan Absensi"
          onPress={handleSave}
          isLoading={isCreating || isUpdating}
          style={styles.saveButton}
        />
        
        <Button
          title="Batal"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
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
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  headerDate: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 2,
  },
  statusLegend: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 120, // Extra space for buttons
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999',
  },
  cancelButtonText: {
    color: '#555',
  },
});

export default AbsenScreen;