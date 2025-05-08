import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchSurveyDetail, 
  createSurvey, 
  resetSurveyState 
} from '../../redux/slices/surveySlice';
import SurveyForm from '../../components/SurveyForm';
import LoadingOverlay from '../../components/LoadingOverlay';

const SurveyFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  
  const { id_keluarga, keluarga, currentTab } = route.params || {};
  
  const { 
    detail, 
    isLoading, 
    isLoadingDetail, 
    createSuccess, 
    error 
  } = useAppSelector(state => state.survey);
  
  const [initialValues, setInitialValues] = useState({});
  const [isSurveyExists, setIsSurveyExists] = useState(false);
  
  // Fetch survey detail if id_keluarga is provided
  useEffect(() => {
    if (id_keluarga) {
      dispatch(fetchSurveyDetail(id_keluarga));
    }
    
    // Reset survey state when component unmounts
    return () => {
      dispatch(resetSurveyState());
    };
  }, [dispatch, id_keluarga]);
  
  // Set initialValues when detail is fetched
  useEffect(() => {
    if (detail) {
      const surveyData = detail.survey;
      if (surveyData) {
        setInitialValues(surveyData);
        setIsSurveyExists(true);
      } else {
        setIsSurveyExists(false);
      }
    }
  }, [detail]);
  
  // Handle success or error
  useEffect(() => {
    if (createSuccess) {
      Alert.alert('Sukses', 'Survey berhasil disimpan', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
    
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetSurveyState());
    }
  }, [createSuccess, error, navigation, dispatch]);
  
  // Handle form submission
  const handleSubmit = (formData) => {
    dispatch(createSurvey({ id_keluarga, surveyData: formData }));
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };
  
  // Show loading indicator while fetching data
  if (isLoadingDetail) {
    return <LoadingOverlay />;
  }
  
  // Get keluarga data from detail or route params
  const keluargaData = detail?.keluarga || keluarga || {};
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isSurveyExists ? 'Edit Survey' : 'Buat Survey'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.keluargaInfoCard}>
        <Text style={styles.keluargaTitle}>Informasi Keluarga</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>No. KK:</Text>
          <Text style={styles.infoValue}>{keluargaData.no_kk || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kepala Keluarga:</Text>
          <Text style={styles.infoValue}>{keluargaData.kepala_keluarga || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shelter:</Text>
          <Text style={styles.infoValue}>{keluargaData.shelter?.nama_shelter || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wilbin:</Text>
          <Text style={styles.infoValue}>{keluargaData.wilbin?.nama_wilbin || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <SurveyForm 
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isLoading}
          currentTab={currentTab || 'data-keluarga'}
          isSurveyExists={isSurveyExists}
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
  keluargaInfoCard: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keluargaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 12,
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
  formContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
});

export default SurveyFormScreen;