import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  Linking
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchTutorById, 
  deleteTutor, 
  resetTutorState 
} from '../../redux/slices/tutorSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const TutorDetailScreen = ({ route, navigation }) => {
  const { idTutor } = route.params;
  const dispatch = useAppDispatch();
  const { selectedTutor, isLoading, error, deleteSuccess } = useAppSelector((state) => state.tutor);

  useEffect(() => {
    dispatch(fetchTutorById(idTutor));
    
    return () => {
      dispatch(resetTutorState());
    };
  }, [dispatch, idTutor]);

  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Tutor berhasil dihapus');
      navigation.goBack();
    }
  }, [deleteSuccess, navigation]);

  const handleCallPhone = () => {
    if (selectedTutor?.no_hp) {
      Linking.openURL(`tel:${selectedTutor.no_hp}`);
    }
  };

  const handleSendEmail = () => {
    if (selectedTutor?.email) {
      Linking.openURL(`mailto:${selectedTutor.email}`);
    }
  };

  const handleEditTutor = () => {
    navigation.navigate('FormTutor', { id_tutor: idTutor });
  };

  const handleDeleteTutor = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus tutor "${selectedTutor.nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          onPress: () => dispatch(deleteTutor(idTutor)),
          style: 'destructive'
        }
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
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
          <Text style={styles.headerTitle}>Detail Tutor</Text>
        </View>

        <View style={styles.profileSection}>
          <Image 
            source={{ 
              uri: selectedTutor.foto_url || 'https://berbagipendidikan.org/images/default.png' 
            }}
            style={styles.profileImage}
          />
          <Text style={styles.tutorName}>{selectedTutor.nama}</Text>
          <Text style={styles.tutorMaple}>{selectedTutor.maple}</Text>
          
          <View style={styles.contactButtons}>
            {selectedTutor.no_hp && (
              <TouchableOpacity 
                style={[styles.contactButton, styles.phoneButton]}
                onPress={handleCallPhone}
              >
                <Text style={styles.contactButtonText}>Hubungi</Text>
              </TouchableOpacity>
            )}
            
            {selectedTutor.email && (
              <TouchableOpacity 
                style={[styles.contactButton, styles.emailButton]}
                onPress={handleSendEmail}
              >
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Tutor</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pendidikan</Text>
            <Text style={styles.infoValue}>{selectedTutor.pendidikan || '-'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{selectedTutor.email || '-'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>No. Handphone</Text>
            <Text style={styles.infoValue}>{selectedTutor.no_hp || '-'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Alamat</Text>
            <Text style={styles.infoValue}>{selectedTutor.alamat || '-'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Penempatan</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Shelter</Text>
            <Text style={styles.infoValue}>{selectedTutor.shelter?.nama_shelter || '-'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Wilayah Binaan</Text>
            <Text style={styles.infoValue}>{selectedTutor.wilbin?.nama_wilbin || '-'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kantor Cabang</Text>
            <Text style={styles.infoValue}>{selectedTutor.kacab?.nama_kacab || '-'}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Edit Tutor"
            onPress={handleEditTutor}
            style={styles.editButton}
          />
          
          <Button
            title="Hapus Tutor"
            onPress={handleDeleteTutor}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>
      </ScrollView>
      
      <View style={styles.bottomButtonContainer}>
        <Button
          title="Kembali"
          onPress={handleBack}
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 80,
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
  profileSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
    marginBottom: 15,
  },
  tutorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tutorMaple: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  contactButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  phoneButton: {
    backgroundColor: '#2E86DE',
  },
  emailButton: {
    backgroundColor: '#4CAF50',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    width: '35%',
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    padding: 15,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  deleteButtonText: {
    color: '#e74c3c',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  backButton: {
    backgroundColor: '#666',
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