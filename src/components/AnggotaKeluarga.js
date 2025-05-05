import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image 
} from 'react-native';
import { calculateAge } from '../utils/dateUtils';

const AnggotaKeluargaItem = ({ anak, onPress }) => {
  // Get status color and text
  const getStatusStyle = (status) => {
    switch (status) {
      case 'aktif':
        return { color: '#27ae60', text: 'Aktif' };
      case 'tidak aktif':
      case 'non-aktif':
        return { color: '#f39c12', text: 'Tidak Aktif' };
      case 'Ditolak':
      case 'ditolak':
        return { color: '#e74c3c', text: 'Ditolak' };
      case 'Ditangguhkan':
      case 'ditangguhkan':
        return { color: '#7f8c8d', text: 'Ditangguhkan' };
      default:
        return { color: '#7f8c8d', text: status || 'Tidak Diketahui' };
    }
  };
  
  const statusInfo = getStatusStyle(anak.status_validasi);
  
  return (
    <TouchableOpacity style={styles.anakItem} onPress={onPress}>
      <Image
        source={{ 
          uri: anak.foto_url || 'https://berbagipendidikan.org/images/default.png' 
        }}
        style={styles.anakPhoto}
      />
      <View style={styles.anakInfo}>
        <Text style={styles.anakName}>{anak.full_name}</Text>
        <Text style={styles.anakNickname}>
          {anak.nick_name ? `"${anak.nick_name}"` : ''}
        </Text>
        <View style={styles.anakDetails}>
          <Text style={styles.anakDetail}>
            {anak.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {calculateAge(anak.tanggal_lahir)} tahun
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AnggotaKeluargaList = ({ anakList, onPressAnak, onAddAnak, showAddButton = true, emptyText }) => {
  return (
    <View style={styles.container}>
      {anakList && anakList.length > 0 ? (
        <FlatList
          data={anakList}
          keyExtractor={(item) => item.id_anak.toString()}
          renderItem={({ item }) => (
            <AnggotaKeluargaItem 
              anak={item} 
              onPress={() => onPressAnak(item.id_anak)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {emptyText || 'Belum ada anggota keluarga yang terdaftar'}
          </Text>
          
          {showAddButton && onAddAnak && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={onAddAnak}
            >
              <Text style={styles.addButtonText}>Tambah Anggota</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {showAddButton && anakList && anakList.length > 0 && onAddAnak && (
        <TouchableOpacity 
          style={styles.floatingAddButton}
          onPress={onAddAnak}
        >
          <Text style={styles.floatingAddButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    paddingBottom: 10,
  },
  anakItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  anakPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  anakInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  anakName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  anakNickname: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  anakDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anakDetail: {
    fontSize: 13,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  floatingAddButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingAddButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 30,
  },
});

export default AnggotaKeluargaList;