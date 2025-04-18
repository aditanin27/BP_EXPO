import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUser } from '../../redux/slices/authSlice';
import { fetchChildren } from '../../redux/slices/childrenSlice';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const HomeScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, adminShelter } = useAppSelector((state) => state.auth);
  const { list, isLoading } = useAppSelector((state) => state.children);
  const [childCount, setChildCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  useEffect(() => {
    if (list) {
      setChildCount(list.length);
      
      // Count active and inactive children
      const active = list.filter(child => child.status_validasi === 'aktif').length;
      const inactive = list.filter(child => child.status_validasi !== 'aktif').length;
      
      setActiveCount(active);
      setInactiveCount(inactive);
    }
  }, [list]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const handleViewChildren = () => {
    navigation.navigate('ChildrenList');
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
              onPress={handleViewChildren}
            >
              <Text style={styles.statNumber}>{childCount}</Text>
              <Text style={styles.statLabel}>Total Anak</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, styles.activeCard]}
              onPress={handleViewChildren}
            >
              <Text style={styles.statNumber}>{activeCount}</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, styles.inactiveCard]}
              onPress={handleViewChildren}
            >
              <Text style={styles.statNumber}>{inactiveCount}</Text>
              <Text style={styles.statLabel}>Tidak Aktif</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuRow}>
            <TouchableOpacity 
              style={styles.menuCard}
              onPress={handleViewChildren}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  totalCard: {
    borderTopColor: '#2E86DE',
    borderTopWidth: 3,
  },
  activeCard: {
    borderTopColor: '#27ae60',
    borderTopWidth: 3,
  },
  inactiveCard: {
    borderTopColor: '#f39c12',
    borderTopWidth: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  menuContainer: {
    marginBottom: 30,
  },
  menuRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    marginRight: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  menuCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    marginRight: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 28,
  },
  childrenIcon: {
    backgroundColor: '#e3f2fd',
  },
  profileIcon: {
    backgroundColor: '#e8f5e9',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
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
});

export default HomeScreen;