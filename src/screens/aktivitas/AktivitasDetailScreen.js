// src/screens/aktivitas/AktivitasDetailScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAktivitasDetail, 
  clearAktivitasDetail, 
  deleteAktivitas 
} from '../../redux/slices/aktivitasSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import CardSection from '../../components/CardSection';
import Button from '../../components/Button';

const AktivitasDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id } = route.params || {};
  const { detail, isLoadingDetail, deleteSuccess, error } = useAppSelector(state => state.aktivitas);
  
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch aktivitas detail when screen loads
  useEffect(() => {
    if (id) {
      dispatch(fetchAktivitasDetail(id));
    }
    
    // Clear detail on unmount
    return () => {
      dispatch(clearAktivitasDetail());
    };
  }, [dispatch, id]);
  
  // Handle successful delete
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
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            dispatch(deleteAktivitas(id));
          },
        },
      ]
    );
  };
  
 
  
  const handleManageAbsensi = () => {
    navigation.navigate('Absen', { id });
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
  
  // Show loading indicator when fetching detail
  if (isLoadingDetail) {
    return <LoadingOverlay />;
  }
  
  // Handle error state
  if (error && !detail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button 
          title="Kembali" 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        />
      </View>
    );
  }
  
  // If no detail available yet
  if (!detail) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Data aktivitas tidak ditemukan</Text>
        <Button 
          title="Kembali" 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        />
      </View>
    );
  }
  
  // Get photos for preview
  const photos = [
    detail.foto_1_url,
    detail.foto_2_url,
    detail.foto_3_url
  ].filter(url => url);
  
  const hasPhotos = photos.length > 0;
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Aktivitas</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Main content */}
        <View style={styles.content}>
          {/* Activity type badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{detail.jenis_kegiatan}</Text>
          </View>
          
          {/* Activity title */}
          <Text style={styles.title}>{detail.materi}</Text>
          
          {/* Date */}
          <Text style={styles.date}>
            {formatDate(detail.tanggal)}
          </Text>
          
          {/* Photo preview */}
          {hasPhotos ? (
            <TouchableOpacity 
              style={styles.photoPreview}
              
            >
              <Image
                source={{ uri: photos[0] }}
                style={styles.photoImage}
                resizeMode="cover"
              />
              {photos.length > 1 && (
                <View style={styles.morePhotosIndicator}>
                  <Text style={styles.morePhotosText}>+{photos.length - 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.noPhotoContainer}
              
            >
              <Text style={styles.noPhotoText}>
                Tidak ada foto. Tap untuk menambahkan foto.
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Activity details */}
          <CardSection title="Detail Aktivitas">
            {detail.jenis_kegiatan === 'Bimbel' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kelompok:</Text>
                  <Text style={styles.detailValue}>{detail.nama_kelompok || '-'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Level:</Text>
                  <Text style={styles.detailValue}>{detail.level || '-'}</Text>
                </View>
              </>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shelter:</Text>
              <Text style={styles.detailValue}>{detail.shelter?.nama_shelter || '-'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Koordinator:</Text>
              <Text style={styles.detailValue}>{detail.shelter?.nama_koordinator || '-'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>No. Telpon:</Text>
              <Text style={styles.detailValue}>{detail.shelter?.no_telpon || '-'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Alamat:</Text>
              <Text style={styles.detailValue}>{detail.shelter?.alamat || '-'}</Text>
            </View>
          </CardSection>
        </View>
      </ScrollView>
      
      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Absensi"
          onPress={handleManageAbsensi}
          style={styles.absensiButton}
        />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#e74c3c" />
            ) : (
              <Text style={styles.deleteButtonText}>Hapus</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2E86DE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Add extra padding for bottom buttons
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F2FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#2E86DE',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photoPreview: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  morePhotosIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  morePhotosText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noPhotoContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  noPhotoText: {
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 110,
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  absensiButton: {
    backgroundColor: '#27ae60',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2E86DE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default AktivitasDetailScreen;
