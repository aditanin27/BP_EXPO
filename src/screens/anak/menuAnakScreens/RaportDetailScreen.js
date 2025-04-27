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
  Modal
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchRaportDetail } from '../../../redux/slices/raportSlice';
import Button from '../../../components/Button';
import LoadingOverlay from '../../../components/LoadingOverlay';

const { width } = Dimensions.get('window');

const RaportDetailScreen = ({ route, navigation }) => {
  const { raportId } = route.params;
  const dispatch = useAppDispatch();
  const { detail: raport, isLoading, error } = useAppSelector((state) => state.raport);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchRaportDetail(raportId));
  }, [dispatch, raportId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    if (raport && !isLoading) {
      navigation.navigate('EditRaport', { raport });
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Kembali" onPress={handleBack} style={styles.backButton} />
      </SafeAreaView>
    );
  }

  if (!raport) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Data raport tidak ditemukan</Text>
        <Button title="Kembali" onPress={handleBack} style={styles.backButton} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Raport</Text>
          <Text style={styles.headerSubtitle}>{raport.anak?.nama_lengkap}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{raport.semester}</Text>
            <Text style={styles.cardDate}>{raport.tanggal}</Text>
          </View>

          <View style={styles.sectionContent}>
            {renderInfoRow('Tingkat', raport.tingkat)}
            {renderInfoRow('Kelas', raport.kelas)}
            {renderInfoRow('Nilai Maksimum', raport.nilai_max)}
            {renderInfoRow('Nilai Minimum', raport.nilai_min)}
            {renderInfoRow('Nilai Rata-rata', raport.nilai_rata_rata)}
          </View>
        </View>

        {raport.foto_rapor && raport.foto_rapor.length > 0 && (
          <View style={styles.photoCard}>
            <Text style={styles.cardTitle}>Foto Raport</Text>
            <View style={styles.photoGrid}>
              {raport.foto_rapor.map((foto) => (
                <TouchableOpacity 
                  key={foto.id_foto} 
                  style={styles.photoContainer}
                  onPress={() => openImageModal(foto.foto_url)}
                >
                  <Image
                    source={{ uri: foto.foto_url }}
                    style={styles.photoThumbnail}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.editButton, 
              (isLoading || error) && styles.editButtonDisabled
            ]} 
            onPress={handleEdit}
            disabled={isLoading || error}
          >
            <Text style={styles.editButtonText}>
              {isLoading ? 'Memuat...' : 'Edit'}
            </Text>
          </TouchableOpacity>
          <Button
            title="Kembali"
            onPress={handleBack}
            style={styles.backButton}
          />
        </View>
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoLabel: {
    width: '40%',
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photoContainer: {
    width: (width - 60) / 2,
    height: (width - 60) / 2,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
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
  },
  editButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonDisabled: {
    backgroundColor: '#A9A9A9', // Disabled gray
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
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

export default RaportDetailScreen;