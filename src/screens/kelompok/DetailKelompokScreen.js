import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchKelompokDetail } from '../../redux/slices/kelompokSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';

const AnakItem = ({ anak, onPress }) => (
  <TouchableOpacity style={styles.anakItem} onPress={onPress}>
    <Image
      source={{ 
        uri: anak.foto_url || 'https://berbagipendidikan.org/images/default.png'
      }}
      style={styles.anakPhoto}
    />
    <View style={styles.anakInfo}>
      <Text style={styles.anakName} numberOfLines={2}>
        {anak.full_name}
      </Text>
    </View>
  </TouchableOpacity>
);

const DetailKelompokScreen = ({ route, navigation }) => {
  const { idKelompok } = route.params;
  const dispatch = useAppDispatch();
  const { detail: kelompok, isLoading, error } = useAppSelector((state) => state.kelompok);

  useEffect(() => {
    dispatch(fetchKelompokDetail(idKelompok));
  }, [dispatch, idKelompok]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditKelompok = () => {
    if (kelompok && !isLoading) {
      navigation.navigate('EditKelompok', { kelompok });
    }
  };

  const handleAnakPress = (anak) => {
    navigation.navigate('DetailAnak', { idAnak: anak.id_anak });
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Kembali" 
          onPress={handleBack} 
          style={styles.backButton} 
        />
      </SafeAreaView>
    );
  }

  if (!kelompok) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Data kelompok tidak ditemukan</Text>
        <Button 
          title="Kembali" 
          onPress={handleBack} 
          style={styles.backButton} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Kelompok</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>{kelompok.nama_kelompok}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shelter:</Text>
            <Text style={styles.infoValue}>
              {kelompok.shelter?.nama_shelter || '-'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level Anak Binaan:</Text>
            <Text style={styles.infoValue}>
              {kelompok.level_anak_binaan?.nama_level || '-'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jumlah Anggota:</Text>
            <Text style={styles.infoValue}>
              {kelompok.anak_count} / {kelompok.jumlah_anggota}
            </Text>
          </View>
        </View>

        {kelompok.anak && kelompok.anak.length > 0 && (
          <View style={styles.anakSection}>
            <Text style={styles.sectionTitle}>Anggota Kelompok</Text>
            <FlatList
              data={kelompok.anak}
              keyExtractor={(item) => item.id_anak.toString()}
              renderItem={({ item }) => (
                <AnakItem 
                  anak={item} 
                  onPress={() => handleAnakPress(item)} 
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.anakList}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Edit Kelompok"
            onPress={handleEditKelompok}
            style={styles.editButton}
          />
          <Button
            title="Kembali"
            onPress={handleBack}
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 15,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E86DE',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoLabel: {
    width: '40%',
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  anakSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingHorizontal: 15,
  },
  anakList: {
    paddingHorizontal: 15,
  },
  anakItem: {
    marginRight: 15,
    alignItems: 'center',
    width: 100,
  },
  anakPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  anakName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#2E86DE',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#555',
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
});

export default DetailKelompokScreen;