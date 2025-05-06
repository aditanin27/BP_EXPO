// src/screens/aktivitas/AktivitasDetailScreen.js
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAktivitasById, 
  deleteAktivitas,
  resetAktivitasState,
  clearSelectedAktivitas
} from '../../redux/slices/aktivitasSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import CardSection from '../../components/CardSection';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

const AktivitasDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { selectedAktivitas, isLoadingDetail, error, deleteSuccess } = useAppSelector(
    (state) => state.aktivitas
  );
  
  useEffect(() => {
    dispatch(fetchAktivitasById(id));
    
    return () => {
      dispatch(clearSelectedAktivitas());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Aktivitas berhasil dihapus');
      navigation.goBack();
    }
  }, [deleteSuccess, navigation]);
  
  const handleEdit = () => {
    navigation.navigate('AktivitasForm', { id });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus aktivitas ini?',
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
  
  const handleManageFoto = () => {
    navigation.navigate('FotoAktivitas', { id });
  };
  
  const handleAbsensi = () => {
    navigation.navigate('Absen', { id_aktivitas: id });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  if (isLoadingDetail || !selectedAktivitas) {
    return <LoadingOverlay />;
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Kembali" 
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }
  
  // Get all available photos
  const photos = [
    selectedAktivitas.foto_1_url,
    selectedAktivitas.foto_2_url,
    selectedAktivitas.foto_3_url
  ].filter(Boolean);
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {selectedAktivitas.jenis_kegiatan === 'Bimbel' 
              ? `Bimbel ${selectedAktivitas.nama_kelompok || ''}` 
              : selectedAktivitas.materi}
          </Text>
          <View style={styles.typeContainer}>
            <Text style={styles.typeText}>{selectedAktivitas.jenis_kegiatan}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <CardSection title="Informasi Aktivitas">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tanggal:</Text>
              <Text style={styles.infoValue}>{formatDate(selectedAktivitas.tanggal)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Jenis:</Text>
              <Text style={styles.infoValue}>{selectedAktivitas.jenis_kegiatan}</Text>
            </View>
            
            {selectedAktivitas.jenis_kegiatan === 'Bimbel' ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Kelompok:</Text>
                  <Text style={styles.infoValue}>{selectedAktivitas.nama_kelompok || '-'}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Level:</Text>
                  <Text style={styles.infoValue}>{selectedAktivitas.level || '-'}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Materi:</Text>
                  <Text style={styles.infoValue}>{selectedAktivitas.materi || '-'}</Text>
                </View>
              </>
            ) : (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nama:</Text>
                <Text style={styles.infoValue}>{selectedAktivitas.materi || '-'}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shelter:</Text>
              <Text style={styles.infoValue}>
                {selectedAktivitas.shelter?.nama_shelter || '-'}
              </Text>
            </View>
          </CardSection>
          
          <CardSection title="Foto Aktivitas">
            {photos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photoImage}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noPhotosText}>Belum ada foto</Text>
            )}
            
            <Button
              title="Kelola Foto"
              onPress={handleManageFoto}
              style={styles.photoButton}
            />
          </CardSection>
          
          <View style={styles.actionButtonsContainer}>
            <Button
              title="Absensi"
              onPress={handleAbsensi}
              style={styles.absensiButton}
            />
            
            <Button
              title="Edit"
              onPress={handleEdit}
              style={styles.editButton}
            />
            
            <Button
              title="Hapus"
              onPress={handleDelete}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </View>
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
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  typeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  typeText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  photoImage: {
    width: width * 0.7,
    height: width * 0.5,
    borderRadius: 10,
    marginRight: 10,
  },
  noPhotosText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  photoButton: {
    marginTop: 15,
  },
  actionButtonsContainer: {
    marginTop: 20,
  },
  absensiButton: {
    backgroundColor: '#27ae60',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  deleteButtonText: {
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
});

export default AktivitasDetailScreen;