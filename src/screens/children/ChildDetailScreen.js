import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchChildById } from '../../redux/slices/childrenSlice';
import LoadingOverlay from '../../components/LoadingOverlay';

const ChildDetailScreen = ({ route, navigation }) => {
  const { childId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedChild, isLoading, error } = useAppSelector((state) => state.children);

  useEffect(() => {
    dispatch(fetchChildById(childId));
  }, [dispatch, childId]);

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
      childName: selectedChild?.full_name || 'Anak',
      selectedChild: selectedChild 
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

  if (!selectedChild) {
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
  const childImageUrl = selectedChild.foto_url || 
    (selectedChild.foto ? `https://berbagipendidikan.org/storage/Anak/${selectedChild.id_anak}/${selectedChild.foto}` : defaultImageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Image 
            source={{ uri: childImageUrl }} 
            style={styles.childPhoto} 
            defaultSource={{ uri: defaultImageUrl }}
          />
          <Text style={styles.childName}>{selectedChild.full_name}</Text>
          {selectedChild.nick_name && (
            <Text style={styles.childNickname}>"{selectedChild.nick_name}"</Text>
          )}
        </View>

        {/* Menu Grid */}
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
  childPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
  },
  childName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  childNickname: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  menuItem: {
    width: '40%',
    aspectRatio: 1,
    margin: 10,
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

export default ChildDetailScreen;