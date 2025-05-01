import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  Platform
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUser } from '../../redux/slices/authSlice';
import { anakApi } from '../../api';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const HomeScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, adminShelter } = useAppSelector((state) => state.auth);
  const [anakData, setAnakData] = React.useState({
    total: 0,
    anak_aktif: 0,
    anak_tidak_aktif: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchAnakData = async () => {
      try {
        const response = await anakApi.getAll({ page: 1 });
        setAnakData({
          total: response.pagination.total || 0,
          anak_aktif: response.summary.anak_aktif || 0,
          anak_tidak_aktif: response.summary.anak_tidak_aktif || 0,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to fetch anak data', error);
        setAnakData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchAnakData();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const handleViewanak = (status = null) => {
    navigation.navigate('ListAnak', { status });
  };

  const renderStatCard = (value, label, color, onPress) => (
    <TouchableOpacity 
      style={[styles.statCard, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderMenuIcon = (emoji, backgroundColor, onPress, label) => (
    <TouchableOpacity 
      style={styles.menuCard}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor }]}>
        <Text style={styles.iconText}>{emoji}</Text>
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {anakData.isLoading && <LoadingOverlay />}
      
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Selamat Datang,</Text>
          <Text 
            style={styles.nameText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {adminShelter?.nama_lengkap || user?.username}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Shelter</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shelter:</Text>
            <Text style={styles.infoValue}>
              {adminShelter?.shelter?.nama_shelter || '-'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wilayah Binaan:</Text>
            <Text style={styles.infoValue}>
              {adminShelter?.wilbin?.nama_wilbin || '-'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kantor Cabang:</Text>
            <Text style={styles.infoValue}>
              {adminShelter?.kacab?.nama_kacab || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Data Anak Binaan</Text>
          <View style={styles.statsRow}>
            {renderStatCard(
              anakData.total,
              'Total Anak',
              '#3498db',
              () => handleViewanak()
            )}
            {renderStatCard(
              anakData.anak_aktif,
              'Aktif',
              '#2ecc71',
              () => handleViewanak('aktif')
            )}
            {renderStatCard(
              anakData.anak_tidak_aktif,
              'Tidak Aktif',
              '#e74c3c',
              () => handleViewanak('non-aktif')
            )}
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuGrid}>
            {renderMenuIcon('👧', '#3498db', () => handleViewanak(), 'Anak Binaan')}
            {renderMenuIcon('👤', '#2ecc71', handleViewProfile, 'Profil')}
            {renderMenuIcon('👨‍🏫', '#9b59b6', () => navigation.navigate('TutorList'), 'Tutor')}
            {renderMenuIcon('👥', '#27AE60', () => navigation.navigate('KelompokList'), 'Kelompok')}
            {renderMenuIcon('👪', '#FF9500', () => navigation.navigate('KeluargaList'), 'Keluarga')}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
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
  scrollView: {
    padding: width * 0.05,
    paddingBottom: 30,
  },
  header: {
    marginBottom: height * 0.02,
  },
  welcomeText: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#555',
  },
  nameText: {
    fontSize: isSmallScreen ? 22 : 24,
    fontWeight: 'bold',
    color: '#2E86DE',
    maxWidth: width * 0.8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: height * 0.01,
  },
  infoLabel: {
    width: '40%',
    fontSize: isSmallScreen ? 14 : 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
    color: '#333',
  },
  statsContainer: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: width * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.03,
    borderRadius: 10,
    marginVertical: height * 0.005,
  },
  statNumber: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: width * 0.03,
    color: 'white',
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: height * 0.02,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: width * 0.43,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.04,
    marginVertical: height * 0.01,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuIcon: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.01,
  },
  iconText: {
    fontSize: width * 0.08,
  },
  menuLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: height * 0.02,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
    width: '100%',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: isSmallScreen ? 14 : 16,
  },
});

export default HomeScreen;