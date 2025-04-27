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
import { fetchRaports } from '../../../redux/slices/raportSlice';
import RaportCard from '../../../components/RaportCard';
import LoadingOverlay from '../../../components/LoadingOverlay';
import Button from '../../../components/Button';

const RaportScreen = ({ route, navigation }) => {
  const { selectedAnak, raportId } = route.params || {};
  const dispatch = useAppDispatch();
  const { list: raportList, isLoading, error } = useAppSelector((state) => state.raport);

  useEffect(() => {
    if (selectedAnak) {
      dispatch(fetchRaports({ id_anak: selectedAnak.id_anak }));
    }
  }, [dispatch, selectedAnak]);

  useEffect(() => {
    if (raportId && raportList.length > 0) {
      // If a specific raport ID is provided, navigate directly to its detail
      navigation.navigate('RaportDetail', { raportId });
    }
  }, [raportId, raportList, navigation]);

  const handleRaportPress = (raport) => {
    navigation.navigate('RaportDetail', { raportId: raport.id_raport });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Raport</Text>
        {selectedAnak && (
          <Text style={styles.headerSubtitle}>{selectedAnak.full_name}</Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={raportList}
          keyExtractor={(item) => item.id_raport.toString()}
          renderItem={({ item }) => (
            <RaportCard 
              raport={item} 
              onPress={() => handleRaportPress(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Belum ada data raport untuk anak ini
              </Text>
            </View>
          }
        />
      )}

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
});

export default RaportScreen;