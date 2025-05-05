import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProfile } from '../../redux/slices/profileSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';
import ProfileImagePicker from '../../components/ImagePicker';
import { api } from '../../api';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.profile);
  const { user } = useAppSelector((state) => state.auth);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const adminShelter = data?.admin_shelter;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleImageSelected = async (imageData) => {
    try {
      setIsUploading(true);
      const result = await api.updateProfileImage(imageData);
      
      if (result.success) {
        // Refresh profile data
        dispatch(fetchProfile());
        Alert.alert('Sukses', 'Foto profil berhasil diperbarui');
      } else {
        Alert.alert('Gagal', result.message || 'Gagal memperbarui foto profil');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Terjadi kesalahan saat mengupload gambar');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Determine photo URL
  const photoUrl = adminShelter?.foto_url 
    ? (adminShelter.foto_url.startsWith('http') 
      ? adminShelter.foto_url 
      : `https://berbagipendidikan.org${adminShelter.foto_url}`)
    : 'https://berbagipendidikan.org/images/default.png';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Admin Shelter</Text>
        </View>

        {adminShelter ? (
          <View style={styles.profileContainer}>
            <ProfileImagePicker 
              imageUri={photoUrl}
              onImageSelected={handleImageSelected}
              isUploading={isUploading}
            />

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Informasi Personal</Text>
              <InfoRow label="Nama Lengkap" value={adminShelter.nama_lengkap} />
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="No. HP" value={adminShelter.no_hp} />
              <InfoRow label="Alamat" value={adminShelter.alamat_adm} />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Informasi Shelter</Text>
              <InfoRow label="Nama Shelter" value={adminShelter.shelter?.nama_shelter} />
              <InfoRow label="Koordinator" value={adminShelter.shelter?.nama_koordinator} />
              <InfoRow label="No. Telepon" value={adminShelter.shelter?.no_telpon} />
              <InfoRow label="Alamat" value={adminShelter.shelter?.alamat} />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Informasi Cabang</Text>
              <InfoRow label="Wilayah Binaan" value={adminShelter.wilbin?.nama_wilbin} />
              <InfoRow label="Kantor Cabang" value={adminShelter.kacab?.nama_kacab} />
              <InfoRow label="Alamat Cabang" value={adminShelter.kacab?.alamat} />
              <InfoRow label="No. Telepon" value={adminShelter.kacab?.no_telpon} />
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'Failed to load profile data. Please try again.'}
            </Text>
          </View>
        )}

        <Button
          title="Kembali"
          onPress={handleBack}
          style={styles.backButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  profileContainer: {
    alignItems: 'center',
  },
  photoContainer: {
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
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
    width: '100%',
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#555',
  },
});

export default ProfileScreen;