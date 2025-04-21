import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  SafeAreaView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchChildById, deleteChild, resetChildrenState } from '../../redux/slices/childrenSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { IMAGE_BASE_URL } from '../../utils/constants';
import { formatBirthDate, calculateAge } from '../../utils/dateUtils'; // Import dari dateUtils

const ChildDetailScreen = ({ route, navigation }) => {
  const { childId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedChild, isLoading, error, deleteSuccess } = useAppSelector((state) => state.children);

  useEffect(() => {
    dispatch(fetchChildById(childId));
  }, [dispatch, childId]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data anak berhasil dihapus');
      dispatch(resetChildrenState());
      navigation.goBack();
    }
  }, [deleteSuccess, dispatch, navigation]);

  const handleEdit = () => {
    navigation.navigate('EditChild', { childId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data anak ${selectedChild?.full_name}?`,
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

  const handleBack = () => {
    navigation.goBack();
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

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Coba Lagi" 
          onPress={() => dispatch(fetchChildById(childId))} 
        />
        <Button 
          title="Kembali" 
          onPress={handleBack}
          style={styles.backButton}
        />
      </View>
    );
  }

  if (!selectedChild) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data anak tidak ditemukan</Text>
        <Button 
          title="Kembali" 
          onPress={handleBack}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Anak</Text>
        </View>

        <View style={styles.photoSection}>
          <Image
            source={{ 
              uri: selectedChild.foto 
                ? `${IMAGE_BASE_URL}Anak/${selectedChild.id_anak}/${selectedChild.foto}`
                : 'https://berbagipendidikan.org/images/default.png'
            }}
            style={styles.childPhoto}
          />
          <Text style={styles.childName}>{selectedChild.full_name}</Text>
          {selectedChild.nick_name && (
            <Text style={styles.childNickname}>"{selectedChild.nick_name}"</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informasi Pribadi</Text>
          
          <InfoRow 
            label="Status" 
            value={selectedChild.status_validasi} 
            valueStyle={getStatusStyle(selectedChild.status_validasi)} 
          />
          <InfoRow label="NIK" value={selectedChild.nik_anak || '-'} />
          <InfoRow 
            label="Jenis Kelamin" 
            value={selectedChild.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} 
          />
          <InfoRow 
            label="Tempat, Tgl Lahir" 
            value={`${selectedChild.tempat_lahir}, ${formatBirthDate(selectedChild.tanggal_lahir)}`} 
          />
          <InfoRow label="Usia" value={`${calculateAge(selectedChild.tanggal_lahir)} tahun`} />
          <InfoRow label="Agama" value={selectedChild.agama} />
          <InfoRow label="Anak ke" value={`${selectedChild.anak_ke || '-'} dari ${selectedChild.dari_bersaudara || '-'} bersaudara`} />
          <InfoRow label="Tinggal bersama" value={selectedChild.tinggal_bersama || '-'} />
        </View>

        {selectedChild.shelter && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Informasi Shelter</Text>
            <InfoRow label="Shelter" value={selectedChild.shelter.nama_shelter || '-'} />
            <InfoRow label="Koordinator" value={selectedChild.shelter.nama_koordinator || '-'} />
          </View>
        )}

        {selectedChild.anakPendidikan && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Informasi Pendidikan</Text>
            <InfoRow label="Status" value={selectedChild.anakPendidikan.jenjang || '-'} />
            <InfoRow label="Sekolah" value={selectedChild.anakPendidikan.nama_sekolah || '-'} />
            <InfoRow label="Kelas" value={selectedChild.anakPendidikan.kelas || '-'} />
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informasi Tambahan</Text>
          <InfoRow label="Hobi" value={selectedChild.hobi || '-'} />
          <InfoRow label="Pelajaran Favorit" value={selectedChild.pelajaran_favorit || '-'} />
          <InfoRow label="Prestasi" value={selectedChild.prestasi || '-'} />
          <InfoRow label="Hafalan" value={selectedChild.hafalan || '-'} />
          <InfoRow label="Jarak ke Shelter" value={selectedChild.jarak_rumah ? `${selectedChild.jarak_rumah} km` : '-'} />
          <InfoRow label="Transportasi" value={selectedChild.transportasi || '-'} />
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Edit Data"
            onPress={handleEdit}
            style={styles.editButton}
          />
          
          <Button
            title="Hapus Data"
            onPress={handleDelete}
            style={styles.deleteButton}
            textStyle={styles.deleteText}
          />
          
          <Button
            title="Kembali"
            onPress={handleBack}
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, valueStyle }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
  </View>
);

// ... styles remains the same ...

export default ChildDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 0,
  },
  header: {
    padding: 20,
    backgroundColor: '#2E86DE',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  photoSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 15,
  },
  childPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#2E86DE',
  },
  childName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  childNickname: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
    padding: 15,
  },
  editButton: {
    backgroundColor: '#2E86DE',
  },
  deleteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  deleteText: {
    color: '#e74c3c',
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
});

