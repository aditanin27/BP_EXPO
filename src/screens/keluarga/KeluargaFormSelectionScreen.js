import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Image 
} from 'react-native';

const KeluargaFormSelectionScreen = ({ navigation }) => {
  const handleAddKeluarga = () => {
    navigation.navigate('TambahKeluarga');
  };

  const handleSubmitAnak = () => {
    navigation.navigate('PengajuanAnak');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pilih Jenis Pengajuan</Text>
        <Text style={styles.headerSubtitle}>
          Silakan pilih jenis pengajuan yang ingin Anda lakukan
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleAddKeluarga}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.optionIcon}>👪</Text>
          </View>
          <Text style={styles.optionTitle}>Tambah Keluarga Baru</Text>
          <Text style={styles.optionDescription}>
            Mengajukan data keluarga baru beserta anggota pertamanya
          </Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleSubmitAnak}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.optionIcon}>👧</Text>
          </View>
          <Text style={styles.optionTitle}>Tambah Anak ke Keluarga</Text>
          <Text style={styles.optionDescription}>
            Mengajukan anak baru untuk keluarga yang sudah terdaftar
          </Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Kembali</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionIcon: {
    fontSize: 30,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
    paddingRight: 30,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#555',
    marginTop: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default KeluargaFormSelectionScreen;