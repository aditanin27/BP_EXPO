import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  validateSurvey, 
  resetSurveyValidasiState
} from '../../redux/slices/surveyValidasiSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const SurveyValidasiFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { survey, id_survey, preselectedResult } = route.params || {};
  const { isValidating, validateSuccess, error } = useAppSelector(state => state.surveyValidasi);
  
  const [validationData, setValidationData] = useState({
    hasil_survey: preselectedResult || '',
    keterangan_hasil: ''
  });
  
  const [surveyDetail, setSurveyDetail] = useState(survey || null);
  
  // Handle success validation
  useEffect(() => {
    if (validateSuccess) {
      Alert.alert('Sukses', 'Validasi survey berhasil disimpan', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      dispatch(resetSurveyValidasiState());
    }
  }, [validateSuccess]);
  
  // Handle error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetSurveyValidasiState());
    }
  }, [error]);
  
  // Update validation result
  const handleSelectResult = (result) => {
    setValidationData({
      ...validationData,
      hasil_survey: result
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate
    if (!validationData.hasil_survey) {
      Alert.alert('Error', 'Silakan pilih hasil validasi (Layak/Tidak Layak)');
      return;
    }
    
    // Get survey ID
    const surveyId = id_survey || surveyDetail?.id_survey;
    
    if (!surveyId) {
      Alert.alert('Error', 'ID Survey tidak ditemukan');
      return;
    }
    
    // Confirm submission
    Alert.alert(
      'Konfirmasi',
      `Apakah Anda yakin ingin menyimpan hasil validasi "${validationData.hasil_survey}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Simpan', 
          onPress: () => {
            dispatch(validateSurvey({
              id_survey: surveyId,
              validationData
            }));
          }
        }
      ]
    );
  };
  
  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Format penghasilan for display
  const formatPenghasilan = (penghasilan) => {
    if (!penghasilan) return '-';
    
    switch(penghasilan) {
      case 'dibawah_500k':
        return 'di bawah Rp 500.000';
      case '500k_1500k':
        return 'Rp 500.000 - Rp 1.500.000';
      case '1500k_2500k':
        return 'Rp 1.500.000 - Rp 2.500.000';
      case '2500k_3500k':
        return 'Rp 2.500.000 - Rp 3.500.000';
      case '3500k_5000k':
        return 'Rp 3.500.000 - Rp 5.000.000';
      case '5000k_7000k':
        return 'Rp 5.000.000 - Rp 7.000.000';
      case '7000k_10000k':
        return 'Rp 7.000.000 - Rp 10.000.000';
      case 'diatas_10000k':
        return 'di atas Rp 10.000.000';
      default:
        return penghasilan;
    }
  };
  
  if (!surveyDetail && !id_survey) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Validasi Survey</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Data survey tidak ditemukan
          </Text>
          <Button 
            title="Kembali" 
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    );
  }
  
  if (isValidating) {
    return <LoadingOverlay />;
  }
  
  const keluarga = surveyDetail?.keluarga || {};
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Validasi Survey</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Survey Info */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informasi Keluarga</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>No. KK:</Text>
              <Text style={styles.infoValue}>{keluarga.no_kk || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kepala Keluarga:</Text>
              <Text style={styles.infoValue}>{keluarga.kepala_keluarga || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Wilbin:</Text>
              <Text style={styles.infoValue}>{keluarga.wilbin?.nama_wilbin || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shelter:</Text>
              <Text style={styles.infoValue}>{keluarga.shelter?.nama_shelter || '-'}</Text>
            </View>
          </View>
          
          {/* Survey Details */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Detail Survey</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pendidikan:</Text>
              <Text style={styles.infoValue}>{surveyDetail?.pendidikan_kepala_keluarga || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pekerjaan:</Text>
              <Text style={styles.infoValue}>{surveyDetail?.pekerjaan_kepala_keluarga || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Penghasilan:</Text>
              <Text style={styles.infoValue}>{formatPenghasilan(surveyDetail?.penghasilan) || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Jumlah Tanggungan:</Text>
              <Text style={styles.infoValue}>{surveyDetail?.jumlah_tanggungan || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status Anak:</Text>
              <Text style={styles.infoValue}>{surveyDetail?.status_anak || '-'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tanggal Survey:</Text>
              <Text style={styles.infoValue}>
                {formatDate(surveyDetail?.tanggal_survey) || 'Belum ada'}
              </Text>
            </View>
            
            {surveyDetail?.petugas_survey && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Petugas:</Text>
                <Text style={styles.infoValue}>{surveyDetail.petugas_survey}</Text>
              </View>
            )}
          </View>
          
          {/* Validation Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Form Validasi</Text>
            
            <Text style={styles.formLabel}>Hasil Validasi</Text>
            <View style={styles.resultButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.resultButton,
                  validationData.hasil_survey === 'Layak' && styles.selectedLayakButton
                ]}
                onPress={() => handleSelectResult('Layak')}
              >
                <Text style={[
                  styles.resultButtonText,
                  validationData.hasil_survey === 'Layak' && styles.selectedResultText
                ]}>
                  Layak
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.resultButton,
                  validationData.hasil_survey === 'Tidak Layak' && styles.selectedTidakLayakButton
                ]}
                onPress={() => handleSelectResult('Tidak Layak')}
              >
                <Text style={[
                  styles.resultButtonText,
                  validationData.hasil_survey === 'Tidak Layak' && styles.selectedResultText
                ]}>
                  Tidak Layak
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.formLabel}>Catatan (opsional)</Text>
            <TextInput
              style={styles.textArea}
              value={validationData.keterangan_hasil}
              onChangeText={(text) => setValidationData({
                ...validationData,
                keterangan_hasil: text
              })}
              placeholder="Masukkan catatan atau alasan dari hasil validasi..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Bottom space for button */}
          <View style={{ height: 80 }} />
        </ScrollView>
        
        {/* Bottom buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Batal"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
          
          <Button
            title="Simpan Validasi"
            onPress={handleSubmit}
            isLoading={isValidating}
            style={styles.submitButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resultButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selectedLayakButton: {
    backgroundColor: '#d4edda',
    borderColor: '#27ae60',
  },
  selectedTidakLayakButton: {
    backgroundColor: '#f8d7da',
    borderColor: '#e74c3c',
  },
  resultButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777',
  },
  selectedResultText: {
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#2E86DE',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default SurveyValidasiFormScreen;