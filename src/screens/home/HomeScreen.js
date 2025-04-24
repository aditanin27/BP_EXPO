import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUser } from '../../redux/slices/authSlice';
import { fetchChildren } from '../../redux/slices/childrenSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const HomeScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, adminShelter } = useAppSelector((state) => state.auth);
  const { 
    isLoading, 
    pagination 
  } = useAppSelector((state) => state.children);

  useEffect(() => {
    dispatch(fetchChildren({ page: 1 }));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const handleViewChildren = (status = null) => {
    navigation.navigate('ChildrenList', { status });
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Selamat Datang,</Text>
          <Text style={styles.nameText}>{adminShelter?.nama_lengkap || user?.username}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Shelter</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Shelter:</Text>
            <Text style={styles.infoValue}>{adminShelter?.shelter?.nama_shelter || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wilayah Binaan:</Text>
            <Text style={styles.infoValue}>{adminShelter?.wilbin?.nama_wilbin || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kantor Cabang:</Text>
            <Text style={styles.infoValue}>{adminShelter?.kacab?.nama_kacab || '-'}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Data Anak Binaan</Text>
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={[styles.statCard, styles.totalCard]}
              onPress={() => handleViewChildren()}
            >
              <Text style={styles.statNumber}>{pagination.total || 0}</Text>
              <Text style={styles.statLabel}>Total Anak</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, styles.activeCard]}
              onPress={() => handleViewChildren('aktif')}
            >
              <Text style={styles.statNumber}>{pagination.anak_aktif || 0}</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, styles.inactiveCard]}
              onPress={() => handleViewChildren('non-aktif')}
            >
              <Text style={styles.statNumber}>{pagination.anak_tidak_aktif || 0}</Text>
              <Text style={styles.statLabel}>Tidak Aktif</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuRow}>
            <TouchableOpacity 
              style={styles.menuCard}
              onPress={() => handleViewChildren()}
            >
              <View style={[styles.menuIcon, styles.childrenIcon]}>
                <Text style={styles.iconText}>👧</Text>
              </View>
              <Text style={styles.menuLabel}>Anak Binaan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuCard}
              onPress={handleViewProfile}
            >
              <View style={[styles.menuIcon, styles.profileIcon]}>
                <Text style={styles.iconText}>👤</Text>
              </View>
              <Text style={styles.menuLabel}>Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity 
  style={styles.menuCard}
  onPress={() => navigation.navigate('TutorList')}
>
  <View style={[styles.menuIcon, styles.tutorIcon]}>
    <Text style={styles.iconText}>👨‍🏫</Text>
  </View>
  <Text style={styles.menuLabel}>Tutor</Text>
</TouchableOpacity>
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    color: '#555',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  card: {
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: '35%',
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  totalCard: {
    backgroundColor: '#3498db',
  },
  activeCard: {
    backgroundColor: '#2ecc71',
  },
  inactiveCard: {
    backgroundColor: '#e74c3c',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
  },
  menuCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  childrenIcon: {
    backgroundColor: '#3498db',
  },
  profileIcon: {
    backgroundColor: '#2ecc71',
  },
  iconText: {
    fontSize: 30,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutText: {
    color: '#ff3b30',
  },
  tutorIcon: {
    backgroundColor: '#9b59b6', 
  },
});

export default HomeScreen;