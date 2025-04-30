import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  BackHandler,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  resetFormData, 
  resetKeluargaState, 
  goToStep,
  createKeluarga
} from '../../../redux/slices/keluargaSlice';
import LoadingOverlay from '../../../components/LoadingOverlay';
import StepIndicator from '../../../components/StepIndicator';

// Import all step screens
import KeluargaStepSatuScreen from './KeluargaStepSatuScreen';
import KeluargaStepDuaScreen from './KeluargaStepDuaScreen';
import KeluargaStepTigaScreen from './KeluargaStepTigaScreen';
import KeluargaStepEmpatScreen from './KeluargaStepEmpatScreen';
import KeluargaStepLimaScreen from './KeluargaStepLimaScreen';
import KeluargaReviewStepScreen from './KeluargaReviewStepScreen';

const TambahKeluargaScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    isLoading, 
    error, 
    createSuccess 
  } = useAppSelector((state) => state.keluarga);

  // Effect to reset form when component mounts
  useEffect(() => {
    dispatch(resetFormData());
    dispatch(resetKeluargaState());
    
    // Handle hardware back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    
    return () => {
      backHandler.remove();
      dispatch(resetFormData());
    };
  }, [dispatch]);
  
  // Effect to handle success and navigate back
  useEffect(() => {
    if (createSuccess) {
      Alert.alert(
        'Sukses',
        'Data keluarga berhasil disimpan',
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(resetKeluargaState());
              navigation.navigate('KeluargaList');
            }
          }
        ]
      );
    }
  }, [createSuccess, dispatch, navigation]);
  
  // Effect to show error message
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(resetKeluargaState());
    }
  }, [error, dispatch]);
  
  // Handle hardware back button press
  const handleBackPress = () => {
    if (currentStep === 1) {
      // Show confirmation dialog for leaving the form
      Alert.alert(
        'Konfirmasi',
        'Anda yakin ingin keluar? Data yang telah dimasukkan akan hilang.',
        [
          { text: 'Tetap Di Halaman', style: 'cancel' },
          { 
            text: 'Keluar', 
            style: 'destructive',
            onPress: () => {
              dispatch(resetFormData());
              navigation.goBack();
            }
          }
        ]
      );
      return true; // Prevent default behavior
    } else {
      // Go to previous step
      dispatch(goToStep(currentStep - 1));
      return true; // Prevent default behavior
    }
  };
  
  // Function to submit the form (called from the last step)
  const handleSubmitForm = () => {
    // Combine all form sections into one object
    const submitData = {
      // Keluarga data
      ...formData.keluarga,
      // Include other sections
      ...formData.anakPendidikan,
      ...formData.anak,
      ...formData.ayah,
      ...formData.ibu,
      ...formData.wali,
    };
    
    dispatch(createKeluarga(submitData));
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <KeluargaStepSatuScreen />;
      case 2:
        return <KeluargaStepDuaScreen />;
      case 3:
        return <KeluargaStepTigaScreen />;
      case 4:
        return <KeluargaStepEmpatScreen />;
      case 5:
        return <KeluargaStepLimaScreen />;
      case 6:
        return (
          <KeluargaReviewStepScreen 
            onSubmit={handleSubmitForm} 
          />
        );
      default:
        return <KeluargaStepSatuScreen />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
      
      <View style={styles.content}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default TambahKeluargaScreen;