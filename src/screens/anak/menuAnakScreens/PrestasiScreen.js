import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchPrestasi } from '../../../redux/slices/prestasiSlice';
import LoadingOverlay from '../../../components/LoadingOverlay';
import Button from '../../../components/Button';

const PrestasiCard = ({ prestasi, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    {prestasi.foto_url && (
      <Image 
        source={{ uri: prestasi.foto_url }} 
        style={styles.cardImage} 
        resizeMode="cover"
      />
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {prestasi.nama_prestasi}
      </Text>
      <View style={styles.cardDetails}>
        <Text style={styles.cardSubtitle}>
          {prestasi.jenis_prestasi} | {prestasi.level_prestasi}
        </Text>
        <Text style={styles.cardDate}>{prestasi.tgl_upload}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const PrestasiScreen = ({ route, navigation }) => {
  const { selectedAnak } = route.params;
  const dispatch = useAppDispatch();
  const { list, isLoading, error, pagination } = useAppSelector((state) => state.prestasi);

  useEffect(() => {
    if (selectedAnak) {
      dispatch(fetchPrestasi({ 
        id_anak: selectedAnak.id_anak,
        page: 1 
      }));
    }
  }, [dispatch, selectedAnak]);

  const handlePrestasiPress = (prestasi) => {
    navigation.navigate('PrestasiDetail', { prestasiId: prestasi.id_prestasi });
  };

  const handleTambahPrestasi = () => {
    navigation.navigate('TambahPrestasi', { selectedAnak });
  };

  const handleLoadMore = () => {
    if (!isLoading && pagination.current_page < pagination.last_page) {
      dispatch(fetchPrestasi({ 
        id_anak: selectedAnak.id_anak,
        page: pagination.current_page + 1 
      }));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading && list.length === 0) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prestasi</Text>
        {selectedAnak && (
          <Text style={styles.headerSubtitle}>{selectedAnak.full_name}</Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Coba Lagi" 
            onPress={() => dispatch(fetchPrestasi({ 
              id_anak: selectedAnak.id_anak, 
              page: 1 
            }))} 
          />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id_prestasi.toString()}
          renderItem={({ item }) => (
            <PrestasiCard 
              prestasi={item} 
              onPress={() => handlePrestasiPress(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading ? <LoadingOverlay size="small" /> : null}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Belum ada data prestasi untuk anak ini
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleTambahPrestasi}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </View>

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
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
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
    bottom: 80,
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default PrestasiScreen;