import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAnakById } from '../../redux/slices/anakSlice';
import LoadingOverlay from '../../components/LoadingOverlay';

const DetailAnakScreen = ({ route, navigation }) => {
  const { idAnak } = route.params;
  const dispatch = useAppDispatch();
  const { selectedAnak, isLoading, error } = useAppSelector((state) => state.anak);

  useEffect(() => {
    dispatch(fetchAnakById(idAnak));
  }, [dispatch, idAnak]);

  const menuItems = [
    { 
      title: 'Informasi Anak', 
      screen: 'InformasiAnak',
      icon: '📋'
    },
    { 
      title: 'Raport', 
      screen: 'Raport',
      icon: '📚'
    },
    { 
      title: 'Prestasi', 
      screen: 'Prestasi',
      icon: '🏆'
    },
    { 
      title: 'Surat', 
      screen: 'Surat',
      icon: '✉️'
    },
    { 
      title: 'Riwayat', 
      screen: 'Riwayat',
      icon: '📖'
    },
    { 
      title: 'Cerita', 
      screen: 'Cerita',
      icon: '📝'
    },
    { 
      title: 'Nilai Anak', 
      screen: 'NilaiAnak',
      icon: '📊'
    },
    { 
      title: 'Rapor Shelter', 
      screen: 'RaporShelter',
      icon: '🏠'
    }
  ];

  const navigateToScreen = (screen) => {
    navigation.navigate(screen, { 
      anakName: selectedAnak?.full_name || 'Anak',
      selectedAnak: selectedAnak 
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedAnak) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data anak tidak ditemukan</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Default image URL if foto_url is undefined
  const defaultImageUrl = 'https://berbagipendidikan.org/images/default.png';
  const anakImageUrl = selectedAnak.foto_url || 
    (selectedAnak.foto ? `https://berbagipendidikan.org/storage/Anak/${selectedAnak.id_anak}/${selectedAnak.foto}` : defaultImageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Image 
            source={{ uri: anakImageUrl }} 
            style={styles.anakPhoto} 
            defaultSource={{ uri: defaultImageUrl }}
          />
          <Text style={styles.anakName}>{selectedAnak.full_name}</Text>
          {selectedAnak.nick_name && (
            <Text style={styles.anakNickname}>"{selectedAnak.nick_name}"</Text>
          )}
        </View>

        {/* Menu Grid */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Menu</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((menu, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem}
                onPress={() => navigateToScreen(menu.screen)}
              >
                <Text style={styles.menuIcon}>{menu.icon}</Text>
                <Text style={styles.menuTitle}>{menu.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  anakPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
  },
  anakName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  anakNickname: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  menuSection: {
    margin: 15,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
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
  backButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DetailAnakScreen;