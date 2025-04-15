import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUser } from '../../redux/slices/authSlice';
import Button from '../../components/Button';

const HomeScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, adminShelter } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <View style={styles.buttonContainer}>
          <Button
            title="Lihat Profil"
            onPress={handleViewProfile}
            style={styles.profileButton}
          />
          
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
  buttonContainer: {
    marginTop: 10,
  },
  profileButton: {
    backgroundColor: '#2E86DE',
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