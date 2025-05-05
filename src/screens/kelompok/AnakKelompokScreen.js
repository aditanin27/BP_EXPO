import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchGroupChildren, 
  removeChildFromGroup,
  resetKelompokSuccess,
  resetKelompokError
} from '../../redux/slices/kelompokSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const AnakKelompokScreen = ({ route, navigation }) => {
  const { id_kelompok, kelompokName } = route.params;
  const dispatch = useAppDispatch();
  const { 
    groupChildren, 
    isLoadingChildren, 
    isRemovingChild, 
    error, 
    removeChildSuccess 
  } = useAppSelector((state) => state.kelompok);
  
  useEffect(() => {
    dispatch(fetchGroupChildren(id_kelompok));
    
    return () => {
      dispatch(resetKelompokSuccess());
      dispatch(resetKelompokError());
    };
  }, [dispatch, id_kelompok]);
  
  useEffect(() => {
    if (removeChildSuccess) {
      Alert.alert('Sukses', 'Anak berhasil dihapus dari kelompok');
      dispatch(resetKelompokSuccess());
    }
  }, [removeChildSuccess, dispatch]);
  
  const handleRemoveChild = (id_anak, childName) => {
    Alert.alert(
      'Konfirmasi',
      `Apakah Anda yakin ingin menghapus ${childName} dari kelompok ini?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          onPress: () => dispatch(removeChildFromGroup({ id_kelompok, id_anak })),
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleAddChild = () => {
    navigation.navigate('TambahAnakKelompok', { 
      id_kelompok, 
      kelompokName 
    });
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
        style={styles.removeButton}
        onPress={() => handleRemoveChild(item.id_anak, item.full_name)}
        disabled={isRemovingChild}
      >
        <Text style={styles.removeButtonText}>Hapus</Text>
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
          Anggota Kelompok {kelompokName}
        </Text>
        <Text style={styles.headerSubtitle}>
          Jumlah Anggota: {groupChildren.length}
        </Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={groupChildren}
        keyExtractor={(item) => item.id_anak.toString()}
        renderItem={renderChildItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada anak dalam kelompok ini
            </Text>
          </View>
        }
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="Tambah Anak"
          onPress={handleAddChild}
          style={styles.addButton}
        />
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
  listContainer: {
    padding: 16,
    paddingBottom: 120, // Extra padding for button container
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
  removeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  removeButtonText: {
    color: '#e74c3c',
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
    flexDirection: 'row',
  },
  addButton: {
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#555',
  },
});

export default AnakKelompokScreen;