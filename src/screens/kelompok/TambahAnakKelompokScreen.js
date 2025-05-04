import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  TextInput
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchAvailableChildren, 
  addChildToGroup,
  resetKelompokSuccess,
  resetKelompokError
} from '../../redux/slices/kelompokSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const TambahAnakKelompokScreen = ({ route, navigation }) => {
  const { id_kelompok, kelompokName } = route.params;
  const dispatch = useAppDispatch();
  const { 
    availableChildren, 
    isLoadingChildren, 
    isAddingChild, 
    error, 
    addChildSuccess 
  } = useAppSelector((state) => state.kelompok);
  const { adminShelter } = useAppSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChildren, setFilteredChildren] = useState([]);
  
  useEffect(() => {
    if (adminShelter && adminShelter.shelter) {
      dispatch(fetchAvailableChildren(adminShelter.shelter.id_shelter));
    }
    
    return () => {
      dispatch(resetKelompokSuccess());
      dispatch(resetKelompokError());
    };
  }, [dispatch, adminShelter]);
  
  useEffect(() => {
    if (addChildSuccess) {
      Alert.alert('Sukses', 'Anak berhasil ditambahkan ke kelompok');
      dispatch(resetKelompokSuccess());
    }
  }, [addChildSuccess, dispatch]);
  
  // Filter children based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = availableChildren.filter(child => 
        child.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.nick_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChildren(filtered);
    } else {
      setFilteredChildren(availableChildren);
    }
  }, [searchQuery, availableChildren]);
  
  const handleAddChild = (id_anak, childName) => {
    Alert.alert(
      'Konfirmasi',
      `Tambahkan ${childName} ke kelompok ${kelompokName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Tambahkan', 
          onPress: () => dispatch(addChildToGroup({ id_kelompok, id_anak }))
        }
      ]
    );
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const renderChildItem = ({ item }) => (
    <View style={styles.childCard}>
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{item.full_name}</Text>
        <Text style={styles.childDetail}>
          {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {item.agama}
        </Text>
        <Text style={styles.childDetail}>
          {item.tempat_lahir}, {item.tanggal_lahir}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddChild(item.id_anak, item.full_name)}
        disabled={isAddingChild}
      >
        <Text style={styles.addButtonText}>Tambahkan</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (isLoadingChildren) {
    return <LoadingOverlay />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Tambah Anak ke Kelompok {kelompokName}
        </Text>
        <Text style={styles.headerSubtitle}>
          Pilih anak yang akan ditambahkan
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari anak..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={filteredChildren}
        keyExtractor={(item) => item.id_anak.toString()}
        renderItem={renderChildItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Tidak ada anak yang sesuai dengan pencarian' 
                : 'Tidak ada anak yang tersedia untuk ditambahkan'
              }
            </Text>
          </View>
        }
      />
      
      <View style={styles.buttonContainer}>
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
  header: {
    padding: 20,
    backgroundColor: '#2E86DE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for button container
  },
  childCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  childDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: '#2E86DE',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fff8f8',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
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
  },
  backButton: {
    backgroundColor: '#555',
  },
});

export default TambahAnakKelompokScreen;