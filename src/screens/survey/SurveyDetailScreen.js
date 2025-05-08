import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchSurveyDetail, 
  deleteSurvey, 
  resetSurveyState, 
  clearSurveyDetail 
} from '../../redux/slices/surveySlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const SurveyDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id_keluarga } = route.params || {};
  
  const { 
    detail, 
    isLoadingDetail, 
    isLoading, 
    deleteSuccess, 
    error 
  } = useAppSelector(state => state.survey);
  
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch survey detail on mount
  useEffect(() => {
    if (id_keluarga) {
      dispatch(fetchSurveyDetail(id_keluarga));
    }
    
    // Clear detail on unmount
    return () => {
      dispatch(clearSurveyDetail());
    };
  }, [dispatch, id_keluarga]);
  
  // Handle success deletion
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Survey berhasil dihapus');
      navigation.goBack();
    }
  }, [deleteSuccess, navigation]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      setIsDeleting(false);
      Alert.alert('Error', error);
      dispatch(resetSurveyState());
    }
  }, [error, dispatch]);
  
  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus survey ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            dispatch(deleteSurvey(id_keluarga));
          },
        },
      ]
    );
  };
  
  // Handle edit
  const handleEdit = (tab = 'data-keluarga') => {
    navigation.navigate('SurveyForm', { 
      id_keluarga: id_keluarga,
      keluarga: detail?.keluarga,
      currentTab: tab
    });
  };
  
  // Format display values
  const formatValue = (key, value) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    
    // Format penghasilan
    if (key === 'penghasilan') {
      switch(value) {
        case 'dibawah_500k': return 'di bawah Rp 500.000';
        case '500k_1500k': return 'Rp 500.000 - Rp 1.500.000';
        case '1500k_2500k': return 'Rp 1.500.000 - Rp 2.500.000';
        case '2500k_3500k': return 'Rp 2.500.000 - Rp 3.500.000';
        case '3500k_5000k': return 'Rp 3.500.000 - Rp 5.000.000';
        case '5000k_7000k': return 'Rp 5.000.000 - Rp 7.000.000';
        case '7000k_10000k': return 'Rp 7.000.000 - Rp 10.000.000';
        case 'diatas_10000k': return 'di atas Rp 10.000.000';
        default: return value;
      }
    }
    
    // Format date
    if (key.includes('tanggal') && value) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (e) {
        return value;
      }
    }
    
    return value;
  };
  
  // Get status badge color
  const getStatusBadgeStyle = (status) => {
    if (!status) return styles.defaultBadge;
    
    switch (status) {
      case 'Layak':
        return styles.layakBadge;
      case 'Tidak Layak':
        return styles.tidakLayakBadge;
      case 'Tambah Kelayakan':
        return styles.tambahKelayakanBadge;
      default:
        return styles.defaultBadge;
    }
  };
  
  if (isLoadingDetail) {
    return <LoadingOverlay />;
  }
  
  if (!detail) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Survey</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Data survey tidak ditemukan</Text>
          <Button 
            title="Kembali" 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }
  
  const keluarga = detail.keluarga || {};
  const survey = detail.survey || {};
  
  // Group survey data by categories
  const surveyCategories = [
    {
      id: 'data-keluarga',
      title: 'Data Keluarga',
      fields: [
        { key: 'pendidikan_kepala_keluarga', label: 'Pendidikan Kepala Keluarga' },
        { key: 'jumlah_tanggungan', label: 'Jumlah Tanggungan' },
      ]
    },
    {
      id: 'data-ekonomi',
      title: 'Data Ekonomi',
      fields: [
        { key: 'pekerjaan_kepala_keluarga', label: 'Pekerjaan Kepala Keluarga' },
        { key: 'penghasilan', label: 'Penghasilan' },
        { key: 'kepemilikan_tabungan', label: 'Memiliki Tabungan' },
        { key: 'jumlah_makan', label: 'Makan 3 Kali Sehari' },
      ]
    },
    {
      id: 'data-asset',
      title: 'Data Asset',
      fields: [
        { key: 'kepemilikan_tanah', label: 'Memiliki Tanah' },
        { key: 'kepemilikan_rumah', label: 'Kepemilikan Rumah' },
        { key: 'kondisi_rumah_dinding', label: 'Kondisi Rumah (Dinding)' },
        { key: 'kondisi_rumah_lantai', label: 'Kondisi Rumah (Lantai)' },
        { key: 'kepemilikan_kendaraan', label: 'Kepemilikan Kendaraan' },
        { key: 'kepemilikan_elektronik', label: 'Kepemilikan Elektronik' },
      ]
    },
    {
      id: 'data-kesehatan',
      title: 'Data Kesehatan',
      fields: [
        { key: 'sumber_air_bersih', label: 'Sumber Air Bersih' },
        { key: 'jamban_limbah', label: 'Jamban/Limbah' },
        { key: 'tempat_sampah', label: 'Tempat Sampah' },
        { key: 'perokok', label: 'Perokok' },
        { key: 'konsumen_miras', label: 'Konsumen Minuman Keras' },
        { key: 'persediaan_p3k', label: 'Memiliki Persediaan P3K' },
        { key: 'makan_buah_sayur', label: 'Makan Buah & Sayur' },
      ]
    },
    {
      id: 'data-ibadah',
      title: 'Data Ibadah',
      fields: [
        { key: 'solat_lima_waktu', label: 'Sholat 5 Waktu' },
        { key: 'membaca_alquran', label: 'Membaca Al-Quran' },
        { key: 'majelis_taklim', label: 'Mengikuti Majelis Taklim' },
        { key: 'membaca_koran', label: 'Membaca Koran' },
        { key: 'pengurus_organisasi', label: 'Pengurus Organisasi' },
        { key: 'pengurus_organisasi_sebagai', label: 'Pengurus Sebagai' },
      ]
    },
    {
      id: 'data-lainnya',
      title: 'Data Lainnya',
      fields: [
        { key: 'status_anak', label: 'Status Anak' },
        { key: 'biaya_pendidikan_perbulan', label: 'Biaya Pendidikan Per Bulan' },
        { key: 'bantuan_lembaga_formal_lain', label: 'Mendapat Bantuan Lembaga Formal Lain' },
        { key: 'bantuan_lembaga_formal_lain_sebesar', label: 'Jumlah Bantuan' },
      ]
    },
    {
      id: 'data-survey',
      title: 'Hasil Survey',
      fields: [
        { key: 'kondisi_penerima_manfaat', label: 'Kondisi Penerima Manfaat' },
        { key: 'petugas_survey', label: 'Petugas Survey' },
        { key: 'tanggal_survey', label: 'Tanggal Survey' },
        { key: 'hasil_survey', label: 'Hasil Survey' },
        { key: 'keterangan_hasil', label: 'Keterangan' },
      ]
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Survey</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Keluarga Info */}
        <View style={styles.keluargaInfo}>
          <Text style={styles.keluargaTitle}>{keluarga.kepala_keluarga || '-'}</Text>
          <Text style={styles.keluargaSubtitle}>No. KK: {keluarga.no_kk || '-'}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shelter:</Text>
            <Text style={styles.infoValue}>{keluarga.shelter?.nama_shelter || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wilbin:</Text>
            <Text style={styles.infoValue}>{keluarga.wilbin?.nama_wilbin || '-'}</Text>
          </View>
          
          {survey.hasil_survey && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={[styles.statusBadge, getStatusBadgeStyle(survey.hasil_survey)]}>
                <Text style={styles.statusText}>{survey.hasil_survey}</Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Survey Data */}
        {surveyCategories.map(category => (
          <View key={category.id} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEdit(category.id)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            {category.fields.map(field => {
              // Skip conditional fields that might be empty
              if (field.key === 'pengurus_organisasi_sebagai' && survey.pengurus_organisasi !== 'Ya') {
                return null;
              }
              
              if (field.key === 'bantuan_lembaga_formal_lain_sebesar' && survey.bantuan_lembaga_formal_lain !== 'Ya') {
                return null;
              }
              
              return (
                <View key={field.key} style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{field.label}:</Text>
                  <Text style={styles.fieldValue}>{formatValue(field.key, survey[field.key])}</Text>
                </View>
              );
            })}
          </View>
        ))}
        
        {/* Spacer for button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Action button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Hapus Survey"
          onPress={handleDelete}
          isLoading={isDeleting}
          style={styles.deleteButton}
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
  scrollView: {
    flex: 1,
  },
  keluargaInfo: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keluargaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  keluargaSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  layakBadge: {
    backgroundColor: '#e6f7f0',
  },
  tidakLayakBadge: {
    backgroundColor: '#ffe6e6',
  },
  tambahKelayakanBadge: {
    backgroundColor: '#e6f2ff',
  },
  defaultBadge: {
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  editButton: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#2E86DE',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    width: 180,
    fontSize: 14,
    color: '#666',
  },
  fieldValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
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
  deleteButton: {
    backgroundColor: '#e74c3c',
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
    marginBottom: 20,
  }
});

export default SurveyDetailScreen;