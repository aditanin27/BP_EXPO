import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchChildren, deleteChild, resetChildrenState } from '../../redux/slices/childrenSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { IMAGE_BASE_URL } from '../../utils/constants';
import { formatBirthDate, calculateAge } from '../../utils/dateUtils'; // Import dari dateUtils

const ChildrenListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { list, isLoading, error, deleteSuccess } = useAppSelector((state) => state.children);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChildren, setFilteredChildren] = useState([]);

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  useEffect(() => {
    if (list) {
      setFilteredChildren(list);
    }
  }, [list]);

  // Reset delete success state and refresh list after deletion
  useEffect(() => {
    if (deleteSuccess) {
      Alert.alert('Sukses', 'Data anak berhasil dihapus');
      dispatch(resetChildrenState());
    }
  }, [deleteSuccess, dispatch]);

  // Filter children based on search query
  useEffect(() => {
    if (list) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = list.filter(child => 
        child.full_name.toLowerCase().includes(lowercasedQuery) ||
        (child.nick_name && child.nick_name.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredChildren(filtered);
    }
  }, [searchQuery, list]);

  const handleAddChild = () => {
    navigation.navigate('AddChild');
  };

  const handleViewChild = (childId) => {
    navigation.navigate('ChildDetail', { childId });
  };

  const handleEditChild = (childId) => {
    navigation.navigate('EditChild', { childId });
  };

  const handleDeleteChild = (childId, childName) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data anak ${childName}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => dispatch(deleteChild(childId)),
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.childCard}
      onPress={() => handleViewChild(item.id_anak)}
    >
      <View style={styles.cardContent}>
        <Image
          source={{ 
            uri: item.foto 
              ? `${IMAGE_BASE_URL}Anak/${item.id_anak}/${item.foto}`
              : 'https://berbagipendidikan.org/images/default.png'
          }}
          style={styles.childPhoto}
        />
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{item.full_name}</Text>
          {item.nick_name && (
            <Text style={styles.childNickname}>Panggilan: {item.nick_name}</Text>
          )}
          <Text style={styles.childDetail}>
            {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {calculateAge(item.tanggal_lahir)} tahun
          </Text>
          <Text style={styles.childDetail}>
            Lahir: {formatBirthDate(item.tanggal_lahir)}
          </Text>
          <Text style={styles.childStatus}>
            Status: <Text style={getStatusStyle(item.status_validasi)}>{item.status_validasi}</Text>
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditChild(item.id_anak)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteChild(item.id_anak, item.full_name)}
        >
          <Text style={[styles.buttonText, styles.deleteText]}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'aktif':
        return styles.statusActive;
      case 'tidak aktif':
        return styles.statusInactive;
      case 'Ditolak':
        return styles.statusRejected;
      case 'Ditangguhkan':
        return styles.statusSuspended;
      default:
        return styles.statusInactive;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Anak Binaan</Text>
        <Text style={styles.headerSubtitle}>Total: {filteredChildren.length} anak</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama anak..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Coba Lagi" 
            onPress={() => dispatch(fetchChildren())} 
          />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredChildren}
            keyExtractor={(item) => item.id_anak.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery 
                    ? 'Tidak ada anak yang sesuai dengan pencarian' 
                    : 'Belum ada data anak'
                  }
                </Text>
              </View>
            }
          />
          
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={handleAddChild}
            >
              <Text style={styles.floatingButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

// ... styles remains the same ...

export default ChildrenListScreen;

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
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  childCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  childPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  childInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  childNickname: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  childDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  childStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  statusActive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  statusInactive: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  statusRejected: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  statusSuspended: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#e74c3c',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});

