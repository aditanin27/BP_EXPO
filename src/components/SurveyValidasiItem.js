import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SurveyValidasiItem = ({ survey, onPress, onValidate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const keluarga = survey?.keluarga || {};
  
  const getStatusStyle = () => {
    const hasil = survey.hasil_survey;
    
    if (!hasil) {
      return { 
        backgroundColor: '#f5f5f5', 
        textColor: '#777',
        text: 'Menunggu Validasi' 
      };
    } else if (hasil === 'Layak') {
      return { 
        backgroundColor: '#e6f7f0', 
        textColor: '#27ae60',
        text: 'Layak' 
      };
    } else if (hasil === 'Tidak Layak') {
      return { 
        backgroundColor: '#ffe6e6', 
        textColor: '#e74c3c',
        text: 'Tidak Layak' 
      };
    } else if (hasil === 'Tambah Kelayakan') {
      return { 
        backgroundColor: '#e6f2ff', 
        textColor: '#3498db',
        text: 'Tambah Kelayakan' 
      };
    } else {
      return { 
        backgroundColor: '#f5f5f5', 
        textColor: '#777',
        text: hasil || 'Belum Diputuskan' 
      };
    }
  };
  
  const statusStyle = getStatusStyle();
  
  // Format penghasilan for display
  const formatPenghasilan = (penghasilan) => {
    if (!penghasilan) return '-';
    
    switch(penghasilan) {
      case 'dibawah_500k':
        return 'di bawah Rp 500.000';
      case '500k_1500k':
        return 'Rp 500.000 - Rp 1.500.000';
      case '1500k_2500k':
        return 'Rp 1.500.000 - Rp 2.500.000';
      case '2500k_3500k':
        return 'Rp 2.500.000 - Rp 3.500.000';
      case '3500k_5000k':
        return 'Rp 3.500.000 - Rp 5.000.000';
      case '5000k_7000k':
        return 'Rp 5.000.000 - Rp 7.000.000';
      case '7000k_10000k':
        return 'Rp 7.000.000 - Rp 10.000.000';
      case 'diatas_10000k':
        return 'di atas Rp 10.000.000';
      default:
        return penghasilan;
    }
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.noKKText}>KK: {keluarga.no_kk || '-'}</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
            {statusStyle.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.kepalaKeluarga}>{keluarga.kepala_keluarga || '-'}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wilbin:</Text>
          <Text style={styles.infoValue}>{keluarga.wilbin?.nama_wilbin || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shelter:</Text>
          <Text style={styles.infoValue}>{keluarga.shelter?.nama_shelter || '-'}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pendidikan:</Text>
          <Text style={styles.infoValue}>{survey.pendidikan_kepala_keluarga || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pekerjaan:</Text>
          <Text style={styles.infoValue}>{survey.pekerjaan_kepala_keluarga || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Penghasilan:</Text>
          <Text style={styles.infoValue}>{formatPenghasilan(survey.penghasilan) || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status Anak:</Text>
          <Text style={styles.infoValue}>{survey.status_anak || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tanggal:</Text>
          <Text style={styles.infoValue}>
            {formatDate(survey.tanggal_survey) || 'Belum ada'}
          </Text>
        </View>
      </View>
      
      {/* Action buttons */}
      {!survey.hasil_survey && (
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.layakButton]}
            onPress={() => onValidate(survey.id_survey, 'Layak')}
          >
            <Text style={styles.actionButtonText}>Layak</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.tidakLayakButton]}
            onPress={() => onValidate(survey.id_survey, 'Tidak Layak')}
          >
            <Text style={styles.actionButtonText}>Tidak Layak</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Notes if already validated */}
      {survey.hasil_survey && survey.keterangan_hasil && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Catatan:</Text>
          <Text style={styles.notesText}>{survey.keterangan_hasil}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noKKText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#2E86DE',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  kepalaKeluarga: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  layakButton: {
    backgroundColor: '#27ae60',
  },
  tidakLayakButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notesContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  }
});

export default SurveyValidasiItem;