import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useAppDispatch } from '../../redux/hooks';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { fetchWithAuth } from '../../api/utils';

const PengajuanAnakScreen = ({ navigation, route }) => {
  const [noKK, setNoKK] = useState(route.params?.noKK || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Validate KK number
  const validateKK = async () => {
    if (!noKK) {
      setError('Nomor KK wajib diisi');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetchWithAuth('/pengajuan-anak/validate-kk', {
        method: 'POST',
        body: JSON.stringify({ no_kk: noKK }),
      });
      
      if (response.success) {
        // Proceed to next screen with keluarga data
        navigation.navigate('PengajuanAnakForm', { 
          keluarga: response.keluarga,
          noKK: noKK
        });
      } else {
        setError(response.message || 'Nomor KK tidak ditemukan');
      }
    } catch (error) {
      console.error('Error validating KK:', error);
      setError('Terjadi kesalahan saat memvalidasi KK');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengajuan Anak</Text>
        <Text style={styles.headerSubtitle}>
          Masukkan Nomor KK untuk menambahkan anggota keluarga
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Fitur ini digunakan untuk mendaftarkan anak baru ke keluarga yang sudah terdaftar. 
            Pastikan keluarga sudah terdaftar sebelum menggunakan fitur ini.
          </Text>
        </View>
        
        <Input
          label="Nomor Kartu Keluarga"
          value={noKK}
          onChangeText={setNoKK}
          placeholder="Masukkan Nomor KK"
          error={error}
          keyboardType="numeric"
        />
        
        <Button
          title="Cari Keluarga"
          onPress={validateKK}
          isLoading={isLoading}
          style={styles.searchButton}
        />
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E86DE',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86DE',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  searchButton: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#555',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PengajuanAnakScreen;