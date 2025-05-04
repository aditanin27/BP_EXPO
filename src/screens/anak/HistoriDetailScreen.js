import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchHistoriDetail, 
  deleteHistori,
  resetHistoriState
} from '../../redux/slices/historiSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const { width } = Dimensions.get('window');

const HistoriDetailScreen = ({ route, navigation }) => {
  const { historiId } = route.params;
  const dispatch = useAppDispatch();
  const { 
    detail: histori, 
    isLoading, 
    error, 
    deleteSuccess 
  } = useAppSelector((state) => state.histori);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(resetHistoriState());
    dispatch(fetchHistoriDetail(historiId));
  }, [dispatch, historiId]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Riwayat berhasil dihapus');
      dispatch(resetHistoriState());
      navigation.goBack();
    }
  }, [deleteSuccess, navigation, dispatch]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    if (histori && !isLoading) {
      navigation.navigate('EditHistori', { 
        histori,
        selectedAnak: histori.anak 
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus riwayat ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            dispatch(deleteHistori(historiId));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (isLoading && !histori) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Kembali" 
          onPress={handleBack} 
          style={styles.backButton} 
        />
      </SafeAreaView>
    );
  }

  if (!histori) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Data riwayat tidak ditemukan</Text>
        <Button 
          title="Kembali" 
          onPress={handleBack} 
          style={styles.backButton} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Riwayat</Text>
          <Text style={styles.headerSubtitle}>
            {histori.anak?.full_name || 'Anak Binaan'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{histori.nama_histori}</Text>
            <Text style={styles.cardDate}>{histori.tanggal}</Text>
          </View>

          <View style={styles.sectionContent}>
            <Text style={styles.infoLabel}>Jenis Histori:</Text>
            <Text style={styles.infoValue}>{histori.jenis_histori}</Text>
            
            {histori.di_opname && (
              <>
                <Text style={styles.infoLabel}>Di Opname:</Text>
                <Text style={styles.infoValue}>{histori.di_opname}</Text>
              </>
            )}
          </View>
        </View>

        {histori.foto_url && (
          <View style={styles.photoCard}>
            <Text style={styles.cardTitle}>Foto Riwayat</Text>
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={() => openImageModal(histori.foto_url)}
            >
              <Image
                source={{ uri: histori.foto_url }}
                style={styles.photoThumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.editButton, 
              (isLoading) && styles.editButtonDisabled
            ]} 
            onPress={handleEdit}
            disabled={isLoading}
          >
            <Text style={styles.editButtonText}>
              {isLoading ? 'Memuat...' : 'Edit'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.deleteButton, 
              (isLoading) && styles.deleteButtonDisabled
            ]} 
            onPress={handleDelete}
            disabled={isLoading}
          >
            <Text style={styles.deleteButtonText}>
              {isLoading ? 'Memuat...' : 'Hapus'}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Kembali"
          onPress={handleBack}
          style={styles.backButton}
        />
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={closeImageModal}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 15,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  sectionContent: {
    padding: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  photoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  photoContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2E86DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  deleteButtonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    marginHorizontal: 15,
    backgroundColor: '#555',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalImage: {
    width: width,
    height: width,
  },
});

export default HistoriDetailScreen;