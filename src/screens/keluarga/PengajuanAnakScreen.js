import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../redux/hooks';
import { fetchWithAuth } from '../../api/utils';
import Button from '../../components/Button';

const PengajuanAnaKScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [kkNumber, setKkNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to search for KK by number
  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(`/pengajuan-anak/search-keluarga?search=${searchQuery}`);
      setSearchResults(response.data || []);
    } catch (error) {
      setError('Gagal mencari data: ' + (error.message || 'Unknown error'));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Function to validate and proceed with selected KK
  const handleValidateKK = async () => {
    if (!kkNumber.trim()) {
      Alert.alert('Error', 'Silakan masukkan atau pilih Nomor KK');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetchWithAuth('/pengajuan-anak/validate-kk', {
        method: 'POST',
        body: JSON.stringify({ no_kk: kkNumber })
      });
      
      if (response.success) {
        // Navigate to child form with the family data
        navigation.navigate('PengajuanAnakForm', { 
          keluarga: response.keluarga,
          no_kk: kkNumber
        });
      } else {
        Alert.alert('Error', response.message || 'Nomor KK tidak valid');
      }
    } catch (error) {
      if (error.status === 404) {
        Alert.alert(
          'Keluarga Tidak Ditemukan', 
          'Nomor KK tidak ditemukan. Apakah Anda ingin mendaftarkan keluarga baru?',
          [
            {
              text: 'Tidak',
              style: 'cancel'
            },
            {
              text: 'Ya',
              onPress: () => navigation.navigate('TambahKeluarga')
            }
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Terjadi kesalahan');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectKK = (item) => {
    setKkNumber(item.no_kk);
    setSearchQuery(item.no_kk);
  };
  
  const renderKKItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleSelectKK(item)}
    >
      <Text style={styles.kkNumber}>{item.no_kk}</Text>
      <Text style={styles.kkName}>{item.kepala_keluarga}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajukan Anak dengan Nomor KK</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Masukkan Nomor Kartu Keluarga untuk mencari keluarga yang sudah terdaftar
        </Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Masukkan Nomor KK"
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="number-pad"
          />
          <Button 
            title="Cari" 
            onPress={handleSearch}
            style={styles.searchButton}
            isLoading={isSearching}
          />
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        {searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>Hasil Pencarian:</Text>
            <FlatList
              data={searchResults}
              renderItem={renderKKItem}
              keyExtractor={(item) => item.id_keluarga.toString()}
              style={styles.resultsList}
            />
          </>
        ) : (
          searchQuery && !isSearching && !error ? (
            <Text style={styles.noResultsText}>Tidak ada hasil yang ditemukan</Text>
          ) : null
        )}
        
        <View style={styles.divider} />
        
        <Text style={styles.instructionText}>
          Atau masukkan Nomor KK secara langsung:
        </Text>
        
        <TextInput
          style={styles.directInput}
          placeholder="Nomor KK"
          value={kkNumber}
          onChangeText={setKkNumber}
          keyboardType="number-pad"
        />
        
        <Button
          title="Lanjutkan"
          onPress={handleValidateKK}
          isLoading={isLoading}
          style={styles.submitButton}
        />
      </View>
      
      <View style={styles.bottomButtons}>
        <Button
          title="Kembali"
          onPress={() => navigation.goBack()}
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
  header: {
    padding: 20,
    backgroundColor: '#2E86DE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchButton: {
    width: 80,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultsList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2E86DE',
  },
  kkNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  kkName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  directInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    marginBottom: 20,
  },
  bottomButtons: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  backButton: {
    backgroundColor: '#555',
  },
});

export default PengajuanAnaKScreen;