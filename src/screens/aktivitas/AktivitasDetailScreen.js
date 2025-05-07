// src/screens/aktivitas/AktivitasDetailScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAktivitasDetail, 
  clearAktivitasDetail, 
  deleteAktivitas, 
  resetAktivitasState
} from '../../redux/slices/aktivitasSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import CardSection from '../../components/CardSection';
import Button from '../../components/Button';

const { width: screenWidth } = Dimensions.get('window');

const AktivitasDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id } = route.params || {};
  const { detail, isLoadingDetail, deleteSuccess, error } = useAppSelector(state => state.aktivitas);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoGalleryVisible, setPhotoGalleryVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const flatListRef = useRef(null);
  
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
  
  // Handle error
  useEffect(() => {
    if (error) {
      setIsDeleting(false);
      Alert.alert('Error', error);
      dispatch(resetAktivitasState());
    }
  }, [error]);
  
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
  
  const handleManagePhotos = () => {
    navigation.navigate('FotoAktivitas', { id });
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
  
  const openPhotoGallery = (index) => {
    setSelectedPhotoIndex(index);
    setPhotoGalleryVisible(true);
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
  ].filter(url => url && url !== 'https://berbagipendidikan.org/images/default.png');
  
  const hasPhotos = photos.length > 0;
  
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
        <Text style={styles.headerTitle}>Detail Aktivitas</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
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
          
          {/* Photos Grid */}
          {hasPhotos ? (
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <TouchableOpacity 
                  key={`photo-${index}`}
                  style={styles.photoThumbnail}
                  onPress={() => openPhotoGallery(index)}
                >
                  <Image
                    source={{ uri: photo }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.noPhotoContainer}
              onPress={handleManagePhotos}
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
          
          {/* Spacer to ensure content is visible above the action buttons */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      
      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Kelola Absensi"
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
            style={styles.photoButton}
            onPress={handleManagePhotos}
          >
            <Text style={styles.photoButtonText}>Foto</Text>
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
      
      {/* Photo Gallery Modal */}
      <Modal
        visible={photoGalleryVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoGalleryVisible(false)}
      >
        <View style={styles.galleryContainer}>
          <TouchableOpacity 
            style={styles.galleryCloseButton}
            onPress={() => setPhotoGalleryVisible(false)}
          >
            <Text style={styles.galleryCloseText}>×</Text>
          </TouchableOpacity>
          
          <FlatList
            ref={flatListRef}
            data={photos}
            keyExtractor={(item, index) => `gallery-photo-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedPhotoIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onScrollToIndexFailed={() => {
              // Handle scroll failure if needed
            }}
            renderItem={({ item }) => (
              <View style={styles.gallerySlide}>
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImage}
                  resizeMode="contain"
                />
              </View>
            )}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setSelectedPhotoIndex(newIndex);
            }}
          />
          
          {/* Pagination indicator */}
          <View style={styles.paginationContainer}>
            {photos.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[
                  styles.paginationDot,
                  selectedPhotoIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // Ensure there's room for the action buttons
  },
  content: {
    padding: 16,
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
  // New photo grid styles
  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoThumbnail: {
    width: '32%',
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  noPhotoContainer: {
    height: 100,
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
  bottomSpacer: {
    height: 80, // Extra space at the bottom to ensure content is not hidden by action buttons
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
    elevation: 5,
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
  photoButton: {
    flex: 1,
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  photoButtonText: {
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
  galleryContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryCloseText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gallerySlide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: screenWidth,
    height: '80%',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default AktivitasDetailScreen;