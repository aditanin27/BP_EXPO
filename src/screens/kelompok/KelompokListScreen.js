import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchKelompok } from '../../redux/slices/kelompokSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const KelompokItem = ({ item, onPress }) => (
  <TouchableOpacity 
    style={styles.itemContainer} 
    onPress={() => onPress(item)}
  >
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{item.nama_kelompok}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemDetailText}>
          Shelter: {item.shelter?.nama_shelter || '-'}
        </Text>
        <Text style={styles.itemDetailText}>
          Anggota: {item.anak_count} / {item.jumlah_anggota}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const KelompokListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, pagination } = useAppSelector((state) => state.kelompok);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchKelompok({ page }));
  }, [dispatch, page]);

  const handleLoadMore = () => {
    if (pagination && page < pagination.last_page) {
      setPage(page + 1);
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('DetailKelompok', { idKelompok: item.id_kelompok });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading && page === 1) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Kelompok</Text>
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <KelompokItem 
            item={item} 
            onPress={handleItemPress} 
          />
        )}
        keyExtractor={(item) => item.id_kelompok.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <LoadingOverlay size="small" /> : null}
      />

      <Button
        title="Kembali"
        onPress={handleBack}
        style={styles.backButton}
      />
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
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 10,
  },
  itemDetails: {
    flexDirection: 'column',
  },
  itemDetailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  backButton: {
    margin: 15,
  },
});

export default KelompokListScreen;