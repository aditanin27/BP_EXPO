import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchSuratAb } from '../../../redux/slices/suratAbSlice';
import SuratCard from '../../../components/SuratCard';
import LoadingOverlay from '../../../components/LoadingOverlay';
import Button from '../../../components/Button';

const SuratScreen = ({ route, navigation }) => {
  const { selectedAnak } = route.params || {};
  const dispatch = useAppDispatch();
  const { list: suratList, isLoading, error, pagination } = useAppSelector((state) => state.suratAb);

  useEffect(() => {
    if (selectedAnak) {
      dispatch(fetchSuratAb({ 
        id_anak: selectedAnak.id_anak,
        page: 1 
      }));
    }
  }, [dispatch, selectedAnak]);

  const handleSuratPress = (surat) => {
    navigation.navigate('SuratDetail', { suratId: surat.id_surat });
  };

  const handleTambahSurat = () => {
    navigation.navigate('TambahSurat', { selectedAnak });
  };

  const handleLoadMore = () => {
    if (!isLoading && pagination.current_page < pagination.last_page) {
      dispatch(fetchSuratAb({ 
        id_anak: selectedAnak.id_anak,
        page: pagination.current_page + 1 
      }));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading && suratList.length === 0) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Surat</Text>
        {selectedAnak && (
          <Text style={styles.headerSubtitle}>{selectedAnak.full_name}</Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Coba Lagi" 
            onPress={() => dispatch(fetchSuratAb({ 
              id_anak: selectedAnak.id_anak, 
              page: 1 
            }))} 
          />
        </View>
      ) : (
        <FlatList
          data={suratList}
          keyExtractor={(item) => item.id_surat.toString()}
          renderItem={({ item }) => (
            <SuratCard 
              surat={item} 
              onPress={() => handleSuratPress(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading ? <LoadingOverlay size="small" /> : null}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Belum ada data surat untuk anak ini
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleTambahSurat}
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
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
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
});

export default SuratScreen;