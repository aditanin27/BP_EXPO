import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTutorDetail } from '../../redux/slices/tutorSlice';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';
import { IMAGE_BASE_URL } from '../../utils/constants';

const TutorDetailScreen = ({ route, navigation }) => {
  const { tutorId } = route.params;
  const dispatch = useAppDispatch();
  const { detailData, isLoading, error } = useAppSelector((state) => state.tutor);

  useEffect(() => {
    dispatch(fetchTutorDetail(tutorId));
  }, [dispatch, tutorId]);

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Tutor</Text>
        </View>

        {detailData ? (
          <View style={styles.profileContainer}>
            <View style={styles.photoContainer}>
              <Image
                source={{ 
                  uri: detailData.foto_url 
                    ? detailData.foto_url
                    : 'https://berbagipendidikan.org/images/default.png'
                }}
                style={styles.profilePhoto}
              />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Informasi Personal</Text>
              <InfoRow label="Nama Lengkap" value={detailData.nama} />
              <InfoRow label="Email" value={detailData.email} />
              <InfoRow label="No. HP" value={detailData.no_hp} />
              <InfoRow label="Pendidikan" value={detailData.pendidikan} />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Informasi Tutor</Text>
              <InfoRow label="Mata Pelajaran" value={detailData.maple} />
              <InfoRow label="Shelter" value={detailData.shelter?.nama_shelter} />
              <InfoRow label="Kantor Cabang" value={detailData.kacab?.nama_kacab} />
              <InfoRow label="Wilayah Binaan" value={detailData.wilbin?.nama_wilbin} />
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'Gagal memuat detail tutor'}
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

export default TutorDetailScreen;