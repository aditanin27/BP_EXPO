import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAvailableAnak, addAnakToKelompok } from '../../redux/slices/kelompokSlice';
import Button from '../../components/Button';

const AddAnakToKelompok = ({ idKelompok, onClose, onAnakAdded }) => {
  const dispatch = useAppDispatch();
  const { 
    availableAnak, 
    isLoadingAvailableAnak, 
    isAddingAnak, 
    error 
  } = useAppSelector((state) => state.kelompok);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch available anak when component mounts
  useEffect(() => {
    handleSearch();
  }, []);
  
  const handleSearch = () => {
    dispatch(fetchAvailableAnak({ id: idKelompok, search: searchQuery }));
  };
  
  const handleAddAnak = (idAnak) => {
    dispatch(addAnakToKelompok({ idKelompok, idAnak }))
      .then((result) => {
        if (!result.error && onAnakAdded) {
          onAnakAdded();
        }
      });
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.anakItem}
      onPress={() => handleAddAnak(item.id_anak)}
      disabled={isAddingAnak}
    >
      <Image
        source={{ 
          uri: item.foto_url || 'https://berbagipendidikan.org/images/default.png'
        }}
        style={styles.anakPhoto}
      />
      <View style={styles.anakInfo}>
        <Text style={styles.anakName} numberOfLines={1}>
          {item.full_name}
        </Text>
        <Text style={styles.anakDetail}>
          {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
          {item.id_kelompok && ' • Sudah di kelompok lain'}
        </Text>
      </View>
      <View style={styles.addIconContainer}>
        <Text style={styles.addIcon}>+</Text>
      </View>
    </TouchableOpacity>
  );
  
  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'Tidak ada hasil yang sesuai dengan pencarian'
          : 'Tidak ada anak tersedia untuk ditambahkan ke kelompok'
        }
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Anak ke Kelompok</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cari nama anak..."
          onSubmitEditing={handleSearch}
        />
        <Button
          title="Cari"
          onPress={handleSearch}
          style={styles.searchButton}
          isLoading={isLoadingAvailableAnak}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
      
      {isLoadingAvailableAnak ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E86DE" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={availableAnak}
          keyExtractor={(item) => item.id_anak.toString()}
          renderItem={renderItem}
          ListEmptyComponent={EmptyComponent}
          style={styles.anakList}
        />
      )}
      
      <Button
        title="Tutup"
        onPress={onClose}
        style={styles.closeButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E86DE',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    width: 80,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  anakList: {
    flex: 1,
  },
  anakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  anakPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  anakInfo: {
    flex: 1,
  },
  anakName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  anakDetail: {
    fontSize: 14,
    color: '#666',
  },
  addIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#555',
  },
});

export default AddAnakToKelompok;