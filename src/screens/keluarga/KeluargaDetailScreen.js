import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchKeluargaDetail, deleteKeluarga, resetKeluargaState } from '../../redux/slices/keluargaSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';
import CardSection from '../../components/CardSection';

const KeluargaDetailScreen = ({ route, navigation }) => {
  const { idKeluarga } = route.params;
  const dispatch = useAppDispatch();
  const { detail, isLoading, error, deleteSuccess } = useAppSelector((state) => state.keluarga);
  
  // Fetch family details
  useEffect(() => {
    if (idKeluarga) {
      dispatch(fetchKeluargaDetail(idKeluarga));
    }
    
    return () => {
      // Reset state when unmounting
      dispatch(resetKeluargaState());
    };
  }, [dispatch, idKeluarga]);
  
  // Handle deletion success
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data keluarga berhasil dihapus');
      navigation.goBack();
    }
  }, [deleteSuccess, navigation]);
  
  // Handler for back button
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Handler for editing family data
  const handleEdit = () => {
    navigation.navigate('EditKeluarga', { idKeluarga });
  };
  
  // Handler for deleting family data with confirmation
  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus data keluarga ini? Semua data terkait termasuk data anak juga akan dihapus.',
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
  
  // Handler for viewing child detail
  const handleViewAnak = (idAnak) => {
    navigation.navigate('DetailAnak', { idAnak });
  };
  
  // Display field with label and value
  const FieldDisplay = ({ label, value, isHighlighted = false }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={[
        styles.fieldValue, 
        isHighlighted && styles.highlightedValue
      ]}>
        {value || '-'}
      </Text>
    </View>
  );
  
  // If loading, show loading overlay
  if (isLoading) {
    return <LoadingOverlay />;
  }
  
  // If error, show error view
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Kembali" 
            onPress={handleBack} 
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // If no data found, show not found view
  if (!detail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Data keluarga tidak ditemukan</Text>
          <Button 
            title="Kembali" 
            onPress={handleBack} 
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // Destructuring data for easier access
  const { keluarga, anak } = detail;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Keluarga</Text>
        </View>
        
        {/* Basic Family Info */}
        <CardSection title="Informasi Keluarga">
          <FieldDisplay label="Kepala Keluarga" value={keluarga.kepala_keluarga} isHighlighted />
          <FieldDisplay label="Nomor KK" value={keluarga.no_kk} />
          <FieldDisplay label="Status Orangtua" value={keluarga.status_ortu} />
          
          <View style={styles.divider} />
          
          <FieldDisplay label="Kantor Cabang" value={keluarga.kacab?.nama_kacab} />
          <FieldDisplay label="Wilayah Binaan" value={keluarga.wilbin?.nama_wilbin} />
          <FieldDisplay label="Shelter" value={keluarga.shelter?.nama_shelter} />
          
          {keluarga.no_tlp && (
            <>
              <View style={styles.divider} />
              <FieldDisplay label="Nomor Telepon" value={keluarga.no_tlp} />
              <FieldDisplay label="Atas Nama" value={keluarga.an_tlp} />
            </>
          )}
          
          {keluarga.no_rek && (
            <>
              <View style={styles.divider} />
              <FieldDisplay label="Bank" value={keluarga.bank?.nama_bank} />
              <FieldDisplay label="Nomor Rekening" value={keluarga.no_rek} />
              <FieldDisplay label="Atas Nama" value={keluarga.an_rek} />
            </>
          )}
        </CardSection>
        
        {/* Parents Information */}
        {keluarga.ayah && (
          <CardSection title="Informasi Ayah">
            <FieldDisplay label="Nama" value={keluarga.ayah.nama_ayah} isHighlighted />
            <FieldDisplay label="NIK" value={keluarga.ayah.nik_ayah} />
            <FieldDisplay label="Tempat Lahir" value={keluarga.ayah.tempat_lahir} />
            <FieldDisplay label="Tanggal Lahir" value={keluarga.ayah.tanggal_lahir} />
            <FieldDisplay label="Agama" value={keluarga.ayah.agama} />
            <FieldDisplay label="Penghasilan" value={keluarga.ayah.penghasilan} />
            <FieldDisplay label="Alamat" value={keluarga.ayah.alamat} />
            
            {keluarga.ayah.tanggal_kematian && (
              <>
                <View style={styles.divider} />
                <FieldDisplay label="Tanggal Kematian" value={keluarga.ayah.tanggal_kematian} />
                <FieldDisplay label="Penyebab Kematian" value={keluarga.ayah.penyebab_kematian} />
              </>
            )}
          </CardSection>
        )}
        
        {keluarga.ibu && (
          <CardSection title="Informasi Ibu">
            <FieldDisplay label="Nama" value={keluarga.ibu.nama_ibu} isHighlighted />
            <FieldDisplay label="NIK" value={keluarga.ibu.nik_ibu} />
            <FieldDisplay label="Tempat Lahir" value={keluarga.ibu.tempat_lahir} />
            <FieldDisplay label="Tanggal Lahir" value={keluarga.ibu.tanggal_lahir} />
            <FieldDisplay label="Agama" value={keluarga.ibu.agama} />
            <FieldDisplay label="Penghasilan" value={keluarga.ibu.penghasilan} />
            <FieldDisplay label="Alamat" value={keluarga.ibu.alamat} />
            
            {keluarga.ibu.tanggal_kematian && (
              <>
                <View style={styles.divider} />
                <FieldDisplay label="Tanggal Kematian" value={keluarga.ibu.tanggal_kematian} />
                <FieldDisplay label="Penyebab Kematian" value={keluarga.ibu.penyebab_kematian} />
              </>
            )}
          </CardSection>
        )}
        
        {keluarga.wali && keluarga.wali.nama_wali && (
          <CardSection title="Informasi Wali">
            <FieldDisplay label="Nama" value={keluarga.wali.nama_wali} isHighlighted />
            <FieldDisplay label="NIK" value={keluarga.wali.nik_wali} />
            <FieldDisplay label="Hubungan" value={keluarga.wali.hub_kerabat} />
            <FieldDisplay label="Tempat Lahir" value={keluarga.wali.tempat_lahir} />
            <FieldDisplay label="Tanggal Lahir" value={keluarga.wali.tanggal_lahir} />
            <FieldDisplay label="Agama" value={keluarga.wali.agama} />
            <FieldDisplay label="Penghasilan" value={keluarga.wali.penghasilan} />
            <FieldDisplay label="Alamat" value={keluarga.wali.alamat} />
          </CardSection>
        )}
        
        {/* Children List */}
        {anak && anak.length > 0 && (
          <CardSection title="Daftar Anak">
            {anak.map((child) => (
              <TouchableOpacity 
                key={child.id_anak} 
                style={styles.childCard}
                onPress={() => handleViewAnak(child.id_anak)}
              >
                <Image 
                  source={{ 
                    uri: child.foto_url || 'https://berbagipendidikan.org/images/default.png'
                  }}
                  style={styles.childPhoto}
                />
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.full_name}</Text>
                  <Text style={styles.childDetail}>
                    {child.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {child.agama}
                  </Text>
                  <Text style={styles.childDetail}>
                    {child.tempat_lahir}, {child.tanggal_lahir}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    child.status_validasi === 'aktif' ? styles.statusActive : styles.statusInactive
                  ]}>
                    <Text style={[
                      styles.statusText,
                      child.status_validasi === 'aktif' ? styles.statusActiveText : styles.statusInactiveText
                    ]}>
                      {child.status_validasi}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </CardSection>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
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
        
        <Button 
          title="Kembali" 
          onPress={handleBack} 
          style={styles.backButton}
        />
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
    padding: 15,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  highlightedValue: {
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  childCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  childPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  childInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  childDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 5,
  },
  statusActive: {
    backgroundColor: '#e6f7f0',
  },
  statusInactive: {
    backgroundColor: '#fff0e6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusActiveText: {
    color: '#2ecc71',
  },
  statusInactiveText: {
    color: '#ff6b00',
  },
  actionContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
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
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default KeluargaDetailScreen;