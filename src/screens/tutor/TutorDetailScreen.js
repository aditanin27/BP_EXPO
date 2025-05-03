import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchTutorById, 
  resetTutorState, 
  clearSelectedTutor 
} from '../../redux/slices/tutorSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const TutorDetailScreen = ({ route, navigation }) => {
  const { tutorId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedTutor, isLoading, error } = useAppSelector(state => state.tutor);
  
  useEffect(() => {
    dispatch(fetchTutorById(tutorId));
    
    return () => {
      dispatch(resetTutorState());
      dispatch(clearSelectedTutor());
    };
  }, [dispatch, tutorId]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleCallTutor = () => {
    if (!selectedTutor || !selectedTutor.no_hp) return;
    
    const phoneNumber = selectedTutor.no_hp.replace(/\s/g, '');
    
    Linking.canOpenURL(`tel:${phoneNumber}`)
      .then(supported => {
        if (supported) {
          Linking.openURL(`tel:${phoneNumber}`);
        } else {
          Alert.alert(
            'Tidak Support',
            'Perangkat Anda tidak mendukung untuk melakukan panggilan telepon'
          );
        }
      })
      .catch(error => {
        console.error('Error saat mencoba menghubungi:', error);
      });
  };
  
  const handleEmailTutor = () => {
    if (!selectedTutor || !selectedTutor.email) return;
    
    Linking.canOpenURL(`mailto:${selectedTutor.email}`)
      .then(supported => {
        if (supported) {
          Linking.openURL(`mailto:${selectedTutor.email}`);
        } else {
          Alert.alert(
            'Tidak Support',
            'Perangkat Anda tidak mendukung untuk mengirim email'
          );
        }
      })
      .catch(error => {
        console.error('Error saat mencoba mengirim email:', error);
      });
  };
  
  if (isLoading) {
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
  
  if (!selectedTutor) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Data tutor tidak ditemukan</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ 
              uri: selectedTutor.foto_url || 'https://berbagipendidikan.org/images/default.png' 
            }} 
            style={styles.tutorPhoto}
          />
          <Text style={styles.tutorName}>{selectedTutor.nama}</Text>
          <Text style={styles.tutorMaple}>{selectedTutor.maple || 'Tidak ada mata pelajaran'}</Text>
          <Text style={styles.tutorPendidikan}>{selectedTutor.pendidikan || '-'}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Kontak</Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleEmailTutor}
            disabled={!selectedTutor.email}
          >
            <Text style={styles.contactLabel}>Email:</Text>
            <Text 
              style={[
                styles.contactValue, 
                selectedTutor.email ? styles.contactLink : styles.contactDisabled
              ]}
            >
              {selectedTutor.email || 'Tidak ada email'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleCallTutor}
            disabled={!selectedTutor.no_hp}
          >
            <Text style={styles.contactLabel}>No. HP:</Text>
            <Text 
              style={[
                styles.contactValue, 
                selectedTutor.no_hp ? styles.contactLink : styles.contactDisabled
              ]}
            >
              {selectedTutor.no_hp || 'Tidak ada nomor telepon'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Shelter</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Shelter:</Text>
            <Text style={styles.infoValue}>
              {selectedTutor.shelter?.nama_shelter || '-'}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Wilayah Binaan:</Text>
            <Text style={styles.infoValue}>
              {selectedTutor.wilbin?.nama_wilbin || '-'}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kantor Cabang:</Text>
            <Text style={styles.infoValue}>
              {selectedTutor.kacab?.nama_kacab || '-'}
            </Text>
          </View>
        </View>
        
        <Button
          title="Kembali ke Daftar"
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
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  tutorPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
    marginBottom: 15,
  },
  tutorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  tutorMaple: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  tutorPendidikan: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactLabel: {
    width: 80,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  contactValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  contactLink: {
    color: '#2E86DE',
    textDecorationLine: 'underline',
  },
  contactDisabled: {
    color: '#999',
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    width: 120,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#555',
    marginTop: 15,
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

export default TutorDetailScreen;