import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
// import util formatting tanggal
import { formatBirthDate } from '../../../utils/dateUtils';

const InformasiAnakScreen = ({ route }) => {
  const { selectedAnak } = route.params;

  const renderInfoSection = (title, data) => (
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {Object.entries(data).map(([label, value]) => (
        <View key={label} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || '-'}</Text>
        </View>
      ))}
    </View>
  );

  const informasiPribadi = {
    'NIK Anak': selectedAnak.nik_anak,
    'Nama Lengkap': selectedAnak.full_name,
    'Nama Panggilan': selectedAnak.nick_name,
    'Jenis Kelamin': selectedAnak.jenis_kelamin,
    'Tempat Lahir': selectedAnak.tempat_lahir,
    // format tanggal lahir menggunakan util
    'Tanggal Lahir': formatBirthDate(selectedAnak.tanggal_lahir),
    'Agama': selectedAnak.agama,
    'Anak Ke': `${selectedAnak.anak_ke} dari ${selectedAnak.dari_bersaudara} bersaudara`,
  };

  const informasiTambahan = {
    'Tinggal Bersama': selectedAnak.tinggal_bersama,
    'Transportasi': selectedAnak.transportasi,
    'Jarak Rumah': selectedAnak.jarak_rumah,
    'Pelajaran Favorit': selectedAnak.pelajaran_favorit,
    'Hobi': selectedAnak.hobi,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderInfoSection('Informasi Pribadi', informasiPribadi)}
        {renderInfoSection('Informasi Tambahan', informasiTambahan)}
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
    padding: 20,
  },
  infoSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
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
});

export default InformasiAnakScreen;
