import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';

const KeluargaFormSelectionScreen = ({ navigation }) => {
  const handleNewFamily = () => {
    navigation.navigate('TambahKeluarga');
  };

  const handleNewChildWithKK = () => {
    navigation.navigate('PengajuanAnak');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pilih Jenis Pengajuan</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleNewFamily}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👪</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Tambah Keluarga Baru</Text>
            <Text style={styles.optionDescription}>
              Daftarkan keluarga baru beserta data anak pertama
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleNewChildWithKK}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👧</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Ajukan Anak Baru dengan KK</Text>
            <Text style={styles.optionDescription}>
              Daftarkan anak baru yang masih dalam satu keluarga
            </Text>
          </View>
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
  optionsContainer: {
    padding: 20,
    flex: 1,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 30,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    margin: 20,
    backgroundColor: '#555',
  }
});

export default KeluargaFormSelectionScreen;