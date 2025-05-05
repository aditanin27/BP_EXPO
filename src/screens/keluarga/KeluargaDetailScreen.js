import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchKeluargaById, 
  deleteKeluarga, 
  resetKeluargaState,
  initFormDataFromKeluarga
} from '../../redux/slices/keluargaSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import CardSection from '../../components/CardSection';

const KeluargaDetailScreen = ({ route, navigation }) => {
  const { idKeluarga } = route.params;
  const dispatch = useAppDispatch();
  const { selectedKeluarga, isLoadingDetails, error, deleteSuccess } = useAppSelector(
    (state) => state.keluarga
  );

  useEffect(() => {
    dispatch(fetchKeluargaById(idKeluarga));
  }, [dispatch, idKeluarga]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data keluarga berhasil dihapus');
      dispatch(resetKeluargaState());
      navigation.goBack();
    }
  }, [deleteSuccess, dispatch, navigation]);

  const handleEdit = () => {
    // Initialize form data for editing
    if (selectedKeluarga) {
      dispatch(initFormDataFromKeluarga(selectedKeluarga));
      navigation.navigate('EditKeluarga', { idKeluarga });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data keluarga ${selectedKeluarga?.keluarga?.kepala_keluarga}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => dispatch(deleteKeluarga(idKeluarga)),
          style: 'destructive',
        },
      ]
    );
  };

  const handleAddAnak = () => {
    navigation.navigate('PengajuanAnak', { noKK: selectedKeluarga?.keluarga?.no_kk });
  };

  const handleViewAnak = (idAnak) => {
    navigation.navigate('DetailAnak', { idAnak });
  };

  if (isLoadingDetails) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => dispatch(fetchKeluargaById(idKeluarga))}
        >
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedKeluarga) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Data keluarga tidak ditemukan</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { keluarga, anak = [] } = selectedKeluarga;

  const renderAnakList = () => {
    if (anak.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada data anak dalam keluarga ini</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddAnak}
          >
            <Text style={styles.addButtonText}>Tambah Anggota</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        {anak.map((anakItem) => (
          <TouchableOpacity 
            key={anakItem.id_anak} 
            style={styles.anakItem}
            onPress={() => handleViewAnak(anakItem.id_anak)}
          >
            <View style={styles.anakInfo}>
              <Text style={styles.anakName}>{anakItem.full_name}</Text>
              {anakItem.nick_name && (
                <Text style={styles.anakNickname}>"{anakItem.nick_name}"</Text>
              )}
              <Text style={styles.anakDetail}>
                {anakItem.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {getAgeText(anakItem.tanggal_lahir)}
              </Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(anakItem.status_validasi) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(anakItem.status_validasi) }]}>
                  {getStatusText(anakItem.status_validasi)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.addMoreButton}
          onPress={handleAddAnak}
        >
          <Text style={styles.addMoreButtonText}>+ Tambah Anggota Lain</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Helper functions for anak list
  const getAgeText = (dob) => {
    if (!dob) return "Umur tidak diketahui";
    
    try {
      const [day, month, year] = dob.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return `${age} tahun`;
    } catch (error) {
      return "Umur tidak diketahui";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return '#27ae60';
      case 'tidak aktif':
      case 'non-aktif':
        return '#f39c12';
      case 'ditolak':
        return '#e74c3c';
      case 'ditangguhkan':
        return '#7f8c8d';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return 'Aktif';
      case 'tidak aktif':
      case 'non-aktif':
        return 'Tidak Aktif';
      case 'ditolak':
        return 'Ditolak';
      case 'ditangguhkan':
        return 'Ditangguhkan';
      default:
        return status || 'Tidak Diketahui';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with main info */}
        <View style={styles.header}>
          <Text style={styles.keluargaName}>{keluarga.kepala_keluarga}</Text>
          <Text style={styles.kkNumber}>No. KK: {keluarga.no_kk}</Text>
          <Text style={styles.statusText}>Status: {keluarga.status_ortu}</Text>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.headerButton, styles.editButton]} 
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Location info */}
        <CardSection title="Informasi Lokasi" titleColor="#2E86DE">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shelter:</Text>
            <Text style={styles.infoValue}>{keluarga.shelter?.nama_shelter || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wilayah Binaan:</Text>
            <Text style={styles.infoValue}>{keluarga.wilbin?.nama_wilbin || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kantor Cabang:</Text>
            <Text style={styles.infoValue}>{keluarga.kacab?.nama_kacab || '-'}</Text>
          </View>
        </CardSection>
        
        {/* Contact info */}
        <CardSection title="Informasi Kontak" titleColor="#2E86DE">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telepon:</Text>
            <Text style={styles.infoValue}>{keluarga.no_tlp || '-'}</Text>
          </View>
          {keluarga.no_tlp && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Atas Nama:</Text>
              <Text style={styles.infoValue}>{keluarga.an_tlp || '-'}</Text>
            </View>
          )}
        </CardSection>
        
        {/* Bank info */}
        <CardSection title="Informasi Bank" titleColor="#2E86DE">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bank:</Text>
            <Text style={styles.infoValue}>{keluarga.bank?.nama_bank || '-'}</Text>
          </View>
          {keluarga.bank && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>No. Rekening:</Text>
                <Text style={styles.infoValue}>{keluarga.no_rek || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Atas Nama:</Text>
                <Text style={styles.infoValue}>{keluarga.an_rek || '-'}</Text>
              </View>
            </>
          )}
        </CardSection>
        
        {/* Ayah info */}
        <CardSection title="Data Ayah" titleColor="#2E86DE" collapsible initiallyCollapsed>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIK:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.nik_ayah || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.nama_ayah || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Agama:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.agama || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tempat Lahir:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.tempat_lahir || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Lahir:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.tanggal_lahir || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alamat:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.alamat || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Penghasilan:</Text>
            <Text style={styles.infoValue}>{keluarga.ayah?.penghasilan || '-'}</Text>
          </View>
          {keluarga.ayah?.tanggal_kematian && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tanggal Kematian:</Text>
                <Text style={styles.infoValue}>{keluarga.ayah.tanggal_kematian}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Penyebab Kematian:</Text>
                <Text style={styles.infoValue}>{keluarga.ayah.penyebab_kematian || '-'}</Text>
              </View>
            </>
          )}
        </CardSection>
        
        {/* Ibu info */}
        <CardSection title="Data Ibu" titleColor="#2E86DE" collapsible initiallyCollapsed>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIK:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.nik_ibu || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.nama_ibu || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Agama:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.agama || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tempat Lahir:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.tempat_lahir || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Lahir:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.tanggal_lahir || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alamat:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.alamat || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Penghasilan:</Text>
            <Text style={styles.infoValue}>{keluarga.ibu?.penghasilan || '-'}</Text>
          </View>
          {keluarga.ibu?.tanggal_kematian && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tanggal Kematian:</Text>
                <Text style={styles.infoValue}>{keluarga.ibu.tanggal_kematian}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Penyebab Kematian:</Text>
                <Text style={styles.infoValue}>{keluarga.ibu.penyebab_kematian || '-'}</Text>
              </View>
            </>
          )}
        </CardSection>
        
        {/* Wali info */}
        <CardSection title="Data Wali" titleColor="#2E86DE" collapsible initiallyCollapsed>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIK:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.nik_wali || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.nama_wali || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hubungan:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.hub_kerabat || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Agama:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.agama || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tempat Lahir:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.tempat_lahir || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Lahir:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.tanggal_lahir || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alamat:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.alamat || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Penghasilan:</Text>
            <Text style={styles.infoValue}>{keluarga.wali?.penghasilan || '-'}</Text>
          </View>
        </CardSection>
        
        {/* Anggota Keluarga - simplified without nesting FlatList */}
        <CardSection title="Anggota Keluarga" titleColor="#2E86DE">
          {renderAnakList()}
        </CardSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  keluargaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  kkNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E86DE',
    marginBottom: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#2E86DE',
  },
  deleteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: '40%',
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Anak list styles
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  anakItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  anakInfo: {
    flex: 1,
  },
  anakName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  anakNickname: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  anakDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addMoreButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  addMoreButtonText: {
    color: '#2E86DE',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default KeluargaDetailScreen;
